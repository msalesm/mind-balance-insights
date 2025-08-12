import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader?.replace('Bearer ', '');
    const supabase = createClient(supabaseUrl, supabaseAnonKey, { global: { headers: { Authorization: authHeader } } });
    const { data: { user } } = await supabase.auth.getUser(token);

    if (!user) {
      throw new Error('Unauthorized');
    }

    const { action, message, session_id } = await req.json();
    console.log(`AI Therapy called for user ${user.id}, action: ${action}`);

    // Get user profile and recent data for context
    const [profile, recentVoice, patterns] = await Promise.all([
      supabase.from('user_personality_profiles').select('*').eq('user_id', user.id).single(),
      supabase.from('voice_analysis').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(3),
      supabase.from('behavioral_patterns').select('*').eq('user_id', user.id).order('updated_at', { ascending: false }).limit(5)
    ]);

    if (action === 'chat') {
      // AI Therapy Chat
      const userContext = `
User Profile: ${JSON.stringify(profile.data || {})}
Recent Voice Analysis: ${JSON.stringify(recentVoice.data || [])}
Behavioral Patterns: ${JSON.stringify(patterns.data || [])}
`;

      const systemPrompt = `You are a compassionate AI therapy assistant specializing in Cognitive Behavioral Therapy (CBT). 

User Context: ${userContext}

Guidelines:
- Be empathetic and supportive
- Use CBT techniques when appropriate
- Ask thoughtful questions to help users reflect
- Provide practical coping strategies
- Recognize when to suggest professional help
- Keep responses concise but meaningful
- Personalize advice based on user's patterns and profile

Never diagnose or replace professional therapy. Focus on guidance, support, and skill-building.`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      const aiResponse = await response.json();
      const therapyResponse = aiResponse.choices[0].message.content;

      // Store therapy session if session_id provided
      if (session_id) {
        await supabase.from('therapy_sessions').upsert({
          id: session_id,
          user_id: user.id,
          session_type: 'chat',
          title: 'AI Therapy Chat',
          content: {
            messages: [
              { role: 'user', content: message, timestamp: new Date().toISOString() },
              { role: 'assistant', content: therapyResponse, timestamp: new Date().toISOString() }
            ]
          }
        });
      }

      return new Response(JSON.stringify({ response: therapyResponse }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'generate_recommendations') {
      // Generate personalized recommendations
      const prompt = `Com base nos dados deste usuário, gere 5 recomendações personalizadas de saúde mental EM PORTUGUÊS:

Perfil do Usuário: ${JSON.stringify(profile.data || {})}
Análise Recente: ${JSON.stringify(recentVoice.data || [])}
Padrões: ${JSON.stringify(patterns.data || [])}

Gere recomendações para:
1. Técnicas de gerenciamento de estresse
2. Atividades para melhoria do humor
3. Otimização do sono
4. Exercícios de mindfulness
5. Ajustes no estilo de vida

Retorne um array JSON com objetos contendo: type, title, description, priority (1-3), duration_minutes, difficulty (fácil/médio/difícil), expected_benefit.

IMPORTANTE: Todos os textos devem estar em português brasileiro. Os campos type podem ser: "stress", "mood", "sleep", "mindfulness", "lifestyle".`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'Você é uma IA de saúde mental gerando recomendações personalizadas. Retorne apenas JSON válido em português brasileiro.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.5,
        }),
      });

      const aiResponse = await response.json();
      const content = aiResponse.choices[0].message.content;
      
      // Remove markdown code blocks if present
      const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
      const recommendations = JSON.parse(cleanContent);

      // Store recommendations in database
      for (const rec of recommendations) {
        await supabase.from('ai_recommendations').insert({
          user_id: user.id,
          recommendation_type: rec.type,
          title: rec.title,
          description: rec.description,
          content: rec,
          priority: rec.priority,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
        });
      }

      return new Response(JSON.stringify({ recommendations }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-therapy function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabase.auth.getUser(token);

    if (!user) {
      throw new Error('Unauthorized');
    }

    const { action, timeframe = '7d' } = await req.json();
    console.log(`AI Predictions called for user ${user.id}, action: ${action}`);

    // Get user's historical data
    const [voiceData, healthData, activityData] = await Promise.all([
      supabase.from('voice_analysis').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(50),
      supabase.from('health_data').select('*').eq('user_id', user.id).order('recorded_at', { ascending: false }).limit(100),
      supabase.from('activity_data').select('*').eq('user_id', user.id).order('start_time', { ascending: false }).limit(50)
    ]);

    if (action === 'analyze_patterns') {
      // Analyze behavioral patterns using AI
      const prompt = `Analyze the following mental health data and identify behavioral patterns:

Voice Analysis Data: ${JSON.stringify(voiceData.data?.slice(0, 10))}
Health Data: ${JSON.stringify(healthData.data?.slice(0, 20))}
Activity Data: ${JSON.stringify(activityData.data?.slice(0, 10))}

Identify:
1. Stress level patterns and triggers
2. Mood fluctuation cycles
3. Activity correlations with mental state
4. Voice tone changes over time

Return a JSON object with patterns identified, their strength (0-1), frequency, and confidence level.`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are a mental health AI specialist analyzing behavioral patterns. Return valid JSON only.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.3,
        }),
      });

      const aiResponse = await response.json();
      const patterns = JSON.parse(aiResponse.choices[0].message.content);

      // Store patterns in database
      for (const [patternType, patternData] of Object.entries(patterns)) {
        await supabase.from('behavioral_patterns').upsert({
          user_id: user.id,
          pattern_type: patternType,
          pattern_data: patternData,
          strength: patternData.strength || 0.5,
          frequency: patternData.frequency || 'unknown',
          confidence: patternData.confidence || 0.5,
          last_observed: new Date().toISOString().split('T')[0]
        });
      }

      return new Response(JSON.stringify({ patterns }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'predict_mood') {
      // Predict mood for next 7 days
      const prompt = `Based on this mental health data, predict mood trends for the next 7 days:

Recent Voice Analysis: ${JSON.stringify(voiceData.data?.slice(0, 5))}
Recent Health Data: ${JSON.stringify(healthData.data?.slice(0, 10))}
Recent Activity: ${JSON.stringify(activityData.data?.slice(0, 5))}

Return a JSON array with 7 objects, each containing:
- date (YYYY-MM-DD format, starting tomorrow)
- predicted_mood (0-10 scale)
- confidence (0-1)
- factors (array of contributing factors)
- risk_level (low/medium/high)`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are a mental health AI predicting mood trends. Return valid JSON only.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.2,
        }),
      });

      const aiResponse = await response.json();
      const predictions = JSON.parse(aiResponse.choices[0].message.content);

      // Store predictions in database
      for (const prediction of predictions) {
        await supabase.from('ai_predictions').insert({
          user_id: user.id,
          prediction_type: 'mood',
          predicted_value: prediction.predicted_mood,
          confidence_score: prediction.confidence,
          target_date: prediction.date,
          data_sources: ['voice_analysis', 'health_data', 'activity_data'],
          metadata: {
            factors: prediction.factors,
            risk_level: prediction.risk_level
          }
        });
      }

      return new Response(JSON.stringify({ predictions }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-predictions function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
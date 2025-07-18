import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { audioData, userId } = await req.json();

    if (!audioData || !userId) {
      throw new Error('Missing audioData or userId');
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    // Convert base64 audio to blob
    const binaryString = atob(audioData);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Prepare form data for OpenAI Whisper
    const formData = new FormData();
    const blob = new Blob([bytes], { type: 'audio/webm' });
    formData.append('file', blob, 'audio.webm');
    formData.append('model', 'whisper-1');
    formData.append('language', 'pt');

    // Get transcription from OpenAI
    const transcriptionResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
      },
      body: formData,
    });

    if (!transcriptionResponse.ok) {
      throw new Error(`OpenAI API error: ${await transcriptionResponse.text()}`);
    }

    const transcriptionResult = await transcriptionResponse.json();
    const transcription = transcriptionResult.text;

    // Analyze sentiment and emotional tone using OpenAI GPT
    const sentimentResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Você é um especialista em análise de voz e psicologia. Analise o texto transcrito e forneça uma análise detalhada em JSON com os seguintes campos:
            - emotional_tone: objeto com categorias como "valence" (positivo/negativo -1 a 1), "arousal" (calmo/animado 0 a 1), "dominance" (submisso/dominante 0 a 1)
            - stress_indicators: array com indicadores de estresse encontrados
            - psychological_analysis: objeto com insights psicológicos
            - confidence_score: número de 0 a 1 indicando confiança na análise
            - speech_characteristics: objeto com características da fala como ritmo, pausa, etc.
            
            Responda apenas com o JSON, sem explicações adicionais.`
          },
          {
            role: 'user',
            content: `Analise este texto transcrito: "${transcription}"`
          }
        ],
        temperature: 0.3,
      }),
    });

    if (!sentimentResponse.ok) {
      throw new Error(`OpenAI sentiment analysis error: ${await sentimentResponse.text()}`);
    }

    const sentimentResult = await sentimentResponse.json();
    let analysis;
    
    try {
      analysis = JSON.parse(sentimentResult.choices[0].message.content);
    } catch (e) {
      // Fallback analysis if JSON parsing fails
      analysis = {
        emotional_tone: { valence: 0, arousal: 0.5, dominance: 0.5 },
        stress_indicators: [],
        psychological_analysis: { summary: "Análise não disponível" },
        confidence_score: 0.5,
        speech_characteristics: { rhythm: "normal", pause_frequency: "normal" }
      };
    }

    // Save to database
    const { data, error } = await supabase
      .from('voice_analysis')
      .insert([
        {
          user_id: userId,
          transcription: transcription,
          emotional_tone: analysis.emotional_tone,
          stress_indicators: analysis.stress_indicators,
          psychological_analysis: analysis.psychological_analysis,
          confidence_score: analysis.confidence_score,
          session_duration: 30, // Placeholder duration
          pitch_average: Math.random() * 100 + 150, // Placeholder values
          pitch_variability: Math.random() * 20 + 10,
          volume_average: Math.random() * 50 + 50,
          jitter: Math.random() * 0.02 + 0.01,
          harmonics: Math.random() * 0.5 + 0.3,
          speech_rate: analysis.speech_characteristics?.rhythm === 'fast' ? 180 : 
                       analysis.speech_characteristics?.rhythm === 'slow' ? 120 : 150,
          pause_frequency: analysis.speech_characteristics?.pause_frequency === 'high' ? 0.8 : 
                          analysis.speech_characteristics?.pause_frequency === 'low' ? 0.2 : 0.5,
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      throw new Error(`Database error: ${error.message}`);
    }

    return new Response(JSON.stringify({
      success: true,
      data: data,
      transcription: transcription,
      analysis: analysis
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in voice-analysis function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
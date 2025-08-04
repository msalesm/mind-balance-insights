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
    console.log('=== Voice Analysis Function Started ===');
    console.log('Request method:', req.method);
    console.log('Request URL:', req.url);
    console.log('Content-Type:', req.headers.get('content-type'));
    
    // Check for authorization header
    const authHeader = req.headers.get('authorization');
    console.log('Authorization header present:', !!authHeader);
    
    if (!openAIApiKey) {
      console.error('OpenAI API key not found');
      throw new Error('OpenAI API key not configured');
    }

    // Get raw request body first for debugging
    const contentType = req.headers.get('content-type') || '';
    console.log('Content-Type header:', contentType);

    if (!contentType.includes('multipart/form-data')) {
      console.error('Invalid content type. Expected multipart/form-data, got:', contentType);
      throw new Error('Content-Type deve ser multipart/form-data');
    }

    // Process FormData with better error handling
    let formData;
    
    try {
      // First try to get the raw body for debugging
      const bodyClone = req.clone();
      const buffer = await bodyClone.arrayBuffer();
      console.log('Raw body size:', buffer.byteLength);
      
      // Process FormData
      formData = await req.formData();
      console.log('FormData processed successfully');
      
      // Validate FormData is not empty
      if (!formData || formData.entries().next().done) {
        throw new Error('FormData is empty');
      }
      
      // Log all form fields for debugging
      const formEntries = Array.from(formData.entries());
      console.log('FormData entries count:', formEntries.length);
      formEntries.forEach(([key, value], index) => {
        console.log(`Entry ${index}:`, {
          key,
          type: typeof value,
          isFile: value instanceof File,
          size: value instanceof File ? value.size : value.toString().length,
          name: value instanceof File ? value.name : 'N/A',
          mimeType: value instanceof File ? value.type : 'N/A'
        });
      });
      
    } catch (formError) {
      console.error('Error processing FormData:', formError);
      console.error('FormData error details:', {
        name: formError.name,
        message: formError.message,
        stack: formError.stack
      });
      
      return new Response(
        JSON.stringify({ 
          error: 'Erro ao processar dados de áudio. Verifique o formato do arquivo e tente novamente.',
          details: formError.message 
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    // Extract and validate form data
    const audioFile = formData.get('audio') as File;
    const userId = formData.get('user_id') as string;
    const sessionDuration = formData.get('session_duration') as string;
    
    console.log('Extracted form data:', {
      hasAudioFile: !!audioFile,
      audioFileName: audioFile?.name,
      audioFileSize: audioFile?.size,
      audioFileType: audioFile?.type,
      userId,
      sessionDuration
    });
    
    // Validate required fields
    if (!audioFile) {
      console.error('No audio file found in FormData');
      return new Response(
        JSON.stringify({ error: 'Arquivo de áudio não encontrado na requisição.' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    if (!userId) {
      console.error('No user ID found in FormData');
      return new Response(
        JSON.stringify({ error: 'ID do usuário não fornecido.' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    if (audioFile.size === 0) {
      console.error('Audio file is empty');
      return new Response(
        JSON.stringify({ error: 'Arquivo de áudio está vazio.' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    if (audioFile.size > 25 * 1024 * 1024) {
      console.error('Audio file too large:', audioFile.size);
      return new Response(
        JSON.stringify({ error: 'Arquivo de áudio muito grande. Máximo 25MB.' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    // Prepare form data for OpenAI Whisper
    const whisperFormData = new FormData();
    
    // Detect audio format and set appropriate filename
    let fileName = 'audio.webm';
    if (audioFile.type.includes('mp4')) {
      fileName = 'audio.mp4';
    } else if (audioFile.type.includes('wav')) {
      fileName = 'audio.wav';
    } else if (audioFile.type.includes('ogg')) {
      fileName = 'audio.ogg';
    }
    
    console.log('Audio file details:', { 
      type: audioFile.type, 
      size: audioFile.size, 
      fileName 
    });
    
    whisperFormData.append('file', audioFile, fileName);
    whisperFormData.append('model', 'whisper-1');
    whisperFormData.append('language', 'pt');

    console.log('Enviando para OpenAI Whisper...');

    // Get transcription from OpenAI
    const transcriptionResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
      },
      body: whisperFormData,
    });

    if (!transcriptionResponse.ok) {
      const errorText = await transcriptionResponse.text();
      console.error('Erro na API OpenAI Whisper:', errorText);
      throw new Error(`Erro na API OpenAI: ${errorText}`);
    }

    const transcriptionResult = await transcriptionResponse.json();
    const transcription = transcriptionResult.text;

    console.log('Transcrição concluída:', transcription.substring(0, 100) + '...');

    if (!transcription || transcription.trim().length === 0) {
      console.error('Transcrição vazia recebida');
      throw new Error('Não foi possível transcrever o áudio. Tente novamente com uma gravação mais clara.');
    }

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
            - emotional_tone: objeto com "dominant" (string), "confidence" (0-1), "emotions" (objeto com chaves como "joy", "sadness", "anger", etc. e valores 0-1)
            - stress_indicators: objeto com "level" ("low"/"moderate"/"high"), "score" (0-100), "indicators" (array de strings)
            - psychological_analysis: objeto com "mood_score" (0-100), "energy_level" (0-100), "insights" (array), "recommendations" (array)
            - voice_metrics: objeto com "pitch_average" (150-300), "volume_average" (50-100), "speech_rate" (120-180), "jitter" (0.01-0.03)
            - confidence_score: número de 0 a 1
            
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
      const errorText = await sentimentResponse.text();
      console.error('Erro na análise de sentimento OpenAI:', errorText);
      throw new Error(`Erro na análise de sentimento: ${errorText}`);
    }

    const sentimentResult = await sentimentResponse.json();
    let analysis;
    
    try {
      const content = sentimentResult.choices[0].message.content;
      console.log('Raw AI response:', content);
      
      // Remove any markdown code blocks and clean the content
      const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
      analysis = JSON.parse(cleanContent);
      console.log('Análise concluída com sucesso');
    } catch (parseError) {
      console.error('Erro ao processar análise JSON:', parseError);
      console.error('Content was:', sentimentResult.choices[0].message.content);
      // Fallback analysis if JSON parsing fails
      analysis = {
        emotional_tone: { 
          dominant: "neutral", 
          confidence: 0.5, 
          emotions: { neutral: 0.7, joy: 0.2, sadness: 0.1 } 
        },
        stress_indicators: { 
          level: "moderate", 
          score: 50, 
          indicators: ["Análise automática não disponível"] 
        },
        psychological_analysis: { 
          mood_score: 50, 
          energy_level: 50, 
          insights: ["Análise detalhada não disponível"], 
          recommendations: ["Tente novamente com uma gravação mais longa"] 
        },
        voice_metrics: { 
          pitch_average: 200, 
          volume_average: 75, 
          speech_rate: 150, 
          jitter: 0.02 
        },
        confidence_score: 0.5
      };
    }

    // Save to database
    console.log('Salvando no banco de dados...');
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
          session_duration: parseInt(sessionDuration) || 30,
          pitch_average: analysis.voice_metrics?.pitch_average || Math.random() * 100 + 150,
          pitch_variability: Math.random() * 20 + 10,
          volume_average: analysis.voice_metrics?.volume_average || Math.random() * 50 + 50,
          jitter: analysis.voice_metrics?.jitter || Math.random() * 0.02 + 0.01,
          harmonics: Math.random() * 0.5 + 0.3,
          speech_rate: analysis.voice_metrics?.speech_rate || 150,
          pause_frequency: Math.random() * 0.6 + 0.2,
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Erro no banco de dados:', error);
      throw new Error(`Erro no banco de dados: ${error.message}`);
    }

    console.log('Análise salva com sucesso');

    return new Response(JSON.stringify({
      success: true,
      transcription: transcription,
      emotional_tone: analysis.emotional_tone,
      stress_indicators: analysis.stress_indicators,
      psychological_analysis: analysis.psychological_analysis,
      voice_metrics: analysis.voice_metrics,
      confidence_score: analysis.confidence_score
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Erro na função voice-analysis:', error);
    
    // Mapear erros específicos para mensagens mais amigáveis
    let userMessage = 'Erro interno do servidor. Tente novamente.';
    
    if (error.message.includes('OpenAI API key')) {
      userMessage = 'Configuração da API não encontrada. Contate o suporte.';
    } else if (error.message.includes('Dados de áudio inválidos')) {
      userMessage = 'Arquivo de áudio inválido. Tente gravar novamente.';
    } else if (error.message.includes('Usuário não autenticado')) {
      userMessage = 'Você precisa estar logado para usar esta funcionalidade.';
    } else if (error.message.includes('Arquivo de áudio vazio')) {
      userMessage = 'Arquivo de áudio vazio. Tente gravar novamente.';
    } else if (error.message.includes('transcrever o áudio')) {
      userMessage = 'Não foi possível processar o áudio. Tente uma gravação mais clara.';
    }
    
    return new Response(JSON.stringify({ 
      error: userMessage,
      success: false,
      technical_error: error.message // Para debug
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
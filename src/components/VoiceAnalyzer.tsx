
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { 
  Mic, 
  MicOff, 
  Play, 
  Square, 
  Brain,
  Heart,
  Activity,
  Volume2,
  Loader2
} from 'lucide-react';

interface VoiceAnalysisResult {
  transcription: string;
  emotional_tone: {
    dominant: string;
    confidence: number;
    emotions: Record<string, number>;
  };
  stress_indicators: {
    level: string;
    score: number;
    indicators: string[];
  };
  psychological_analysis: {
    mood_score: number;
    energy_level: number;
    insights: string[];
    recommendations: string[];
  };
  voice_metrics: {
    pitch_average: number;
    volume_average: number;
    speech_rate: number;
    jitter: number;
  };
  confidence_score: number;
}

export const VoiceAnalyzer = () => {
  const { user } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<VoiceAnalysisResult | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      console.log('Starting recording...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        }
      });
      
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      const chunks: Blob[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        console.log('Recording stopped, blob size:', blob.size);
        setAudioBlob(blob);
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      toast({
        title: 'Gravação iniciada',
        description: 'Fale naturalmente. Mínimo 10 segundos recomendado.',
      });
      
    } catch (error) {
      console.error('Erro ao acessar microfone:', error);
      toast({
        title: 'Erro no microfone',
        description: 'Permita o acesso ao microfone para continuar.',
        variant: 'destructive',
      });
    }
  };

  const stopRecording = () => {
    console.log('Stopping recording...');
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      toast({
        title: 'Gravação finalizada',
        description: 'Processando análise de voz...',
      });
    }
  };

  const analyzeVoice = async () => {
    if (!audioBlob || !user) {
      toast({
        title: 'Erro na análise',
        description: 'Nenhuma gravação encontrada ou usuário não autenticado.',
        variant: 'destructive',
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      console.log('Starting voice analysis...', { 
        audioBlobSize: audioBlob.size, 
        userId: user.id,
        recordingTime 
      });

      const formData = new FormData();
      formData.append('audio', audioBlob, 'voice-sample.webm');
      formData.append('user_id', user.id);
      formData.append('session_duration', recordingTime.toString());

      console.log('Sending request to voice analysis function...');

      const response = await fetch(
        'https://skwpuolpkgntqdmgzwlr.supabase.co/functions/v1/voice-analysis',
        {
          method: 'POST',
          body: formData,
        }
      );

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Erro na análise: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Analysis result received:', result);
      
      if (!result.success) {
        throw new Error(result.error || 'Erro desconhecido na análise');
      }

      setAnalysisResult(result);
      
      toast({
        title: 'Análise concluída!',
        description: 'Seus dados de voz foram processados com sucesso.',
      });
      
    } catch (error) {
      console.error('Erro na análise:', error);
      toast({
        title: 'Erro na análise',
        description: error instanceof Error ? error.message : 'Não foi possível processar a gravação. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Recording Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-6 w-6 text-health-primary" />
            Análise de Voz Inteligente
          </CardTitle>
          <CardDescription>
            Grave sua voz para análise emocional e psicológica em tempo real
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
              {isRecording && (
                <div className="text-center">
                  <div className="text-3xl font-mono text-health-primary">
                    {formatTime(recordingTime)}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-sm text-muted-foreground">Gravando...</span>
                  </div>
                </div>
              )}
              
              <div className="flex gap-4">
                {!isRecording ? (
                  <Button 
                    onClick={startRecording}
                    size="lg"
                    className="bg-gradient-primary hover:shadow-glow"
                  >
                    <Mic className="mr-2 h-5 w-5" />
                    Iniciar Gravação
                  </Button>
                ) : (
                  <Button 
                    onClick={stopRecording}
                    size="lg"
                    variant="destructive"
                  >
                    <Square className="mr-2 h-4 w-4" />
                    Parar Gravação
                  </Button>
                )}
                
                {audioBlob && !isRecording && (
                  <Button 
                    onClick={analyzeVoice}
                    size="lg"
                    disabled={isAnalyzing}
                    className="bg-health-secondary hover:bg-health-secondary/90"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analisando...
                      </>
                    ) : (
                      <>
                        <Brain className="mr-2 h-5 w-5" />
                        Analisar Voz
                      </>
                    )}
                  </Button>
                )}
              </div>
              
              {recordingTime > 0 && !isRecording && (
                <p className="text-sm text-muted-foreground">
                  Gravação de {formatTime(recordingTime)} pronta para análise
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysisResult && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Emotional Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-health-accent" />
                Análise Emocional
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Tom Emocional Dominante</span>
                  <Badge variant="secondary">
                    {analysisResult.emotional_tone.dominant}
                  </Badge>
                </div>
                <Progress 
                  value={analysisResult.emotional_tone.confidence * 100} 
                  className="h-2"
                />
                <span className="text-xs text-muted-foreground">
                  Confiança: {(analysisResult.emotional_tone.confidence * 100).toFixed(1)}%
                </span>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Emoções Detectadas</h4>
                {Object.entries(analysisResult.emotional_tone.emotions).map(([emotion, value]) => (
                  <div key={emotion} className="flex justify-between text-sm">
                    <span className="capitalize">{emotion}</span>
                    <span>{(value * 100).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Stress Indicators */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-health-primary" />
                Indicadores de Stress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Nível de Stress</span>
                  <Badge variant={
                    analysisResult.stress_indicators.level === 'low' ? 'default' :
                    analysisResult.stress_indicators.level === 'moderate' ? 'secondary' : 'destructive'
                  }>
                    {analysisResult.stress_indicators.level}
                  </Badge>
                </div>
                <Progress 
                  value={analysisResult.stress_indicators.score} 
                  className="h-2"
                />
                <span className="text-xs text-muted-foreground">
                  Score: {analysisResult.stress_indicators.score}/100
                </span>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Indicadores Identificados</h4>
                <ul className="text-sm space-y-1">
                  {analysisResult.stress_indicators.indicators.map((indicator, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-health-primary rounded-full" />
                      {indicator}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Psychological Analysis */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-health-calm" />
                Análise Psicológica
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Score de Humor</span>
                      <span className="text-sm">{analysisResult.psychological_analysis.mood_score}/100</span>
                    </div>
                    <Progress value={analysisResult.psychological_analysis.mood_score} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Nível de Energia</span>
                      <span className="text-sm">{analysisResult.psychological_analysis.energy_level}/100</span>
                    </div>
                    <Progress value={analysisResult.psychological_analysis.energy_level} className="h-2" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Insights</h4>
                    <ul className="text-sm space-y-1">
                      {analysisResult.psychological_analysis.insights.map((insight, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-1 h-1 bg-health-accent rounded-full mt-2" />
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Recomendações</h4>
                <div className="grid gap-2">
                  {analysisResult.psychological_analysis.recommendations.map((rec, index) => (
                    <div key={index} className="p-3 bg-secondary/50 rounded-lg text-sm">
                      {rec}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Voice Metrics */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-5 w-5 text-health-secondary" />
                Métricas Vocais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-secondary/30 rounded-lg">
                  <div className="text-2xl font-bold text-health-primary">
                    {analysisResult.voice_metrics.pitch_average.toFixed(1)}
                  </div>
                  <div className="text-sm text-muted-foreground">Hz</div>
                  <div className="text-xs">Tom Médio</div>
                </div>
                
                <div className="text-center p-4 bg-secondary/30 rounded-lg">
                  <div className="text-2xl font-bold text-health-accent">
                    {analysisResult.voice_metrics.volume_average.toFixed(1)}
                  </div>
                  <div className="text-sm text-muted-foreground">dB</div>
                  <div className="text-xs">Volume Médio</div>
                </div>
                
                <div className="text-center p-4 bg-secondary/30 rounded-lg">
                  <div className="text-2xl font-bold text-health-calm">
                    {analysisResult.voice_metrics.speech_rate.toFixed(1)}
                  </div>
                  <div className="text-sm text-muted-foreground">WPM</div>
                  <div className="text-xs">Velocidade</div>
                </div>
                
                <div className="text-center p-4 bg-secondary/30 rounded-lg">
                  <div className="text-2xl font-bold text-health-secondary">
                    {(analysisResult.confidence_score * 100).toFixed(1)}
                  </div>
                  <div className="text-sm text-muted-foreground">%</div>
                  <div className="text-xs">Confiança</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transcription */}
          {analysisResult.transcription && (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Transcrição</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-secondary/30 rounded-lg">
                  <p className="text-sm leading-relaxed">
                    "{analysisResult.transcription}"
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

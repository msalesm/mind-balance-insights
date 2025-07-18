import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Activity, Brain, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface VoiceMetrics {
  pitch: number;
  volume: number;
  jitter: number;
  harmonics: number;
  timestamp: number;
}

interface AnalysisResult {
  stressLevel: 'low' | 'medium' | 'high';
  emotionalTone: 'positive' | 'neutral' | 'negative';
  confidence: number;
  recommendations: string[];
  transcription?: string;
  emotional_tone?: any;
  stress_indicators?: string[];
}

export const VoiceAnalyzer = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [voiceMetrics, setVoiceMetrics] = useState<VoiceMetrics | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [user, setUser] = useState<any>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const animationRef = useRef<number>();
  const { toast } = useToast();

  // Check authentication
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const initializeAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });
      
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
      
      analyserRef.current.fftSize = 2048;
      microphoneRef.current.connect(analyserRef.current);
      
      return true;
    } catch (error) {
      console.error('Erro ao inicializar áudio:', error);
      toast({
        title: "Erro de Áudio",
        description: "Não foi possível acessar o microfone. Verifique as permissões.",
        variant: "destructive"
      });
      return false;
    }
  };

  const analyzeVoice = () => {
    if (!analyserRef.current) return;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    // Calcular métricas básicas
    const volume = dataArray.reduce((sum, val) => sum + val * val, 0) / dataArray.length;
    const pitch = calculatePitch(dataArray);
    const jitter = calculateJitter(dataArray);
    const harmonics = calculateHarmonics(dataArray);
    
    const metrics: VoiceMetrics = {
      pitch,
      volume: Math.sqrt(volume),
      jitter,
      harmonics,
      timestamp: Date.now()
    };
    
    setVoiceMetrics(metrics);
    setAudioLevel(Math.min(100, (metrics.volume / 50) * 100));
    
    // Simular análise mais complexa
    const stressLevel = metrics.jitter > 30 ? 'high' : metrics.jitter > 15 ? 'medium' : 'low';
    const emotionalTone = metrics.pitch > 200 ? 'positive' : metrics.pitch < 150 ? 'negative' : 'neutral';
    
    setAnalysisResult({
      stressLevel,
      emotionalTone,
      confidence: Math.random() * 30 + 70, // Simulated confidence
      recommendations: generateRecommendations(stressLevel, emotionalTone)
    });
    
    animationRef.current = requestAnimationFrame(analyzeVoice);
  };

  const calculatePitch = (dataArray: Uint8Array): number => {
    // Simplified pitch detection
    let maxIndex = 0;
    let maxValue = 0;
    
    for (let i = 1; i < dataArray.length / 2; i++) {
      if (dataArray[i] > maxValue) {
        maxValue = dataArray[i];
        maxIndex = i;
      }
    }
    
    return maxIndex * (44100 / 2) / dataArray.length;
  };

  const calculateJitter = (dataArray: Uint8Array): number => {
    let variations = 0;
    for (let i = 1; i < dataArray.length; i++) {
      variations += Math.abs(dataArray[i] - dataArray[i-1]);
    }
    return variations / (dataArray.length - 1);
  };

  const calculateHarmonics = (dataArray: Uint8Array): number => {
    let harmonicStrength = 0;
    for (let i = 0; i < 10; i++) {
      const harmonicIndex = Math.floor((i + 1) * dataArray.length / 20);
      if (harmonicIndex < dataArray.length) {
        harmonicStrength += dataArray[harmonicIndex];
      }
    }
    return harmonicStrength / 10;
  };

  const generateRecommendations = (stress: string, emotion: string): string[] => {
    const recommendations = [];
    
    if (stress === 'high') {
      recommendations.push('Pratique respiração profunda por 5 minutos');
      recommendations.push('Considere uma pausa de 15 minutos');
    }
    
    if (emotion === 'negative') {
      recommendations.push('Tente uma atividade relaxante');
      recommendations.push('Ouça música calma');
    }
    
    if (stress === 'low' && emotion === 'positive') {
      recommendations.push('Momento ideal para atividades produtivas');
    }
    
    return recommendations.length > 0 ? recommendations : ['Continue monitorando seu bem-estar'];
  };

  const startRecording = async () => {
    if (!user) {
      toast({
        title: "Autenticação Necessária",
        description: "Faça login para usar a análise de voz",
        variant: "destructive"
      });
      return;
    }

    const initialized = await initializeAudio();
    if (!initialized) return;

    // Setup MediaRecorder for audio capture
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'audio/webm;codecs=opus'
    });
    
    audioChunksRef.current = [];
    
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };
    
    mediaRecorder.start();
    mediaRecorderRef.current = mediaRecorder;
    
    setIsRecording(true);
    setIsAnalyzing(true);
    analyzeVoice();
    
    toast({
      title: "Análise Iniciada",
      description: "Analisando padrões vocais em tempo real...",
    });
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsAnalyzing(true);
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    // Stop MediaRecorder and process audio
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      
      mediaRecorderRef.current.onstop = async () => {
        try {
          // Convert audio chunks to base64
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const reader = new FileReader();
          
          reader.onload = async () => {
            const base64Audio = (reader.result as string).split(',')[1];
            
            // Send to Edge Function for analysis
            const response = await fetch('https://skwpuolpkgntqdmgzwlr.functions.supabase.co/voice-analysis', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                audioData: base64Audio,
                userId: user.id
              })
            });
            
            const result = await response.json();
            
            if (result.success) {
              const analysisResult: AnalysisResult = {
                stressLevel: result.analysis.stress_indicators?.length > 2 ? 'high' : 
                           result.analysis.stress_indicators?.length > 0 ? 'medium' : 'low',
                emotionalTone: result.analysis.emotional_tone?.valence > 0.3 ? 'positive' :
                              result.analysis.emotional_tone?.valence < -0.3 ? 'negative' : 'neutral',
                confidence: result.analysis.confidence_score * 100 || 80,
                recommendations: result.analysis.stress_indicators || [],
                transcription: result.transcription,
                emotional_tone: result.analysis.emotional_tone,
                stress_indicators: result.analysis.stress_indicators
              };
              
              setAnalysisResult(analysisResult);
              
              toast({
                title: "Análise Concluída",
                description: "Sua análise de voz foi salva com sucesso!"
              });
            } else {
              throw new Error(result.error || 'Análise falhou');
            }
          };
          
          reader.readAsDataURL(audioBlob);
        } catch (error) {
          console.error('Erro ao processar áudio:', error);
          toast({
            title: "Erro na Análise",
            description: "Falha ao analisar áudio. Tente novamente.",
            variant: "destructive"
          });
        } finally {
          setIsAnalyzing(false);
        }
      };
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
  };

  const getStressColor = (level: string) => {
    switch (level) {
      case 'low': return 'health-success';
      case 'medium': return 'health-warning';
      case 'high': return 'destructive';
      default: return 'muted';
    }
  };

  const getEmotionColor = (tone: string) => {
    switch (tone) {
      case 'positive': return 'health-success';
      case 'negative': return 'destructive';
      default: return 'muted';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-calm shadow-card border-health-primary/20">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <Brain className="h-6 w-6 text-health-primary" />
            Análise de Voz Inteligente
          </CardTitle>
          <CardDescription>
            Detecte padrões emocionais através da análise vocal em tempo real
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              size="lg"
              variant={isRecording ? "destructive" : "default"}
              className={`h-16 w-16 rounded-full ${
                isRecording 
                  ? 'animate-pulse bg-destructive hover:bg-destructive/90' 
                  : 'bg-gradient-primary hover:shadow-glow'
              }`}
            >
              {isRecording ? (
                <MicOff className="h-6 w-6" />
              ) : (
                <Mic className="h-6 w-6" />
              )}
            </Button>
          </div>

          {isRecording && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Nível de Áudio</p>
                <Progress value={audioLevel} className="w-full h-2" />
              </div>
              
              {voiceMetrics && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-secondary/50 rounded-lg">
                    <Activity className="h-4 w-4 mx-auto mb-1 text-health-primary" />
                    <p className="text-xs text-muted-foreground">Pitch</p>
                    <p className="font-semibold">{voiceMetrics.pitch.toFixed(0)} Hz</p>
                  </div>
                  <div className="text-center p-3 bg-secondary/50 rounded-lg">
                    <Heart className="h-4 w-4 mx-auto mb-1 text-health-accent" />
                    <p className="text-xs text-muted-foreground">Volume</p>
                    <p className="font-semibold">{voiceMetrics.volume.toFixed(1)}</p>
                  </div>
                  <div className="text-center p-3 bg-secondary/50 rounded-lg">
                    <Activity className="h-4 w-4 mx-auto mb-1 text-health-warning" />
                    <p className="text-xs text-muted-foreground">Variabilidade</p>
                    <p className="font-semibold">{voiceMetrics.jitter.toFixed(1)}</p>
                  </div>
                  <div className="text-center p-3 bg-secondary/50 rounded-lg">
                    <Brain className="h-4 w-4 mx-auto mb-1 text-health-secondary" />
                    <p className="text-xs text-muted-foreground">Harmônicos</p>
                    <p className="font-semibold">{voiceMetrics.harmonics.toFixed(1)}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {analysisResult && (
            <div className="space-y-4 border-t pt-4">
              <h4 className="font-semibold flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Análise Emocional
              </h4>
              
              <div className="flex gap-4 flex-wrap">
                <Badge variant="outline" className={`bg-${getStressColor(analysisResult.stressLevel)}/10`}>
                  Estresse: {analysisResult.stressLevel}
                </Badge>
                <Badge variant="outline" className={`bg-${getEmotionColor(analysisResult.emotionalTone)}/10`}>
                  Tom: {analysisResult.emotionalTone}
                </Badge>
                <Badge variant="outline">
                  Confiança: {analysisResult.confidence.toFixed(0)}%
                </Badge>
              </div>
              
              {analysisResult.transcription && (
                <div className="space-y-2">
                  <h5 className="font-medium text-sm">Transcrição:</h5>
                  <p className="text-sm text-muted-foreground bg-secondary/50 p-3 rounded-lg">
                    "{analysisResult.transcription}"
                  </p>
                </div>
              )}
              
              {analysisResult.stress_indicators && analysisResult.stress_indicators.length > 0 && (
                <div className="space-y-2">
                  <h5 className="font-medium text-sm">Indicadores de Estresse:</h5>
                  <ul className="space-y-1">
                    {analysisResult.stress_indicators.map((indicator, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-health-warning rounded-full mt-1.5 flex-shrink-0" />
                        {indicator}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {isAnalyzing && !isRecording && (
            <div className="space-y-2 border-t pt-4">
              <div className="text-sm text-muted-foreground">Processando análise com IA...</div>
              <Progress value={75} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
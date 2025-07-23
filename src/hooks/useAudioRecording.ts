import { useState, useRef, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';

export interface AudioFormat {
  mimeType: string;
  extension: string;
  name: string;
}

const AUDIO_FORMATS: AudioFormat[] = [
  { mimeType: 'audio/webm;codecs=opus', extension: 'webm', name: 'WebM Opus' },
  { mimeType: 'audio/webm', extension: 'webm', name: 'WebM' },
  { mimeType: 'audio/mp4', extension: 'mp4', name: 'MP4' },
  { mimeType: 'audio/wav', extension: 'wav', name: 'WAV' },
  { mimeType: 'audio/ogg;codecs=opus', extension: 'ogg', name: 'OGG Opus' },
  { mimeType: 'audio/ogg', extension: 'ogg', name: 'OGG' }
];

export const useAudioRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [supportedFormat, setSupportedFormat] = useState<AudioFormat | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const detectSupportedFormat = useCallback((): AudioFormat | null => {
    console.log('Detecting supported audio formats...');
    
    for (const format of AUDIO_FORMATS) {
      if (MediaRecorder.isTypeSupported(format.mimeType)) {
        console.log(`Supported format found: ${format.name} (${format.mimeType})`);
        return format;
      }
    }
    
    console.warn('No supported audio format found, using basic audio/webm');
    return { mimeType: 'audio/webm', extension: 'webm', name: 'WebM Basic' };
  }, []);

  const getOptimalAudioConstraints = useCallback(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isSafari = userAgent.includes('safari') && !userAgent.includes('chrome');
    const isIOS = /iphone|ipad|ipod/.test(userAgent);

    if (isSafari || isIOS) {
      return {
        audio: {
          sampleRate: 44100,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      };
    }

    return {
      audio: {
        sampleRate: 16000,
        channelCount: 1,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    };
  }, []);

  const startRecording = useCallback(async () => {
    try {
      console.log('Starting recording process...');
      
      // Detect supported format
      const format = detectSupportedFormat();
      setSupportedFormat(format);
      
      // Request microphone access with optimal constraints
      const constraints = getOptimalAudioConstraints();
      console.log('Requesting microphone with constraints:', constraints);
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      // Create MediaRecorder with supported format
      let mediaRecorder: MediaRecorder;
      try {
        mediaRecorder = new MediaRecorder(stream, {
          mimeType: format.mimeType
        });
      } catch (error) {
        console.warn(`Failed to create MediaRecorder with ${format.mimeType}, using default`);
        mediaRecorder = new MediaRecorder(stream);
      }
      
      const chunks: Blob[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const mimeType = format.mimeType.split(';')[0]; // Remove codecs part
        const blob = new Blob(chunks, { type: mimeType });
        console.log('Recording stopped:', { 
          size: blob.size, 
          type: blob.type,
          format: format.name 
        });
        setAudioBlob(blob);
      };
      
      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        toast({
          title: 'Erro na gravação',
          description: 'Ocorreu um erro durante a gravação. Tente novamente.',
          variant: 'destructive',
        });
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      toast({
        title: 'Gravação iniciada',
        description: `Usando formato ${format.name}. Fale naturalmente.`,
      });
      
    } catch (error) {
      console.error('Error starting recording:', error);
      
      let errorMessage = 'Erro ao acessar o microfone.';
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          errorMessage = 'Permissão negada. Autorize o acesso ao microfone.';
        } else if (error.name === 'NotFoundError') {
          errorMessage = 'Microfone não encontrado. Verifique se está conectado.';
        } else if (error.name === 'NotSupportedError') {
          errorMessage = 'Gravação de áudio não suportada neste navegador.';
        }
      }
      
      toast({
        title: 'Erro no microfone',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  }, [detectSupportedFormat, getOptimalAudioConstraints]);

  const stopRecording = useCallback(() => {
    console.log('Stopping recording...');
    
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => {
          track.stop();
          console.log('Stopped track:', track.kind);
        });
      }
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      toast({
        title: 'Gravação finalizada',
        description: 'Áudio pronto para análise.',
      });
    }
  }, [isRecording]);

  const resetRecording = useCallback(() => {
    setAudioBlob(null);
    setRecordingTime(0);
    setSupportedFormat(null);
  }, []);

  return {
    isRecording,
    recordingTime,
    audioBlob,
    supportedFormat,
    startRecording,
    stopRecording,
    resetRecording
  };
};
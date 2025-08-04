import { useState, useEffect, useCallback } from 'react';
import { AppleWatch } from '@/plugins/AppleWatch';
import { useToast } from '@/hooks/use-toast';

export const useAppleWatch = () => {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isReachable, setIsReachable] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkWatchStatus();
  }, []);

  const checkWatchStatus = async () => {
    try {
      const [installedResult, reachableResult] = await Promise.all([
        AppleWatch.isWatchAppInstalled(),
        AppleWatch.isReachable()
      ]);
      
      setIsInstalled(installedResult.installed);
      setIsReachable(reachableResult.reachable);
    } catch (error) {
      console.error('Error checking Apple Watch status:', error);
    }
  };

  const sendMoodToWatch = useCallback(async (mood: string) => {
    if (!isReachable) {
      toast({
        title: "Apple Watch não conectado",
        description: "Certifique-se de que o Apple Watch está conectado e próximo",
        variant: "destructive"
      });
      return false;
    }

    setLoading(true);
    try {
      const result = await AppleWatch.sendMessage({
        data: { type: 'mood_update', mood, timestamp: new Date().toISOString() }
      });
      
      if (result.success) {
        toast({
          title: "Humor enviado",
          description: "Dados sincronizados com o Apple Watch"
        });
      }
      
      return result.success;
    } catch (error) {
      console.error('Error sending mood to watch:', error);
      toast({
        title: "Erro na sincronização",
        description: "Falha ao enviar dados para o Apple Watch",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [isReachable, toast]);

  const startHeartRateMonitoring = useCallback(async () => {
    if (!isReachable) return false;

    try {
      const result = await AppleWatch.startHeartRateMonitoring();
      
      if (result.success) {
        toast({
          title: "Monitoramento iniciado",
          description: "Frequência cardíaca sendo monitorada no Apple Watch"
        });
      }
      
      return result.success;
    } catch (error) {
      console.error('Error starting heart rate monitoring:', error);
      return false;
    }
  }, [isReachable, toast]);

  const stopHeartRateMonitoring = useCallback(async () => {
    if (!isReachable) return false;

    try {
      const result = await AppleWatch.stopHeartRateMonitoring();
      return result.success;
    } catch (error) {
      console.error('Error stopping heart rate monitoring:', error);
      return false;
    }
  }, [isReachable]);

  const showBreathingReminder = useCallback(async (duration: number = 60) => {
    if (!isReachable) return false;

    try {
      const result = await AppleWatch.showBreathingReminder({ duration });
      
      if (result.success) {
        toast({
          title: "Lembrete de respiração",
          description: `Exercício de ${duration} segundos iniciado no Apple Watch`
        });
      }
      
      return result.success;
    } catch (error) {
      console.error('Error showing breathing reminder:', error);
      return false;
    }
  }, [isReachable, toast]);

  const logMoodOnWatch = useCallback(async (mood: string) => {
    if (!isReachable) return false;

    try {
      const result = await AppleWatch.logMood({
        mood,
        timestamp: new Date().toISOString()
      });
      
      return result.success;
    } catch (error) {
      console.error('Error logging mood on watch:', error);
      return false;
    }
  }, [isReachable]);

  return {
    isInstalled,
    isReachable,
    loading,
    checkWatchStatus,
    sendMoodToWatch,
    startHeartRateMonitoring,
    stopHeartRateMonitoring,
    showBreathingReminder,
    logMoodOnWatch
  };
};
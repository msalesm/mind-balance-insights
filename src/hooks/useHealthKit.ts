import { useState, useEffect, useCallback } from 'react';
import { HealthKit, type HeartRateSample, type StepSample, type SleepSample } from '@/plugins/HealthKit';
import { useToast } from '@/hooks/use-toast';

export const useHealthKit = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkAvailability();
  }, []);

  const checkAvailability = async () => {
    try {
      const result = await HealthKit.isAvailable();
      setIsAvailable(result.available);
    } catch (error) {
      console.error('Error checking HealthKit availability:', error);
      setIsAvailable(false);
    }
  };

  const requestAuthorization = useCallback(async () => {
    if (!isAvailable) {
      toast({
        title: "HealthKit não disponível",
        description: "HealthKit não está disponível neste dispositivo",
        variant: "destructive"
      });
      return false;
    }

    setLoading(true);
    try {
      const result = await HealthKit.requestAuthorization({
        permissions: ['heartRate', 'steps', 'sleepAnalysis', 'workouts']
      });
      
      setIsAuthorized(result.granted);
      
      if (result.granted) {
        toast({
          title: "Autorização concedida",
          description: "Agora você pode sincronizar dados do Apple Health"
        });
      } else {
        toast({
          title: "Autorização negada",
          description: "Permissões do HealthKit são necessárias para sincronização",
          variant: "destructive"
        });
      }
      
      return result.granted;
    } catch (error) {
      console.error('Error requesting HealthKit authorization:', error);
      toast({
        title: "Erro na autorização",
        description: "Falha ao solicitar permissões do HealthKit",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [isAvailable, toast]);

  const readHeartRate = useCallback(async (startDate: Date, endDate: Date): Promise<HeartRateSample[]> => {
    if (!isAuthorized) return [];
    
    try {
      const result = await HealthKit.readHeartRate({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      });
      return result.samples;
    } catch (error) {
      console.error('Error reading heart rate:', error);
      return [];
    }
  }, [isAuthorized]);

  const readSteps = useCallback(async (startDate: Date, endDate: Date): Promise<StepSample[]> => {
    if (!isAuthorized) return [];
    
    try {
      const result = await HealthKit.readSteps({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      });
      return result.samples;
    } catch (error) {
      console.error('Error reading steps:', error);
      return [];
    }
  }, [isAuthorized]);

  const readSleep = useCallback(async (startDate: Date, endDate: Date): Promise<SleepSample[]> => {
    if (!isAuthorized) return [];
    
    try {
      const result = await HealthKit.readSleep({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      });
      return result.samples;
    } catch (error) {
      console.error('Error reading sleep:', error);
      return [];
    }
  }, [isAuthorized]);

  return {
    isAvailable,
    isAuthorized,
    loading,
    requestAuthorization,
    readHeartRate,
    readSteps,
    readSleep
  };
};
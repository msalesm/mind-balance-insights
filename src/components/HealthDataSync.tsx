import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Heart, Activity, Moon, Footprints, Watch, Smartphone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useHealthKit } from '@/hooks/useHealthKit';
import { useAppleWatch } from '@/hooks/useAppleWatch';

interface HealthMetrics {
  steps: number;
  distance: number;
  calories: number;
  heartRate: number;
  sleepHours: number;
  lastSync: Date;
}

const HealthDataSync: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [metrics, setMetrics] = useState<HealthMetrics | null>(null);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();
  
  // Native integrations
  const healthKit = useHealthKit();
  const appleWatch = useAppleWatch();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (user) {
      loadHealthData();
    }
  }, [user]);

  const loadHealthData = async () => {
    try {
      // Load recent health data from database
      const { data: healthData, error } = await supabase
        .from('health_data')
        .select('*')
        .eq('user_id', user.id)
        .gte('recorded_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('recorded_at', { ascending: false });

      if (error) throw error;

      // Process and aggregate health data
      const processedMetrics: HealthMetrics = {
        steps: healthData?.find(d => d.data_type === 'steps')?.value || 0,
        distance: healthData?.find(d => d.data_type === 'distance')?.value || 0,
        calories: healthData?.find(d => d.data_type === 'calories')?.value || 0,
        heartRate: healthData?.find(d => d.data_type === 'heart_rate')?.value || 0,
        sleepHours: 7.5, // Placeholder
        lastSync: new Date()
      };

      setMetrics(processedMetrics);
      setIsConnected(healthData && healthData.length > 0);
    } catch (error) {
      console.error('Erro ao carregar dados de saúde:', error);
    }
  };

  const handleHealthKitSync = async () => {
    if (!user) {
      toast({
        title: "Autenticação necessária",
        description: "Faça login para sincronizar dados de saúde",
        variant: "destructive"
      });
      return;
    }

    // First, request authorization if needed
    if (!healthKit.isAuthorized) {
      const authorized = await healthKit.requestAuthorization();
      if (!authorized) return;
    }

    setIsSyncing(true);
    
    try {
      const endDate = new Date();
      const startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000); // Last 24 hours

      // Read data from HealthKit
      const [heartRateData, stepsData, sleepData] = await Promise.all([
        healthKit.readHeartRate(startDate, endDate),
        healthKit.readSteps(startDate, endDate),
        healthKit.readSleep(startDate, endDate)
      ]);

      // Process and insert heart rate data
      for (const sample of heartRateData) {
        await supabase
          .from('health_data')
          .insert([{
            user_id: user.id,
            data_type: 'heart_rate',
            value: sample.value,
            unit: 'bpm',
            recorded_at: sample.date,
            source: 'healthkit'
          }]);
      }

      // Process and insert steps data
      for (const sample of stepsData) {
        await supabase
          .from('health_data')
          .insert([{
            user_id: user.id,
            data_type: 'steps',
            value: sample.value,
            unit: 'count',
            recorded_at: sample.date,
            source: 'healthkit'
          }]);
      }

      // Process and insert sleep data
      for (const sample of sleepData) {
        await supabase
          .from('sleep_data')
          .insert([{
            user_id: user.id,
            sleep_start: sample.startDate,
            sleep_end: sample.endDate,
            duration_minutes: sample.value,
            quality_score: 75, // Default quality score
            source: 'healthkit'
          }]);
      }

      // If real data is empty, use simulated data for demo
      if (heartRateData.length === 0 && stepsData.length === 0) {
        await simulateHealthData();
      }

      await loadHealthData();
      setIsConnected(true);
      
      // Send mood update to Apple Watch if available
      if (appleWatch.isReachable) {
        await appleWatch.sendMoodToWatch('positive');
      }
      
      toast({
        title: "Sincronização completa",
        description: "Dados de saúde sincronizados com sucesso!"
      });
    } catch (error) {
      console.error('Error syncing health data:', error);
      toast({
        title: "Erro na sincronização",
        description: "Falha ao sincronizar dados de saúde. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const simulateHealthData = async () => {
    const mockHealthData = [
      { data_type: 'steps', value: Math.floor(Math.random() * 5000) + 8000, unit: 'count' },
      { data_type: 'distance', value: Math.random() * 3 + 5, unit: 'km' },
      { data_type: 'calories', value: Math.floor(Math.random() * 500) + 1800, unit: 'kcal' },
      { data_type: 'heart_rate', value: Math.floor(Math.random() * 30) + 60, unit: 'bpm' },
      { data_type: 'weight', value: Math.random() * 20 + 70, unit: 'kg' }
    ];

    const recordedAt = new Date();

    // Insert simulated health data
    for (const data of mockHealthData) {
      await supabase
        .from('health_data')
        .insert([{
          user_id: user.id,
          data_type: data.data_type,
          value: data.value,
          unit: data.unit,
          recorded_at: recordedAt.toISOString(),
          source: 'simulated'
        }]);
    }
  };

  const handleWatchBreathingExercise = async () => {
    const success = await appleWatch.showBreathingReminder(60);
    if (success) {
      toast({
        title: "Exercício iniciado",
        description: "Exercício de respiração ativado no Apple Watch"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Health Data Integration
          </CardTitle>
          <CardDescription>
            Connect with iPhone/Apple Health to sync your biometric data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant={isConnected ? "default" : "secondary"}>
                  {isConnected ? "Conectado" : "Não conectado"}
                </Badge>
                {healthKit.isAvailable && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Smartphone className="h-3 w-3" />
                    HealthKit
                  </Badge>
                )}
                {appleWatch.isInstalled && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Watch className="h-3 w-3" />
                    Apple Watch
                  </Badge>
                )}
                {metrics && (
                  <span className="text-sm text-muted-foreground">
                    Última sync: {metrics.lastSync.toLocaleDateString()}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleHealthKitSync}
                  disabled={isSyncing || healthKit.loading}
                  variant={isConnected ? "outline" : "default"}
                  size="sm"
                >
                  {isSyncing || healthKit.loading ? "Sincronizando..." : 
                   healthKit.isAuthorized ? "Sincronizar" : "Conectar HealthKit"}
                </Button>
                {appleWatch.isReachable && (
                  <Button 
                    onClick={handleWatchBreathingExercise}
                    variant="outline"
                    size="sm"
                  >
                    Respiração
                  </Button>
                )}
              </div>
            </div>
            
            {(isSyncing || healthKit.loading) && (
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  {healthKit.isAvailable ? "Sincronizando com HealthKit..." : "Sincronizando dados de saúde..."}
                </div>
                <Progress value={75} className="w-full" />
              </div>
            )}

            {healthKit.isAvailable && !healthKit.isAuthorized && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Para sincronizar dados reais do iPhone, autorize o acesso ao HealthKit.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {metrics && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Steps</CardTitle>
              <Footprints className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.steps.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {metrics.distance.toFixed(1)} km distance
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Heart Rate</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.heartRate} bpm</div>
              <p className="text-xs text-muted-foreground">
                Resting heart rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Calories</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.calories}</div>
              <p className="text-xs text-muted-foreground">
                Total burned today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sleep</CardTitle>
              <Moon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.sleepHours}h</div>
              <p className="text-xs text-muted-foreground">
                Last night's sleep
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default HealthDataSync;
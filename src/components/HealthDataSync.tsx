import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Heart, Activity, Moon, Footprints } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

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
      console.error('Error loading health data:', error);
    }
  };

  const simulateHealthSync = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to sync health data",
        variant: "destructive"
      });
      return;
    }

    setIsSyncing(true);
    
    try {
      // Simulate health data from iPhone/Apple Health
      const mockHealthData = [
        { data_type: 'steps', value: Math.floor(Math.random() * 5000) + 8000, unit: 'count' },
        { data_type: 'distance', value: Math.random() * 3 + 5, unit: 'km' },
        { data_type: 'calories', value: Math.floor(Math.random() * 500) + 1800, unit: 'kcal' },
        { data_type: 'heart_rate', value: Math.floor(Math.random() * 30) + 60, unit: 'bpm' },
        { data_type: 'weight', value: Math.random() * 20 + 70, unit: 'kg' }
      ];

      const recordedAt = new Date();

      // Insert health data
      for (const data of mockHealthData) {
        await supabase
          .from('health_data')
          .insert([{
            user_id: user.id,
            data_type: data.data_type,
            value: data.value,
            unit: data.unit,
            recorded_at: recordedAt.toISOString(),
            source: 'apple_health'
          }]);
      }

      // Simulate sleep data
      const sleepEnd = new Date();
      const sleepStart = new Date(sleepEnd.getTime() - (7.5 * 60 * 60 * 1000));
      
      await supabase
        .from('sleep_data')
        .insert([{
          user_id: user.id,
          sleep_start: sleepStart.toISOString(),
          sleep_end: sleepEnd.toISOString(),
          duration_minutes: 450,
          quality_score: Math.random() * 30 + 70,
          deep_sleep_minutes: Math.floor(Math.random() * 60) + 90,
          light_sleep_minutes: Math.floor(Math.random() * 120) + 180,
          rem_sleep_minutes: Math.floor(Math.random() * 60) + 90,
          awake_minutes: Math.floor(Math.random() * 30) + 15,
          heart_rate_average: Math.floor(Math.random() * 15) + 50,
          source: 'apple_health'
        }]);

      // Simulate activity data
      const activityEnd = new Date();
      const activityStart = new Date(activityEnd.getTime() - (45 * 60 * 1000));
      
      await supabase
        .from('activity_data')
        .insert([{
          user_id: user.id,
          activity_type: 'walking',
          start_time: activityStart.toISOString(),
          end_time: activityEnd.toISOString(),
          duration_minutes: 45,
          steps: Math.floor(Math.random() * 2000) + 3000,
          distance_meters: Math.floor(Math.random() * 1000) + 2000,
          calories_burned: Math.floor(Math.random() * 200) + 150,
          heart_rate_average: Math.floor(Math.random() * 40) + 120,
          heart_rate_max: Math.floor(Math.random() * 20) + 160,
          intensity_level: 'moderate',
          source: 'apple_health'
        }]);

      await loadHealthData();
      setIsConnected(true);
      
      toast({
        title: "Sync Complete",
        description: "Health data has been successfully synchronized!"
      });
    } catch (error) {
      console.error('Error syncing health data:', error);
      toast({
        title: "Sync Error",
        description: "Failed to sync health data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
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
                  {isConnected ? "Connected" : "Not Connected"}
                </Badge>
                {metrics && (
                  <span className="text-sm text-muted-foreground">
                    Last sync: {metrics.lastSync.toLocaleDateString()}
                  </span>
                )}
              </div>
              <Button 
                onClick={simulateHealthSync}
                disabled={isSyncing}
                variant={isConnected ? "outline" : "default"}
              >
                {isSyncing ? "Syncing..." : isConnected ? "Sync Now" : "Connect to Apple Health"}
              </Button>
            </div>
            
            {isSyncing && (
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Syncing health data...</div>
                <Progress value={75} className="w-full" />
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
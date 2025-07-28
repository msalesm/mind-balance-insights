import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { MapPin, Clock, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

interface LocationVisit {
  id: string;
  location_id?: string;
  latitude: number;
  longitude: number;
  address?: string;
  arrived_at: string;
  left_at?: string;
  duration_minutes?: number;
  mood_score?: number;
  notes?: string;
}

interface MoodLocationCorrelation {
  id: string;
  location_name: string;
  avg_mood_score: number;
  visit_count: number;
  mood_trend?: string;
  last_visit_at: string;
}

const MOOD_LABELS = {
  1: { label: 'Muito Mal', color: 'bg-red-500', emoji: '😢' },
  2: { label: 'Mal', color: 'bg-orange-500', emoji: '😔' },
  3: { label: 'Neutro', color: 'bg-yellow-500', emoji: '😐' },
  4: { label: 'Bem', color: 'bg-green-500', emoji: '😊' },
  5: { label: 'Muito Bem', color: 'bg-emerald-500', emoji: '😄' },
};

export const LocationMoodTracker: React.FC = () => {
  const { user } = useAuth();
  const { getCurrentLocation, location } = useGeolocation();
  const [currentVisit, setCurrentVisit] = useState<LocationVisit | null>(null);
  const [moodScore, setMoodScore] = useState<number[]>([3]);
  const [correlations, setCorrelations] = useState<MoodLocationCorrelation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadMoodCorrelations();
    }
  }, [user]);

  useEffect(() => {
    // Auto-detect location changes and start/end visits
    if (location && user) {
      checkLocationVisits();
    }
  }, [location, user]);

  const loadMoodCorrelations = async () => {
    try {
      const { data, error } = await supabase
        .from('mood_location_correlations')
        .select('*')
        .eq('user_id', user?.id)
        .order('avg_mood_score', { ascending: false });

      if (error) throw error;
      setCorrelations(data || []);
    } catch (error) {
      console.error('Erro ao carregar correlações:', error);
    }
  };

  const checkLocationVisits = async () => {
    if (!location || !user) return;

    try {
      // Check if user is currently in any registered location
      const { data: userLocations, error: locationsError } = await supabase
        .from('user_locations')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (locationsError) throw locationsError;

      // Calculate distance to each location
      const nearbyLocation = userLocations?.find(loc => {
        const distance = calculateDistance(
          location.latitude,
          location.longitude,
          loc.latitude,
          loc.longitude
        );
        return distance <= loc.radius_meters;
      });

      // Check for ongoing visit
      const { data: ongoingVisit, error: visitError } = await supabase
        .from('location_visits')
        .select('*')
        .eq('user_id', user.id)
        .is('left_at', null)
        .order('arrived_at', { ascending: false })
        .limit(1)
        .single();

      if (visitError && visitError.code !== 'PGRST116') {
        console.error('Erro ao verificar visita:', visitError);
        return;
      }

      if (nearbyLocation && !ongoingVisit) {
        // Start new visit
        await startLocationVisit(nearbyLocation);
      } else if (!nearbyLocation && ongoingVisit) {
        // End current visit
        await endLocationVisit(ongoingVisit.id);
      }
    } catch (error) {
      console.error('Erro ao verificar visitas:', error);
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371000; // Earth's radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const startLocationVisit = async (location: any) => {
    try {
      const { data, error } = await supabase
        .from('location_visits')
        .insert([{
          user_id: user?.id,
          location_id: location.id,
          latitude: location.latitude,
          longitude: location.longitude,
          address: location.address,
          arrived_at: new Date().toISOString(),
        }])
        .select()
        .single();

      if (error) throw error;
      
      setCurrentVisit(data);
      toast({
        title: "Chegou ao Local",
        description: `Detectamos que você chegou em ${location.name}`,
      });
    } catch (error) {
      console.error('Erro ao iniciar visita:', error);
    }
  };

  const endLocationVisit = async (visitId: string) => {
    try {
      const arrivedAt = new Date(currentVisit?.arrived_at || Date.now());
      const now = new Date();
      const durationMinutes = Math.round((now.getTime() - arrivedAt.getTime()) / 60000);

      const { error } = await supabase
        .from('location_visits')
        .update({
          left_at: now.toISOString(),
          duration_minutes: durationMinutes,
        })
        .eq('id', visitId);

      if (error) throw error;
      
      setCurrentVisit(null);
      toast({
        title: "Saiu do Local",
        description: `Você ficou ${durationMinutes} minutos no local`,
      });
    } catch (error) {
      console.error('Erro ao finalizar visita:', error);
    }
  };

  const handleMoodCheck = async () => {
    if (!location || !user) {
      toast({
        title: "Erro",
        description: "Localização não disponível. Ative a geolocalização.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const currentLocation = await getCurrentLocation();
      const moodValue = moodScore[0];
      
      // Record location visit with mood
      const { data: visitData, error: visitError } = await supabase
        .from('location_visits')
        .insert([{
          user_id: user.id,
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          mood_score: moodValue,
          arrived_at: new Date().toISOString(),
          duration_minutes: 1, // Instant mood check
        }])
        .select()
        .single();

      if (visitError) throw visitError;

      // Update or create mood correlation
      await updateMoodCorrelation(currentLocation, moodValue);

      toast({
        title: "Humor Registrado",
        description: `Humor ${MOOD_LABELS[moodValue as keyof typeof MOOD_LABELS].label} registrado para sua localização atual`,
      });

      loadMoodCorrelations();
    } catch (error) {
      console.error('Erro ao registrar humor:', error);
      toast({
        title: "Erro",
        description: "Erro ao registrar humor",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateMoodCorrelation = async (location: any, mood: number) => {
    try {
      // Check if correlation exists for this general area (within 500m)
      const { data: existingCorrelations, error: searchError } = await supabase
        .from('mood_location_correlations')
        .select('*')
        .eq('user_id', user?.id);

      if (searchError) throw searchError;

      const nearbyCorrelation = existingCorrelations?.find(corr => {
        const distance = calculateDistance(
          location.latitude,
          location.longitude,
          corr.latitude,
          corr.longitude
        );
        return distance <= 500; // 500m radius for correlation grouping
      });

      if (nearbyCorrelation) {
        // Update existing correlation
        const newVisitCount = nearbyCorrelation.visit_count + 1;
        const newAvgMood = ((nearbyCorrelation.avg_mood_score * nearbyCorrelation.visit_count) + mood) / newVisitCount;
        
        const { error } = await supabase
          .from('mood_location_correlations')
          .update({
            avg_mood_score: newAvgMood,
            visit_count: newVisitCount,
            last_visit_at: new Date().toISOString(),
          })
          .eq('id', nearbyCorrelation.id);

        if (error) throw error;
      } else {
        // Create new correlation
        const { error } = await supabase
          .from('mood_location_correlations')
          .insert([{
            user_id: user?.id,
            location_name: `Local ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`,
            latitude: location.latitude,
            longitude: location.longitude,
            avg_mood_score: mood,
            visit_count: 1,
            last_visit_at: new Date().toISOString(),
          }]);

        if (error) throw error;
      }
    } catch (error) {
      console.error('Erro ao atualizar correlação:', error);
    }
  };

  const getMoodTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'declining':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const selectedMoodLabel = MOOD_LABELS[moodScore[0] as keyof typeof MOOD_LABELS];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Check-in de Humor
          </CardTitle>
          <CardDescription>
            Registre como você se sente no local atual
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-6xl mb-2">{selectedMoodLabel.emoji}</div>
              <div className="text-lg font-medium">{selectedMoodLabel.label}</div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Como você está se sentindo agora?</label>
              <Slider
                value={moodScore}
                onValueChange={setMoodScore}
                max={5}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Muito Mal</span>
                <span>Neutro</span>
                <span>Muito Bem</span>
              </div>
            </div>

            <Button 
              onClick={handleMoodCheck} 
              disabled={isLoading} 
              className="w-full"
            >
              {isLoading ? 'Registrando...' : 'Registrar Humor'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {correlations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Histórico de Humor por Local
            </CardTitle>
            <CardDescription>
              Veja como diferentes locais afetam seu humor
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {correlations.map((correlation) => {
                const moodLevel = Math.round(correlation.avg_mood_score);
                const moodInfo = MOOD_LABELS[moodLevel as keyof typeof MOOD_LABELS];
                
                return (
                  <div key={correlation.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{moodInfo.emoji}</div>
                      <div>
                        <h4 className="font-medium">{correlation.location_name}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{correlation.visit_count} visitas</span>
                          <span>•</span>
                          <span>Humor médio: {correlation.avg_mood_score.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="secondary" 
                        className={`${moodInfo.color} text-white`}
                      >
                        {moodInfo.label}
                      </Badge>
                      {getMoodTrendIcon(correlation.mood_trend)}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
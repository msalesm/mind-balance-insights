import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MapPin, Plus, Edit2, Trash2, Navigation, Home, Building2, Dumbbell } from 'lucide-react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

interface UserLocation {
  id: string;
  name: string;
  address?: string;
  latitude: number;
  longitude: number;
  radius_meters: number;
  location_type: string;
  is_active: boolean;
}

const LOCATION_TYPES = {
  home: { label: 'Casa', icon: Home, color: 'bg-green-500' },
  work: { label: 'Trabalho', icon: Building2, color: 'bg-blue-500' },
  gym: { label: 'Academia', icon: Dumbbell, color: 'bg-orange-500' },
  custom: { label: 'Personalizado', icon: MapPin, color: 'bg-gray-500' },
};

export const LocationManager: React.FC = () => {
  const { user } = useAuth();
  const { getCurrentLocation, isLoading: geoLoading } = useGeolocation();
  const [locations, setLocations] = useState<UserLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingLocation, setEditingLocation] = useState<UserLocation | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    latitude: '',
    longitude: '',
    radius_meters: '100',
    location_type: 'custom',
  });

  useEffect(() => {
    if (user) {
      loadLocations();
    }
  }, [user]);

  const loadLocations = async () => {
    try {
      const { data, error } = await supabase
        .from('user_locations')
        .select('*')
        .eq('user_id', user?.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLocations(data || []);
    } catch (error) {
      console.error('Erro ao carregar locais:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar seus locais",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseCurrentLocation = async () => {
    try {
      const location = await getCurrentLocation();
      setFormData(prev => ({
        ...prev,
        latitude: location.latitude.toString(),
        longitude: location.longitude.toString(),
      }));
      
      // Reverse geocoding would go here in a real app
      setFormData(prev => ({
        ...prev,
        address: `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`,
      }));
      
      toast({
        title: "Localização Capturada",
        description: "Localização atual adicionada ao formulário",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível obter a localização atual",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.latitude || !formData.longitude) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      const locationData = {
        user_id: user?.id,
        name: formData.name,
        address: formData.address || null,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        radius_meters: parseInt(formData.radius_meters),
        location_type: formData.location_type,
        is_active: true,
      };

      if (editingLocation) {
        const { error } = await supabase
          .from('user_locations')
          .update(locationData)
          .eq('id', editingLocation.id);
        
        if (error) throw error;
        
        toast({
          title: "Sucesso",
          description: "Local atualizado com sucesso",
        });
      } else {
        const { error } = await supabase
          .from('user_locations')
          .insert([locationData]);
        
        if (error) throw error;
        
        toast({
          title: "Sucesso",
          description: "Local adicionado com sucesso",
        });
      }

      setFormData({
        name: '',
        address: '',
        latitude: '',
        longitude: '',
        radius_meters: '100',
        location_type: 'custom',
      });
      setShowAddForm(false);
      setEditingLocation(null);
      loadLocations();
    } catch (error) {
      console.error('Erro ao salvar local:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar local",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (location: UserLocation) => {
    setEditingLocation(location);
    setFormData({
      name: location.name,
      address: location.address || '',
      latitude: location.latitude.toString(),
      longitude: location.longitude.toString(),
      radius_meters: location.radius_meters.toString(),
      location_type: location.location_type,
    });
    setShowAddForm(true);
  };

  const handleDelete = async (locationId: string) => {
    try {
      const { error } = await supabase
        .from('user_locations')
        .update({ is_active: false })
        .eq('id', locationId);
      
      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Local removido com sucesso",
      });
      
      loadLocations();
    } catch (error) {
      console.error('Erro ao remover local:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover local",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      latitude: '',
      longitude: '',
      radius_meters: '100',
      location_type: 'custom',
    });
    setShowAddForm(false);
    setEditingLocation(null);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Carregando locais...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Meus Locais
          </CardTitle>
          <CardDescription>
            Gerencie seus locais favoritos para análise contextual de humor
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!showAddForm && (
            <Button onClick={() => setShowAddForm(true)} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Local
            </Button>
          )}

          {showAddForm && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome do Local *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Casa, Trabalho, Academia..."
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="location_type">Tipo</Label>
                  <select
                    id="location_type"
                    value={formData.location_type}
                    onChange={(e) => setFormData(prev => ({ ...prev, location_type: e.target.value }))}
                    className="w-full h-10 px-3 py-2 border border-input rounded-md bg-background text-sm"
                  >
                    {Object.entries(LOCATION_TYPES).map(([key, type]) => (
                      <option key={key} value={key}>{type.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Endereço do local"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="latitude">Latitude *</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => setFormData(prev => ({ ...prev, latitude: e.target.value }))}
                    placeholder="-23.5505"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="longitude">Longitude *</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value }))}
                    placeholder="-46.6333"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="radius_meters">Raio (metros)</Label>
                  <Input
                    id="radius_meters"
                    type="number"
                    value={formData.radius_meters}
                    onChange={(e) => setFormData(prev => ({ ...prev, radius_meters: e.target.value }))}
                    placeholder="100"
                  />
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleUseCurrentLocation}
                disabled={geoLoading}
                className="w-full"
              >
                <Navigation className="h-4 w-4 mr-2" />
                {geoLoading ? 'Obtendo localização...' : 'Usar Localização Atual'}
              </Button>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingLocation ? 'Atualizar Local' : 'Adicionar Local'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              </div>
            </form>
          )}

          {locations.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                {locations.map((location) => {
                  const LocationIcon = LOCATION_TYPES[location.location_type as keyof typeof LOCATION_TYPES]?.icon || MapPin;
                  const iconColor = LOCATION_TYPES[location.location_type as keyof typeof LOCATION_TYPES]?.color || 'bg-gray-500';
                  
                  return (
                    <div key={location.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${iconColor} text-white`}>
                          <LocationIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-medium">{location.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {location.address || `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {LOCATION_TYPES[location.location_type as keyof typeof LOCATION_TYPES]?.label || 'Personalizado'}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              Raio: {location.radius_meters}m
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(location)}
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(location.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
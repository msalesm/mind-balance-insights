import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { 
  TrendingUp, 
  TrendingDown, 
  Brain, 
  Heart, 
  AlertTriangle,
  Calendar,
  BarChart3,
  Zap,
  RefreshCw
} from 'lucide-react';

interface Prediction {
  id: string;
  prediction_type: string;
  predicted_value: number;
  confidence_score: number;
  target_date: string;
  metadata?: any;
}

interface Pattern {
  id: string;
  pattern_type: string;
  pattern_data: any;
  strength: number;
  confidence: number;
  frequency: string;
}

export default function PredictiveDashboard() {
  const { user } = useAuth();
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [predictionsResult, patternsResult] = await Promise.all([
        supabase.from('ai_predictions').select('*').eq('user_id', user?.id).order('created_at', { ascending: false }),
        supabase.from('behavioral_patterns').select('*').eq('user_id', user?.id).order('updated_at', { ascending: false })
      ]);

      setPredictions(predictionsResult.data || []);
      setPatterns(patternsResult.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados preditivos",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const runAnalysis = async (type: 'patterns' | 'mood') => {
    setIsAnalyzing(true);
    try {
      const action = type === 'patterns' ? 'analyze_patterns' : 'predict_mood';
      const { data, error } = await supabase.functions.invoke('ai-predictions', {
        body: { action }
      });

      if (error) throw error;

      toast({
        title: "Análise Concluída",
        description: `${type === 'patterns' ? 'Padrões comportamentais' : 'Predições de humor'} atualizados`,
      });

      await loadData();
    } catch (error) {
      console.error('Error running analysis:', error);
      toast({
        title: "Erro",
        description: "Erro ao executar análise",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getMoodIcon = (value: number) => {
    if (value >= 7) return <TrendingUp className="h-5 w-5 text-green-500" />;
    if (value >= 4) return <Heart className="h-5 w-5 text-yellow-500" />;
    return <TrendingDown className="h-5 w-5 text-red-500" />;
  };

  const getRiskBadge = (level: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800', 
      high: 'bg-red-100 text-red-800'
    };
    return <Badge className={colors[level] || colors.medium}>{level}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 p-6">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span>Carregando dados preditivos...</span>
        </div>
      </div>
    );
  }

  const moodPredictions = predictions.filter(p => p.prediction_type === 'mood').slice(0, 7);
  const avgMoodPrediction = moodPredictions.length > 0 
    ? moodPredictions.reduce((sum, p) => sum + p.predicted_value, 0) / moodPredictions.length 
    : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Brain className="h-8 w-8 text-primary" />
          Dashboard Preditivo de IA
        </h1>
        <p className="text-muted-foreground">
          Análise inteligente e predições para sua saúde mental
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <Button 
          onClick={() => runAnalysis('patterns')} 
          disabled={isAnalyzing}
          className="flex items-center gap-2"
        >
          <BarChart3 className="h-4 w-4" />
          {isAnalyzing ? 'Analisando...' : 'Analisar Padrões'}
        </Button>
        <Button 
          onClick={() => runAnalysis('mood')} 
          disabled={isAnalyzing}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Heart className="h-4 w-4" />
          {isAnalyzing ? 'Predizendo...' : 'Prever Humor'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Mood Prediction Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Predição de Humor
            </CardTitle>
            <CardDescription>Próximos 7 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Humor Médio Previsto</span>
                {getMoodIcon(avgMoodPrediction)}
              </div>
              <Progress value={avgMoodPrediction * 10} className="w-full" />
              <div className="text-2xl font-bold">
                {avgMoodPrediction.toFixed(1)}/10
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pattern Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Padrões Identificados
            </CardTitle>
            <CardDescription>{patterns.length} padrões ativos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {patterns.slice(0, 3).map((pattern) => (
                <div key={pattern.id} className="flex items-center justify-between">
                  <span className="text-sm font-medium capitalize">
                    {pattern.pattern_type.replace('_', ' ')}
                  </span>
                  <div className="flex items-center gap-2">
                    <Progress value={pattern.strength * 100} className="w-16" />
                    <span className="text-xs text-muted-foreground">
                      {Math.round(pattern.strength * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Risk Assessment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Avaliação de Risco
            </CardTitle>
            <CardDescription>Status atual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {moodPredictions.slice(0, 3).map((prediction, index) => (
                <div key={prediction.id} className="flex items-center justify-between">
                  <span className="text-sm">
                    {new Date(prediction.target_date).toLocaleDateString('pt-BR')}
                  </span>
                  {getRiskBadge(prediction.metadata?.risk_level || 'medium')}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Predictions */}
      {moodPredictions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Predições Detalhadas
            </CardTitle>
            <CardDescription>Tendências de humor para os próximos dias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {moodPredictions.map((prediction) => (
                <div key={prediction.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {new Date(prediction.target_date).toLocaleDateString('pt-BR')}
                    </span>
                    {getMoodIcon(prediction.predicted_value)}
                  </div>
                  <Progress value={prediction.predicted_value * 10} className="w-full" />
                  <div className="flex items-center justify-between text-sm">
                    <span>Humor: {prediction.predicted_value.toFixed(1)}/10</span>
                    <span className="text-muted-foreground">
                      {Math.round(prediction.confidence_score * 100)}% confiança
                    </span>
                  </div>
                  {prediction.metadata?.factors && (
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground mb-1">Fatores:</p>
                      <div className="flex flex-wrap gap-1">
                        {prediction.metadata.factors.slice(0, 2).map((factor: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {factor}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Behavioral Patterns */}
      {patterns.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Padrões Comportamentais
            </CardTitle>
            <CardDescription>Tendências identificadas pela IA</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {patterns.map((pattern) => (
                <div key={pattern.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium capitalize">
                      {pattern.pattern_type.replace('_', ' ')}
                    </h4>
                    <Badge variant="outline">{pattern.frequency}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Força do Padrão:</span>
                      <Progress value={pattern.strength * 100} className="mt-1" />
                    </div>
                    <div>
                      <span className="text-muted-foreground">Confiança:</span>
                      <Progress value={pattern.confidence * 100} className="mt-1" />
                    </div>
                  </div>

                  {pattern.pattern_data && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Insights:</span>
                      <p className="mt-1">
                        {pattern.pattern_data.description || 'Padrão identificado nos dados de comportamento'}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {predictions.length === 0 && patterns.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhuma análise disponível</h3>
            <p className="text-muted-foreground mb-4">
              Execute uma análise para começar a ver predições e padrões
            </p>
            <Button onClick={() => runAnalysis('patterns')}>
              Iniciar Primeira Análise
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { 
  Lightbulb, 
  Clock, 
  Star, 
  CheckCircle2, 
  RefreshCw,
  Heart,
  Brain,
  Leaf,
  Moon,
  Zap,
  ThumbsUp,
  ThumbsDown,
  Play
} from 'lucide-react';

interface Recommendation {
  id: string;
  recommendation_type: string;
  title: string;
  description: string;
  content: any;
  priority: number;
  used_at?: string;
  feedback_rating?: number;
  created_at: string;
}

export default function PersonalizedRecommendations() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (user) {
      loadRecommendations();
    }
  }, [user]);

  const loadRecommendations = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('ai_recommendations')
        .select('*')
        .eq('user_id', user?.id)
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecommendations(data || []);
    } catch (error) {
      console.error('Error loading recommendations:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar recomendações",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateRecommendations = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-therapy', {
        body: { action: 'generate_recommendations' }
      });

      if (error) throw error;

      toast({
        title: "Recomendações Atualizadas",
        description: "Novas recomendações personalizadas foram geradas",
      });

      await loadRecommendations();
    } catch (error) {
      console.error('Error generating recommendations:', error);
      toast({
        title: "Erro",
        description: "Erro ao gerar recomendações",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const markAsUsed = async (recommendationId: string) => {
    try {
      const { error } = await supabase
        .from('ai_recommendations')
        .update({ used_at: new Date().toISOString() })
        .eq('id', recommendationId);

      if (error) throw error;

      setRecommendations(prev => 
        prev.map(rec => 
          rec.id === recommendationId 
            ? { ...rec, used_at: new Date().toISOString() }
            : rec
        )
      );

      toast({
        title: "Marcado como usado",
        description: "Recomendação marcada como executada",
      });
    } catch (error) {
      console.error('Error marking as used:', error);
    }
  };

  const provideFeedback = async (recommendationId: string, rating: number) => {
    try {
      const { error } = await supabase
        .from('ai_recommendations')
        .update({ feedback_rating: rating })
        .eq('id', recommendationId);

      if (error) throw error;

      setRecommendations(prev => 
        prev.map(rec => 
          rec.id === recommendationId 
            ? { ...rec, feedback_rating: rating }
            : rec
        )
      );

      toast({
        title: "Feedback enviado",
        description: "Obrigado pelo seu feedback!",
      });
    } catch (error) {
      console.error('Error providing feedback:', error);
    }
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      stress: <Brain className="h-5 w-5 text-blue-500" />,
      mood: <Heart className="h-5 w-5 text-red-500" />,
      sleep: <Moon className="h-5 w-5 text-purple-500" />,
      mindfulness: <Leaf className="h-5 w-5 text-green-500" />,
      lifestyle: <Zap className="h-5 w-5 text-yellow-500" />,
    };
    return icons[type] || <Lightbulb className="h-5 w-5 text-gray-500" />;
  };

  const getPriorityBadge = (priority: number) => {
    const styles = {
      3: 'bg-red-100 text-red-800',
      2: 'bg-yellow-100 text-yellow-800', 
      1: 'bg-green-100 text-green-800'
    };
    const labels = { 3: 'Alta', 2: 'Média', 1: 'Baixa' };
    return (
      <Badge className={styles[priority] || styles[2]}>
        {labels[priority] || 'Média'}
      </Badge>
    );
  };

  const getDifficultyBadge = (difficulty: string) => {
    const styles = {
      easy: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      hard: 'bg-red-100 text-red-800'
    };
    return (
      <Badge variant="outline" className={styles[difficulty] || styles.medium}>
        {difficulty === 'easy' ? 'Fácil' : difficulty === 'medium' ? 'Médio' : 'Difícil'}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 p-6">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span>Carregando recomendações...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Lightbulb className="h-8 w-8 text-primary" />
          Recomendações Personalizadas
        </h1>
        <p className="text-muted-foreground">
          Sugestões inteligentes baseadas no seu perfil e dados de saúde mental
        </p>
      </div>

      {/* Generate Button */}
      <div className="flex justify-center">
        <Button 
          onClick={generateRecommendations} 
          disabled={isGenerating}
          className="flex items-center gap-2"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Gerando...
            </>
          ) : (
            <>
              <Zap className="h-4 w-4" />
              Gerar Novas Recomendações
            </>
          )}
        </Button>
      </div>

      {/* Recommendations Grid */}
      {recommendations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((recommendation) => (
            <Card key={recommendation.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(recommendation.recommendation_type)}
                    <CardTitle className="text-lg">{recommendation.title}</CardTitle>
                  </div>
                  {getPriorityBadge(recommendation.priority)}
                </div>
                <CardDescription>{recommendation.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Recommendation Details */}
                {recommendation.content && (
                  <div className="space-y-3">
                    {recommendation.content.duration_minutes && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {recommendation.content.duration_minutes} minutos
                      </div>
                    )}

                    {recommendation.content.difficulty && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Dificuldade:</span>
                        {getDifficultyBadge(recommendation.content.difficulty)}
                      </div>
                    )}

                     {recommendation.content.expected_benefit && (
                       <div className="text-sm">
                         <span className="font-medium">Benefício esperado:</span>
                         <p className="text-muted-foreground mt-1">
                           {typeof recommendation.content.expected_benefit === 'string' 
                             ? recommendation.content.expected_benefit.replace(/better mood/gi, 'melhor humor')
                                 .replace(/reduced stress/gi, 'redução do estresse')
                                 .replace(/improved sleep/gi, 'melhor qualidade do sono')
                                 .replace(/increased focus/gi, 'maior foco')
                                 .replace(/relaxation/gi, 'relaxamento')
                                 .replace(/mindfulness/gi, 'atenção plena')
                                 .replace(/stress relief/gi, 'alívio do estresse')
                                 .replace(/emotional balance/gi, 'equilíbrio emocional')
                             : recommendation.content.expected_benefit
                           }
                         </p>
                       </div>
                     )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {!recommendation.used_at ? (
                    <Button 
                      onClick={() => markAsUsed(recommendation.id)}
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Play className="h-3 w-3" />
                      Executar
                    </Button>
                  ) : (
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Executado
                    </Badge>
                  )}
                </div>

                {/* Feedback */}
                {recommendation.used_at && !recommendation.feedback_rating && (
                  <div className="pt-3 border-t">
                    <p className="text-sm text-muted-foreground mb-2">Como foi a experiência?</p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => provideFeedback(recommendation.id, 5)}
                        className="flex items-center gap-1"
                      >
                        <ThumbsUp className="h-3 w-3" />
                        Útil
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => provideFeedback(recommendation.id, 2)}
                        className="flex items-center gap-1"
                      >
                        <ThumbsDown className="h-3 w-3" />
                        Pouco útil
                      </Button>
                    </div>
                  </div>
                )}

                {recommendation.feedback_rating && (
                  <div className="pt-3 border-t">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-muted-foreground">
                        Feedback enviado - Obrigado!
                      </span>
                    </div>
                  </div>
                )}

                {/* Usage Date */}
                {recommendation.used_at && (
                  <div className="text-xs text-muted-foreground">
                    Executado em {new Date(recommendation.used_at).toLocaleDateString('pt-BR')}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhuma recomendação disponível</h3>
            <p className="text-muted-foreground mb-4">
              Gere recomendações personalizadas baseadas no seu perfil
            </p>
            <Button onClick={generateRecommendations} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  Gerando...
                </>
              ) : (
                'Gerar Recomendações'
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
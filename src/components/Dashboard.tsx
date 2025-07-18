import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Heart, 
  Activity, 
  Moon, 
  TrendingUp, 
  Zap,
  Target,
  Calendar,
  Bell,
  Settings
} from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
  color: string;
}

const MetricCard = ({ title, value, change, trend, icon, color }: MetricCardProps) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-health-success';
      case 'down': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <Card className="bg-gradient-to-br from-card to-secondary/30 border-health-primary/20 hover:shadow-soft transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <div className={`flex items-center gap-1 text-xs ${getTrendColor()}`}>
              <TrendingUp className="h-3 w-3" />
              {change}
            </div>
          </div>
          <div className={`p-3 rounded-full bg-${color}/10`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const Dashboard = () => {
  const metrics = [
    {
      title: 'Nível de Estresse',
      value: '67%',
      change: '-12% hoje',
      trend: 'down' as const,
      icon: <Brain className="h-6 w-6 text-health-primary" />,
      color: 'health-primary'
    },
    {
      title: 'Frequência Cardíaca',
      value: '72 bpm',
      change: '+3% média',
      trend: 'up' as const,
      icon: <Heart className="h-6 w-6 text-health-accent" />,
      color: 'health-accent'
    },
    {
      title: 'Qualidade do Sono',
      value: '8.2/10',
      change: '+15% semana',
      trend: 'up' as const,
      icon: <Moon className="h-6 w-6 text-health-calm" />,
      color: 'health-calm'
    },
    {
      title: 'Atividade Física',
      value: '8,547',
      change: 'passos hoje',
      trend: 'stable' as const,
      icon: <Activity className="h-6 w-6 text-health-secondary" />,
      color: 'health-secondary'
    }
  ];

  const insights = [
    {
      title: 'Padrão de Voz Detectado',
      description: 'Sinais de ansiedade identificados na análise vocal das 14h',
      priority: 'high',
      time: '2h atrás'
    },
    {
      title: 'Sono Fragmentado',
      description: 'Detectadas 4 interrupções durante a noite passada',
      priority: 'medium',
      time: '8h atrás'
    },
    {
      title: 'Meta de Atividade Atingida',
      description: 'Parabéns! Você completou sua meta diária de exercícios',
      priority: 'low',
      time: '1h atrás'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'health-warning';
      case 'low': return 'health-success';
      default: return 'muted';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard de Saúde Mental</h2>
          <p className="text-muted-foreground">
            Acompanhe seus indicadores de bem-estar em tempo real
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Última semana
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configurar
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Progress Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-wellness shadow-card border-health-secondary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-health-secondary" />
              Metas Diárias
            </CardTitle>
            <CardDescription>Progresso das atividades de bem-estar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Exercícios de Respiração</span>
                <span>3/5 sessões</span>
              </div>
              <Progress value={60} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Tempo de Meditação</span>
                <span>15/20 min</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Hidratação</span>
                <span>6/8 copos</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Tempo ao Ar Livre</span>
                <span>45/60 min</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-calm shadow-card border-health-calm/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-health-calm" />
              Nível de Energia
            </CardTitle>
            <CardDescription>Baseado em múltiplos indicadores biométricos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="text-center py-8">
                <div className="text-4xl font-bold text-health-calm mb-2">78%</div>
                <p className="text-sm text-muted-foreground">Energia Atual</p>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full border-4 border-health-calm/20 border-t-health-calm animate-spin" 
                     style={{ animationDuration: '3s' }}></div>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Qualidade do Sono</span>
                <Badge variant="outline">Excelente</Badge>
              </div>
              <div className="flex justify-between">
                <span>Nível de Estresse</span>
                <Badge variant="outline">Moderado</Badge>
              </div>
              <div className="flex justify-between">
                <span>Atividade Física</span>
                <Badge variant="outline">Boa</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights & Alerts */}
      <Card className="shadow-card border-health-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-health-primary" />
            Insights Recentes
          </CardTitle>
          <CardDescription>
            Alertas e descobertas baseadas em seus dados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                <div className={`w-2 h-2 rounded-full bg-${getPriorityColor(insight.priority)} mt-2 flex-shrink-0`} />
                <div className="flex-1 space-y-1">
                  <h4 className="text-sm font-medium">{insight.title}</h4>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                </div>
                <div className="text-xs text-muted-foreground">{insight.time}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
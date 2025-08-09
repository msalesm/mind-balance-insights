import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dashboard } from '@/components/Dashboard';
import { VoiceAnalyzer } from '@/components/VoiceAnalyzer';
import HealthDataSync from '@/components/HealthDataSync';
import PredictiveDashboard from '@/components/PredictiveDashboard';
import AITherapyChat from '@/components/AITherapyChat';
import PersonalizedRecommendations from '@/components/PersonalizedRecommendations';
import UserMenu from '@/components/UserMenu';
import { LocationManager } from '@/components/LocationManager';
import { LocationMoodTracker } from '@/components/LocationMoodTracker';
import { 
  Brain, 
  Mic, 
  Heart, 
  Activity, 
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
  Target,
  MapPin
} from 'lucide-react';
import heroImage from '@/assets/hero-mental-health.jpg';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [autoStartVoice, setAutoStartVoice] = useState(false);
  const voiceSectionRef = useRef<HTMLDivElement | null>(null);
  // Check for URL parameters to handle auto-navigation
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    const autoStart = urlParams.get('autoStart');
    
    if (tab === 'voice') {
      setActiveTab('voice');
      if (autoStart === 'true') {
        setAutoStartVoice(true);
      }
    }
  }, []);

  // Smooth scroll to Voice Analysis when the tab becomes active
  useEffect(() => {
    if (activeTab === 'voice' && voiceSectionRef.current) {
      voiceSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activeTab]);

  const features = [
    {
      icon: <Mic className="h-6 w-6 text-health-primary" />,
      title: 'Análise de Voz Inteligente',
      description: 'Detecte padrões emocionais através da análise vocal em tempo real com IA avançada.'
    },
    {
      icon: <Heart className="h-6 w-6 text-health-accent" />,
      title: 'Monitoramento Biométrico',
      description: 'Integração com wearables para acompanhar frequência cardíaca, sono e atividade física.'
    },
    {
      icon: <Brain className="h-6 w-6 text-health-calm" />,
      title: 'Insights Psicológicos',
      description: 'IA especializada em saúde mental oferece recomendações personalizadas baseadas em dados.'
    },
    {
      icon: <Activity className="h-6 w-6 text-health-secondary" />,
      title: 'Acompanhamento Contínuo',
      description: 'Dashboard interativo com métricas em tempo real e análise de tendências.'
    }
  ];

  const stats = [
    { value: '92%', label: 'Precisão na Detecção', icon: <Target className="h-4 w-4" /> },
    { value: '24/7', label: 'Monitoramento', icon: <Shield className="h-4 w-4" /> },
    { value: '<2s', label: 'Análise em Tempo Real', icon: <Zap className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-bg">
      {/* Header with User Menu */}
      <header className="absolute top-0 right-0 z-10 p-6 animate-fade-in">
        <UserMenu />
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero animate-fade-in">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Mental Health Technology" 
            className="w-full h-full object-cover opacity-30 transition-opacity duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/40" />
        </div>
        
        <div className="relative container mx-auto px-4 py-32">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 mb-6 animate-slide-down">
              <Sparkles className="h-6 w-6 text-health-primary animate-glow" />
              <span className="text-health-primary font-semibold">Mind Balance Insights</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 font-heading animate-slide-up">
              <span className="text-gradient">Saúde Mental</span>
              <br />
              <span className="text-foreground">Inteligente</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl leading-relaxed animate-slide-up [animation-delay:0.2s]">
              Plataforma avançada que combina análise de voz, dados biométricos e inteligência artificial 
              para fornecer insights precisos sobre seu bem-estar mental em tempo real.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-slide-up [animation-delay:0.4s]">
              <Button 
                size="lg" 
                className="bg-gradient-primary btn-glow hover-lift font-medium"
                onClick={() => {
                  setActiveTab('voice');
                  setAutoStartVoice(true);
                }}
              >
                Iniciar Análise de Voz
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="glass-card hover-lift border-health-primary/50"
                onClick={() => setActiveTab('dashboard')}
              >
                Ver Dashboard
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 animate-slide-up [animation-delay:0.6s]">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-3 p-4 glass-card rounded-lg border border-health-primary/20 hover-lift group"
                  style={{ animationDelay: `${0.8 + index * 0.1}s` }}
                >
                  <div className="p-2 bg-health-primary/10 rounded-full group-hover:bg-health-primary/20 transition-colors">
                    {stat.icon}
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-health-primary font-heading">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading">
            Tecnologia de Ponta para Saúde Mental
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Combinamos múltiplas fontes de dados para criar o perfil mais completo do seu bem-estar
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="glass-card border-health-primary/20 hover-lift smooth-transition group animate-slide-up shadow-soft"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="p-3 bg-health-primary/10 rounded-full w-fit group-hover:bg-health-primary/20 group-hover:animate-glow transition-all">
                  {feature.icon}
                </div>
                <CardTitle className="text-lg font-heading">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Main Application */}
      <section className="py-20 container mx-auto px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-7 max-w-7xl mx-auto mb-12 glass-card p-2 h-auto animate-fade-in">{/* Mobile: 3 cols, Desktop: 7 cols */}
            <TabsTrigger value="dashboard" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm smooth-transition hover-lift">
              <Activity className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="predictions" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm smooth-transition hover-lift">
              <Brain className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden sm:inline">IA Preditiva</span>
            </TabsTrigger>
            <TabsTrigger value="therapy" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm smooth-transition hover-lift">
              <Sparkles className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden sm:inline">Terapia IA</span>
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm smooth-transition hover-lift">
              <Target className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden sm:inline">Recomendações</span>
            </TabsTrigger>
            <TabsTrigger value="voice" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm smooth-transition hover-lift">
              <Mic className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden sm:inline">Análise de Voz</span>
            </TabsTrigger>
            <TabsTrigger value="location" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm smooth-transition hover-lift">
              <MapPin className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden sm:inline">Localização</span>
            </TabsTrigger>
            <TabsTrigger value="health" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm smooth-transition hover-lift">
              <Heart className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden sm:inline">Saúde</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="mt-8 animate-fade-in">
            <Dashboard />
          </TabsContent>
          
          <TabsContent value="predictions" className="mt-8 animate-fade-in">
            <PredictiveDashboard />
          </TabsContent>
          
          <TabsContent value="therapy" className="mt-8 animate-fade-in">
            <AITherapyChat />
          </TabsContent>
          
          <TabsContent value="recommendations" className="mt-8 animate-fade-in">
            <PersonalizedRecommendations />
          </TabsContent>
          
           <TabsContent ref={voiceSectionRef} value="voice" id="voice-section" className="mt-8 animate-fade-in scroll-mt-24">
            <VoiceAnalyzer autoStart={autoStartVoice} onAutoStartComplete={() => setAutoStartVoice(false)} />
          </TabsContent>
          
          <TabsContent value="location" className="mt-8 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <LocationManager />
              <LocationMoodTracker />
            </div>
          </TabsContent>
          
          <TabsContent value="health" className="mt-8 animate-fade-in">
            <HealthDataSync />
          </TabsContent>
        </Tabs>
      </section>

      {/* Future Features Teaser */}
      <section className="py-20 bg-gradient-to-r from-health-primary/5 to-health-calm/5">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Funcionalidades de IA Avançadas
          </h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Tecnologias de inteligência artificial para revolucionar o cuidado com a saúde mental
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="p-6 bg-card/50 rounded-lg border border-health-secondary/20">
              <Heart className="h-8 w-8 text-health-secondary mx-auto mb-4" />
              <h4 className="font-semibold mb-2">Integração Wearables</h4>
              <p className="text-sm text-muted-foreground">
                Fitbit, Apple Watch, Garmin e outros dispositivos
              </p>
            </div>
            
            <div className="p-6 bg-card/50 rounded-lg border border-health-accent/20 cursor-pointer hover:bg-card/70 transition-colors" onClick={() => setActiveTab('predictions')}>
              <Brain className="h-8 w-8 text-health-accent mx-auto mb-4" />
              <h4 className="font-semibold mb-2">IA Preditiva ✓</h4>
              <p className="text-sm text-muted-foreground">
                Predições de humor e análise de padrões comportamentais
              </p>
            </div>
            
            <div className="p-6 bg-card/50 rounded-lg border border-health-calm/20 cursor-pointer hover:bg-card/70 transition-colors" onClick={() => setActiveTab('therapy')}>
              <Sparkles className="h-8 w-8 text-health-calm mx-auto mb-4" />
              <h4 className="font-semibold mb-2">Terapia com IA ✓</h4>
              <p className="text-sm text-muted-foreground">
                Chatbot terapêutico e recomendações personalizadas
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;

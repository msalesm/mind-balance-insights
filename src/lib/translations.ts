// Traduções para a aplicação
export const translations = {
  // Benefícios esperados
  expectedBenefits: {
    'better mood': 'melhora do humor',
    'reduced stress': 'redução do estresse',
    'improved focus': 'melhoria do foco',
    'better sleep': 'melhoria do sono',
    'increased energy': 'aumento da energia',
    'emotional balance': 'equilíbrio emocional',
    'anxiety relief': 'alívio da ansiedade',
    'mental clarity': 'clareza mental',
    'relaxation': 'relaxamento',
    'mindfulness': 'atenção plena',
    'self-awareness': 'autoconhecimento',
    'stress management': 'gestão do estresse',
    'improved confidence': 'melhoria da confiança',
    'better relationships': 'melhores relacionamentos',
    'emotional regulation': 'regulação emocional'
  },

  // Níveis de dificuldade
  difficulty: {
    'easy': 'fácil',
    'medium': 'médio',
    'hard': 'difícil',
    'beginner': 'iniciante',
    'intermediate': 'intermediário',
    'advanced': 'avançado'
  },

  // Tipos de recomendação
  recommendationTypes: {
    'exercise': 'exercício',
    'meditation': 'meditação',
    'breathing': 'respiração',
    'mindfulness': 'atenção plena',
    'therapy': 'terapia',
    'lifestyle': 'estilo de vida',
    'nutrition': 'nutrição',
    'sleep': 'sono',
    'social': 'social',
    'creative': 'criativo'
  },

  // Métricas de voz
  voiceMetrics: {
    'Pitch': 'Tom',
    'Energy': 'Energia',
    'Speaking Rate': 'Velocidade da Fala',
    'Pause Duration': 'Duração das Pausas',
    'Volume Variation': 'Variação do Volume',
    'Clarity': 'Clareza',
    'Confidence': 'Confiança',
    'Emotional Stability': 'Estabilidade Emocional'
  },

  // Estados emocionais
  emotions: {
    'happy': 'feliz',
    'sad': 'triste',
    'angry': 'irritado',
    'anxious': 'ansioso',
    'calm': 'calmo',
    'excited': 'animado',
    'frustrated': 'frustrado',
    'content': 'satisfeito',
    'stressed': 'estressado',
    'relaxed': 'relaxado',
    'worried': 'preocupado',
    'confident': 'confiante',
    'nervous': 'nervoso',
    'peaceful': 'em paz',
    'overwhelmed': 'sobrecarregado'
  },

  // Níveis de estresse
  stressLevels: {
    'low': 'baixo',
    'moderate': 'moderado',
    'high': 'alto',
    'very high': 'muito alto',
    'critical': 'crítico'
  },

  // Níveis de risco
  riskLevels: {
    'low': 'baixo',
    'medium': 'médio',
    'high': 'alto',
    'critical': 'crítico'
  },

  // Fatores psicológicos
  psychologicalFactors: {
    'cognitive_load': 'carga cognitiva',
    'emotional_regulation': 'regulação emocional',
    'stress_response': 'resposta ao estresse',
    'attention_focus': 'foco da atenção',
    'memory_function': 'função da memória',
    'decision_making': 'tomada de decisão',
    'social_interaction': 'interação social',
    'self_awareness': 'autoconhecimento'
  },

  // Mensagens do sistema
  system: {
    'loading': 'carregando',
    'error': 'erro',
    'success': 'sucesso',
    'failed': 'falhou',
    'completed': 'concluído',
    'processing': 'processando',
    'analyzing': 'analisando',
    'generating': 'gerando',
    'saving': 'salvando',
    'deleting': 'excluindo'
  },

  // Unidades de tempo
  timeUnits: {
    'second': 'segundo',
    'seconds': 'segundos',
    'minute': 'minuto',
    'minutes': 'minutos',
    'hour': 'hora',
    'hours': 'horas',
    'day': 'dia',
    'days': 'dias',
    'week': 'semana',
    'weeks': 'semanas',
    'month': 'mês',
    'months': 'meses'
  }
};

// Função helper para traduzir strings
export const translate = (key: string, category: keyof typeof translations): string => {
  const translationMap = translations[category] as Record<string, string>;
  return translationMap[key.toLowerCase()] || key;
};

// Função específica para traduzir benefícios esperados
export const translateBenefit = (benefit: string): string => {
  return translate(benefit, 'expectedBenefits');
};

// Função específica para traduzir dificuldade
export const translateDifficulty = (difficulty: string): string => {
  return translate(difficulty, 'difficulty');
};

// Função específica para traduzir emoções
export const translateEmotion = (emotion: string): string => {
  return translate(emotion, 'emotions');
};

// Função específica para traduzir métricas de voz
export const translateVoiceMetric = (metric: string): string => {
  return translate(metric, 'voiceMetrics');
};
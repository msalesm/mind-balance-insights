
-- Criar tabelas para análise de voz e dados de saúde

-- Tabela para análise de voz
CREATE TABLE voice_analysis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  audio_file_url TEXT,
  transcription TEXT,
  pitch_average FLOAT,
  pitch_variability FLOAT,
  volume_average FLOAT,
  jitter FLOAT,
  harmonics FLOAT,
  speech_rate FLOAT,
  pause_frequency FLOAT,
  emotional_tone JSONB,
  stress_indicators JSONB,
  psychological_analysis JSONB,
  confidence_score FLOAT,
  session_duration INTEGER, -- em segundos
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para dados de saúde do iPhone/Apple Health
CREATE TABLE health_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  data_type TEXT NOT NULL, -- 'steps', 'distance', 'calories', 'weight', etc.
  value FLOAT NOT NULL,
  unit TEXT NOT NULL,
  source TEXT DEFAULT 'apple_health',
  device_info JSONB,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
  synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela específica para dados de sono
CREATE TABLE sleep_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  sleep_start TIMESTAMP WITH TIME ZONE NOT NULL,
  sleep_end TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER NOT NULL,
  quality_score FLOAT, -- 0-100
  deep_sleep_minutes INTEGER,
  light_sleep_minutes INTEGER,
  rem_sleep_minutes INTEGER,
  awake_minutes INTEGER,
  interruptions_count INTEGER DEFAULT 0,
  heart_rate_average FLOAT,
  heart_rate_variability FLOAT,
  source TEXT DEFAULT 'apple_health',
  raw_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para dados de atividade física
CREATE TABLE activity_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL, -- 'running', 'walking', 'cycling', 'workout', etc.
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER NOT NULL,
  steps INTEGER,
  distance_meters FLOAT,
  calories_burned FLOAT,
  heart_rate_average FLOAT,
  heart_rate_max FLOAT,
  intensity_level TEXT, -- 'low', 'moderate', 'high'
  source TEXT DEFAULT 'apple_health',
  workout_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para frequência cardíaca detalhada
CREATE TABLE heart_rate_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  heart_rate INTEGER NOT NULL,
  context TEXT, -- 'resting', 'active', 'workout', 'recovery'
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
  source TEXT DEFAULT 'apple_health',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para análises correlacionadas (voz + saúde)
CREATE TABLE correlation_analysis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  voice_analysis_id UUID REFERENCES voice_analysis(id),
  analysis_date DATE NOT NULL,
  stress_score FLOAT, -- 0-100
  mood_score FLOAT, -- -100 to 100 (negativo = baixo humor, positivo = bom humor)
  energy_score FLOAT, -- 0-100
  sleep_correlation JSONB,
  activity_correlation JSONB,
  heart_rate_correlation JSONB,
  insights JSONB,
  recommendations JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_voice_analysis_user_id ON voice_analysis(user_id);
CREATE INDEX idx_voice_analysis_created_at ON voice_analysis(created_at);
CREATE INDEX idx_health_data_user_id ON health_data(user_id);
CREATE INDEX idx_health_data_type ON health_data(data_type);
CREATE INDEX idx_health_data_recorded_at ON health_data(recorded_at);
CREATE INDEX idx_sleep_data_user_id ON sleep_data(user_id);
CREATE INDEX idx_sleep_data_start ON sleep_data(sleep_start);
CREATE INDEX idx_activity_data_user_id ON activity_data(user_id);
CREATE INDEX idx_activity_data_start ON activity_data(start_time);
CREATE INDEX idx_heart_rate_data_user_id ON heart_rate_data(user_id);
CREATE INDEX idx_heart_rate_data_recorded_at ON heart_rate_data(recorded_at);
CREATE INDEX idx_correlation_analysis_user_id ON correlation_analysis(user_id);
CREATE INDEX idx_correlation_analysis_date ON correlation_analysis(analysis_date);

-- Políticas RLS (Row Level Security)
ALTER TABLE voice_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE sleep_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE heart_rate_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE correlation_analysis ENABLE ROW LEVEL SECURITY;

-- Políticas para voice_analysis
CREATE POLICY "Users can view their own voice analysis" ON voice_analysis
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own voice analysis" ON voice_analysis
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own voice analysis" ON voice_analysis
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own voice analysis" ON voice_analysis
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para health_data
CREATE POLICY "Users can view their own health data" ON health_data
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own health data" ON health_data
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health data" ON health_data
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para sleep_data
CREATE POLICY "Users can view their own sleep data" ON sleep_data
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sleep data" ON sleep_data
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sleep data" ON sleep_data
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para activity_data
CREATE POLICY "Users can view their own activity data" ON activity_data
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own activity data" ON activity_data
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own activity data" ON activity_data
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para heart_rate_data
CREATE POLICY "Users can view their own heart rate data" ON heart_rate_data
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own heart rate data" ON heart_rate_data
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own heart rate data" ON heart_rate_data
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para correlation_analysis
CREATE POLICY "Users can view their own correlation analysis" ON correlation_analysis
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own correlation analysis" ON correlation_analysis
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own correlation analysis" ON correlation_analysis
  FOR UPDATE USING (auth.uid() = user_id);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_voice_analysis_updated_at 
  BEFORE UPDATE ON voice_analysis 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

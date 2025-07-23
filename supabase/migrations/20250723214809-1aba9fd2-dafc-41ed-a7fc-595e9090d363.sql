-- Create AI Predictions table
CREATE TABLE public.ai_predictions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  prediction_type TEXT NOT NULL, -- 'mood', 'stress', 'anxiety', 'risk_score'
  predicted_value DOUBLE PRECISION NOT NULL,
  confidence_score DOUBLE PRECISION NOT NULL DEFAULT 0.0,
  prediction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  target_date DATE NOT NULL, -- when this prediction is for
  data_sources JSONB, -- what data was used for prediction
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create AI Recommendations table
CREATE TABLE public.ai_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  recommendation_type TEXT NOT NULL, -- 'therapy', 'exercise', 'meditation', 'lifestyle'
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content JSONB NOT NULL, -- detailed recommendation content
  priority INTEGER NOT NULL DEFAULT 1, -- 1=low, 2=medium, 3=high
  effectiveness_score DOUBLE PRECISION,
  used_at TIMESTAMP WITH TIME ZONE,
  feedback_rating INTEGER, -- 1-5 stars from user
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Create Behavioral Patterns table
CREATE TABLE public.behavioral_patterns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  pattern_type TEXT NOT NULL, -- 'voice_trend', 'activity_correlation', 'mood_cycle'
  pattern_data JSONB NOT NULL,
  strength DOUBLE PRECISION NOT NULL DEFAULT 0.0, -- how strong the pattern is
  frequency TEXT, -- 'daily', 'weekly', 'monthly'
  last_observed DATE,
  confidence DOUBLE PRECISION NOT NULL DEFAULT 0.0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create User Personality Profiles table
CREATE TABLE public.user_personality_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  personality_traits JSONB NOT NULL DEFAULT '{}', -- big 5, etc
  therapy_preferences JSONB NOT NULL DEFAULT '{}',
  communication_style TEXT,
  stress_triggers JSONB DEFAULT '[]',
  coping_mechanisms JSONB DEFAULT '[]',
  learning_style TEXT,
  motivation_factors JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create Therapy Sessions table
CREATE TABLE public.therapy_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  session_type TEXT NOT NULL, -- 'chat', 'guided_meditation', 'cbt_exercise'
  title TEXT NOT NULL,
  content JSONB NOT NULL,
  duration_minutes INTEGER,
  completion_status TEXT NOT NULL DEFAULT 'started', -- 'started', 'completed', 'paused'
  effectiveness_rating INTEGER, -- 1-5 from user
  ai_notes JSONB, -- AI observations and adjustments
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.ai_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.behavioral_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_personality_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapy_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for ai_predictions
CREATE POLICY "Users can view their own predictions" 
ON public.ai_predictions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own predictions" 
ON public.ai_predictions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for ai_recommendations
CREATE POLICY "Users can view their own recommendations" 
ON public.ai_recommendations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own recommendations" 
ON public.ai_recommendations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recommendations" 
ON public.ai_recommendations 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for behavioral_patterns
CREATE POLICY "Users can view their own patterns" 
ON public.behavioral_patterns 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own patterns" 
ON public.behavioral_patterns 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own patterns" 
ON public.behavioral_patterns 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for user_personality_profiles
CREATE POLICY "Users can view their own profile" 
ON public.user_personality_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile" 
ON public.user_personality_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.user_personality_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for therapy_sessions
CREATE POLICY "Users can view their own sessions" 
ON public.therapy_sessions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sessions" 
ON public.therapy_sessions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions" 
ON public.therapy_sessions 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_ai_predictions_user_date ON public.ai_predictions(user_id, prediction_date);
CREATE INDEX idx_ai_recommendations_user_priority ON public.ai_recommendations(user_id, priority, created_at);
CREATE INDEX idx_behavioral_patterns_user_type ON public.behavioral_patterns(user_id, pattern_type);
CREATE INDEX idx_therapy_sessions_user_date ON public.therapy_sessions(user_id, created_at);

-- Create trigger for updated_at
CREATE TRIGGER update_behavioral_patterns_updated_at
BEFORE UPDATE ON public.behavioral_patterns
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_personality_profiles_updated_at
BEFORE UPDATE ON public.user_personality_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
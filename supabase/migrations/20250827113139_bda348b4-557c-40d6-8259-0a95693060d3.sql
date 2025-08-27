-- Criar tabela para armazenar avaliações O-SRL
CREATE TABLE public.osrl_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  osrl_level INTEGER NOT NULL,
  overall_score INTEGER NOT NULL,
  pillar_scores JSONB NOT NULL,
  responses JSONB NOT NULL,
  personalized_analysis JSONB NOT NULL,
  report_html TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.osrl_assessments ENABLE ROW LEVEL SECURITY;

-- Política para usuários verem apenas suas próprias avaliações
CREATE POLICY "Users can view their own assessments" 
ON public.osrl_assessments 
FOR SELECT 
USING (auth.uid() = user_id);

-- Política para usuários criarem suas próprias avaliações
CREATE POLICY "Users can create their own assessments" 
ON public.osrl_assessments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Política para usuários atualizarem suas próprias avaliações
CREATE POLICY "Users can update their own assessments" 
ON public.osrl_assessments 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Política para usuários deletarem suas próprias avaliações
CREATE POLICY "Users can delete their own assessments" 
ON public.osrl_assessments 
FOR DELETE 
USING (auth.uid() = user_id);

-- Criar trigger para atualizar updated_at
CREATE TRIGGER update_osrl_assessments_updated_at
BEFORE UPDATE ON public.osrl_assessments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Criar índices para melhor performance
CREATE INDEX idx_osrl_assessments_user_id ON public.osrl_assessments(user_id);
CREATE INDEX idx_osrl_assessments_created_at ON public.osrl_assessments(created_at DESC);
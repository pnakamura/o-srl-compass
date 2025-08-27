import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface AssessmentData {
  id?: string;
  user_id: string;
  email: string;
  timestamp: string;
  osrl_level: number;
  overall_score: number;
  pillar_scores: any;
  responses: any;
  personalized_analysis: any;
  report_html: string;
  created_at?: string;
  updated_at?: string;
}

export const useAssessments = () => {
  const [assessments, setAssessments] = useState<AssessmentData[]>([]);
  const [loading, setLoading] = useState(false);

  const loadAssessments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('osrl_assessments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAssessments(data || []);
    } catch (error) {
      console.error('Error loading assessments:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar histórico de avaliações.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createAssessment = async (assessmentData: Omit<AssessmentData, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('osrl_assessments')
        .insert([assessmentData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Avaliação salva com sucesso.",
      });

      // Reload assessments
      await loadAssessments();
      
      return data;
    } catch (error) {
      console.error('Error creating assessment:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar avaliação.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const getAssessmentById = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('osrl_assessments')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting assessment:', error);
      throw error;
    }
  };

  const deleteAssessment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('osrl_assessments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Avaliação removida com sucesso.",
      });

      // Reload assessments
      await loadAssessments();
    } catch (error) {
      console.error('Error deleting assessment:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover avaliação.",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    loadAssessments();
  }, []);

  return {
    assessments,
    loading,
    createAssessment,
    getAssessmentById,
    deleteAssessment,
    loadAssessments
  };
};
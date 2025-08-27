import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { useAssessments, AssessmentData } from '@/hooks/useAssessments';
import { formatDate } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Download, Eye, Trash2, RefreshCw } from 'lucide-react';

interface SupabaseHistoryProps {
  onBack: () => void;
}

const SupabaseHistory: React.FC<SupabaseHistoryProps> = ({ onBack }) => {
  const { assessments, loading, deleteAssessment, loadAssessments } = useAssessments();
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentData | null>(null);

  const downloadReport = (assessment: AssessmentData) => {
    const blob = new Blob([assessment.report_html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `O-SRL_Assessment_Level_${assessment.osrl_level}_${new Date(assessment.timestamp).toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getLevelColor = (level: number) => {
    switch (level) {
      case 1: return 'bg-red-500';
      case 2: return 'bg-orange-500';
      case 3: return 'bg-yellow-500';
      case 4: return 'bg-blue-500';
      case 5: return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getLevelBadgeVariant = (level: number): "default" | "secondary" | "destructive" | "outline" => {
    switch (level) {
      case 1: 
      case 2: return 'destructive';
      case 3: return 'secondary';
      case 4: 
      case 5: return 'default';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Carregando histórico...</span>
        </div>
      </div>
    );
  }

  if (assessments.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Histórico de Avaliações</h1>
          <Button onClick={onBack} variant="outline">
            Voltar
          </Button>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground text-lg">
                Nenhuma avaliação encontrada.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Complete uma avaliação para ver seu histórico aqui.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Histórico de Avaliações</h1>
        <div className="flex gap-2">
          <Button onClick={loadAssessments} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Button onClick={onBack} variant="outline">
            Voltar
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {assessments.map((assessment) => (
          <Card key={assessment.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">
                      Nível O-SRL {assessment.osrl_level}
                    </CardTitle>
                    <Badge variant={getLevelBadgeVariant(assessment.osrl_level)}>
                      {assessment.overall_score} pontos
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(new Date(assessment.timestamp), 'dd/MM/yyyy às HH:mm', { locale: ptBR })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Email: {assessment.email}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedAssessment(assessment)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>
                          Detalhes da Avaliação - Nível O-SRL {selectedAssessment?.osrl_level}
                        </DialogTitle>
                        <DialogDescription>
                          Avaliação realizada em {selectedAssessment && formatDate(new Date(selectedAssessment.timestamp), 'dd/MM/yyyy às HH:mm', { locale: ptBR })}
                        </DialogDescription>
                      </DialogHeader>
                      
                      {selectedAssessment && (
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-semibold mb-4">Pontuação por Pilar</h3>
                            <div className="grid gap-4">
                              {Object.entries(selectedAssessment.pillar_scores).map(([pillar, score]) => {
                                const numericScore = Number(score);
                                return (
                                  <div key={pillar} className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                      <span className="font-medium">{pillar}</span>
                                      <span>{numericScore}/25</span>
                                    </div>
                                    <Progress value={(numericScore / 25) * 100} className="h-2" />
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          <div>
                            <h3 className="text-lg font-semibold mb-2">Pontos Fortes</h3>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                              {selectedAssessment.personalized_analysis.strengths.map((strength, index) => (
                                <li key={index}>{strength}</li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h3 className="text-lg font-semibold mb-2">Áreas para Melhoria</h3>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                              {selectedAssessment.personalized_analysis.improvements.map((improvement, index) => (
                                <li key={index}>{improvement}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => downloadReport(assessment)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => deleteAssessment(assessment.id!)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Pontuação por Pilar</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(assessment.pillar_scores).map(([pillar, score]) => {
                      const numericScore = Number(score);
                      return (
                        <div key={pillar} className="text-center">
                          <div className="text-sm font-medium mb-1">{pillar}</div>
                          <div className="text-lg font-bold">{numericScore}/25</div>
                          <div className={`h-2 rounded-full ${getLevelColor(Math.floor(numericScore / 5))}`} 
                               style={{ width: `${(numericScore / 25) * 100}%`, margin: '0 auto' }} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SupabaseHistory;
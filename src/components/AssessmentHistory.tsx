import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  History, 
  Calendar, 
  Target, 
  Mail,
  User,
  Download,
  Trash2,
  Eye
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface AssessmentData {
  email: string;
  timestamp: string;
  osrlLevel: number;
  overallScore: number;
  pillarScores: Record<string, number>;
  responses: Record<string, number>;
  reportHtml: string;
  personalizedAnalysis: any;
}

export function AssessmentHistory() {
  const { toast } = useToast();
  const [assessments, setAssessments] = useState<AssessmentData[]>([]);
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentData | null>(null);

  useEffect(() => {
    loadAssessments();
  }, []);

  const loadAssessments = () => {
    try {
      const data = localStorage.getItem('osrl-assessments');
      if (data) {
        const parsed = JSON.parse(data);
        setAssessments(parsed.sort((a: AssessmentData, b: AssessmentData) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        ));
      }
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    }
  };

  const clearHistory = () => {
    localStorage.removeItem('osrl-assessments');
    setAssessments([]);
    toast({
      title: "Histórico Limpo",
      description: "Todas as avaliações foram removidas do histórico local.",
    });
  };

  const downloadReport = (assessment: AssessmentData) => {
    const blob = new Blob([assessment.reportHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Relatorio-OSRL-Nivel-${assessment.osrlLevel}-${new Date(assessment.timestamp).toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Relatório Baixado",
      description: "O relatório foi baixado com sucesso.",
    });
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getLevelColor = (level: number) => {
    if (level <= 3) return 'destructive';
    if (level <= 6) return 'default';
    return 'secondary';
  };

  if (assessments.length === 0) {
    return (
      <Card className="shadow-medium">
        <CardContent className="text-center py-8">
          <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Nenhuma Avaliação Encontrada</h3>
          <p className="text-muted-foreground">
            Complete uma avaliação e envie os dados para ver o histórico aqui.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Histórico de Avaliações</h2>
          <p className="text-muted-foreground">
            {assessments.length} avaliação{assessments.length !== 1 ? 'ões' : ''} salva{assessments.length !== 1 ? 's' : ''} localmente
          </p>
        </div>
        {assessments.length > 0 && (
          <Button variant="outline" size="sm" onClick={clearHistory}>
            <Trash2 className="w-4 h-4 mr-2" />
            Limpar Histórico
          </Button>
        )}
      </div>

      <div className="grid gap-4">
        {assessments.map((assessment, index) => (
          <Card key={index} className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant={getLevelColor(assessment.osrlLevel) as "default" | "destructive" | "secondary" | "outline"} className="font-bold">
                      O-SRL {assessment.osrlLevel}
                    </Badge>
                    <span className="text-2xl font-bold text-primary">
                      {assessment.overallScore}%
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(assessment.timestamp)}
                    </div>
                    <div className="flex items-center gap-1">
                      {assessment.email === 'anonimo' ? (
                        <>
                          <User className="w-4 h-4" />
                          Anônimo
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4" />
                          {assessment.email}
                        </>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-foreground">Pilares Avaliados</div>
                      <div className="text-muted-foreground">
                        {Object.keys(assessment.pillarScores).length} pilares
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Perguntas Respondidas</div>
                      <div className="text-muted-foreground">
                        {Object.keys(assessment.responses).length} perguntas
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Melhor Pilar</div>
                      <div className="text-muted-foreground">
                        {Math.max(...Object.values(assessment.pillarScores))}%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedAssessment(assessment)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Detalhes da Avaliação</DialogTitle>
                        <DialogDescription>
                          Avaliação realizada em {formatDate(assessment.timestamp)}
                        </DialogDescription>
                      </DialogHeader>
                      {selectedAssessment && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-4 bg-primary/5 rounded-lg">
                              <div className="text-2xl font-bold text-primary">O-SRL {selectedAssessment.osrlLevel}</div>
                              <div className="text-sm text-muted-foreground">Nível Alcançado</div>
                            </div>
                            <div className="text-center p-4 bg-success/5 rounded-lg">
                              <div className="text-2xl font-bold text-success">{selectedAssessment.overallScore}%</div>
                              <div className="text-sm text-muted-foreground">Pontuação Geral</div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-2">Pontuação por Pilar:</h4>
                            <div className="space-y-2">
                              {Object.entries(selectedAssessment.pillarScores).map(([pillarId, score]) => (
                                <div key={pillarId} className="flex justify-between items-center">
                                  <span className="text-sm">Pilar {pillarId}</span>
                                  <Badge variant="secondary">{score}%</Badge>
                                </div>
                              ))}
                            </div>
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
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
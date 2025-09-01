import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  History, 
  Calendar, 
  Target, 
  Mail,
  User,
  Download,
  Trash2,
  Eye,
  ArrowLeft,
  TrendingUp,
  BarChart3,
  GitCompareArrows,
  LineChart
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { RadarChart } from './RadarChart';
import { PILLARS, OSRL_LEVELS } from '@/data/osrl-framework';

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

interface AssessmentHistoryProps {
  onBack?: () => void;
}

export function AssessmentHistory({ onBack }: AssessmentHistoryProps) {
  const { toast } = useToast();
  const [assessments, setAssessments] = useState<AssessmentData[]>([]);
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentData | null>(null);
  const [activeView, setActiveView] = useState<'list' | 'trends' | 'comparison'>('list');

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

  const formatShortDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    });
  };

  const getLevelColor = (level: number) => {
    if (level <= 3) return 'destructive';
    if (level <= 6) return 'default';
    return 'secondary';
  };

  const getEvolutionData = () => {
    if (assessments.length < 2) return null;
    
    const sortedAssessments = [...assessments].reverse(); // oldest first
    return sortedAssessments.map((assessment, index) => ({
      ...assessment,
      index,
      trend: index > 0 ? assessment.overallScore - sortedAssessments[index - 1].overallScore : 0
    }));
  };

  const getAverageImprovement = () => {
    const evolution = getEvolutionData();
    if (!evolution || evolution.length < 2) return 0;
    
    const improvements = evolution.slice(1).map(item => item.trend);
    return improvements.reduce((sum, improvement) => sum + improvement, 0) / improvements.length;
  };

  const getStrongestPillar = () => {
    if (assessments.length === 0) return null;
    
    const latest = assessments[0];
    const maxScore = Math.max(...Object.values(latest.pillarScores));
    const pillarId = Object.keys(latest.pillarScores).find(id => latest.pillarScores[id] === maxScore);
    const pillar = PILLARS.find(p => p.id === pillarId);
    
    return { pillar, score: maxScore };
  };

  const getWeakestPillar = () => {
    if (assessments.length === 0) return null;
    
    const latest = assessments[0];
    const minScore = Math.min(...Object.values(latest.pillarScores));
    const pillarId = Object.keys(latest.pillarScores).find(id => latest.pillarScores[id] === minScore);
    const pillar = PILLARS.find(p => p.id === pillarId);
    
    return { pillar, score: minScore };
  };

  const renderTrendChart = () => {
    const evolution = getEvolutionData();
    if (!evolution || evolution.length < 2) {
      return (
        <Card className="h-64 flex items-center justify-center">
          <p className="text-muted-foreground">Pelo menos 2 avaliações necessárias para visualizar tendências</p>
        </Card>
      );
    }

    const maxScore = 100;
    const chartHeight = 200;
    const chartWidth = 600;
    const padding = 40;

    return (
      <Card className="p-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Evolução da Maturidade
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full overflow-x-auto">
            <svg width={chartWidth} height={chartHeight + padding * 2} className="min-w-full">
              {/* Grid lines */}
              {[0, 25, 50, 75, 100].map(value => (
                <g key={value}>
                  <line
                    x1={padding}
                    y1={padding + (chartHeight - (value / maxScore) * chartHeight)}
                    x2={chartWidth - padding}
                    y2={padding + (chartHeight - (value / maxScore) * chartHeight)}
                    stroke="hsl(var(--border))"
                    strokeOpacity="0.3"
                  />
                  <text
                    x={padding - 10}
                    y={padding + (chartHeight - (value / maxScore) * chartHeight) + 4}
                    fontSize="10"
                    textAnchor="end"
                    fill="hsl(var(--muted-foreground))"
                  >
                    {value}%
                  </text>
                </g>
              ))}
              
              {/* Data line */}
              <polyline
                points={evolution.map((item, index) => {
                  const x = padding + (index / (evolution.length - 1)) * (chartWidth - padding * 2);
                  const y = padding + (chartHeight - (item.overallScore / maxScore) * chartHeight);
                  return `${x},${y}`;
                }).join(' ')}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
              />
              
              {/* Data points */}
              {evolution.map((item, index) => {
                const x = padding + (index / (evolution.length - 1)) * (chartWidth - padding * 2);
                const y = padding + (chartHeight - (item.overallScore / maxScore) * chartHeight);
                return (
                  <g key={index}>
                    <circle
                      cx={x}
                      cy={y}
                      r="4"
                      fill="hsl(var(--primary))"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <text
                      x={x}
                      y={padding + chartHeight + 20}
                      fontSize="10"
                      textAnchor="middle"
                      fill="hsl(var(--muted-foreground))"
                    >
                      {formatShortDate(item.timestamp)}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (assessments.length === 0) {
    return (
      <div className="space-y-6">
        {/* Back Button */}
        {onBack && (
          <Button 
            variant="outline" 
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Início
          </Button>
        )}
        
        <Card className="shadow-medium">
          <CardContent className="text-center py-8">
            <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Nenhuma Avaliação Encontrada</h3>
            <p className="text-muted-foreground">
              Complete uma avaliação para ver seu histórico e análises aqui.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const strongest = getStrongestPillar();
  const weakest = getWeakestPillar();
  const avgImprovement = getAverageImprovement();

  return (
    <div className="space-y-6">
      {/* Back Button */}
      {onBack && (
        <Button 
          variant="outline" 
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Início
        </Button>
      )}
      
      {/* Header with Stats */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Histórico de Avaliações</h2>
          <p className="text-muted-foreground">
            {assessments.length} avaliação{assessments.length !== 1 ? 'ões' : ''} realizada{assessments.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        {/* Quick Stats */}
        <div className="flex flex-wrap gap-4">
          {assessments.length > 0 && (
            <>
              <Card className="p-3 min-w-[140px]">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{assessments[0].overallScore}%</div>
                  <div className="text-xs text-muted-foreground">Última Pontuação</div>
                </div>
              </Card>
              
              {avgImprovement !== 0 && (
                <Card className="p-3 min-w-[140px]">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${avgImprovement > 0 ? 'text-success' : 'text-destructive'}`}>
                      {avgImprovement > 0 ? '+' : ''}{Math.round(avgImprovement)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Melhoria Média</div>
                  </div>
                </Card>
              )}
              
              {strongest && (
                <Card className="p-3 min-w-[140px]">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success">{Math.round(strongest.score)}%</div>
                    <div className="text-xs text-muted-foreground">Ponto Forte</div>
                  </div>
                </Card>
              )}
            </>
          )}
          
          <Button variant="outline" size="sm" onClick={clearHistory}>
            <Trash2 className="w-4 h-4 mr-2" />
            Limpar Histórico
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <Tabs value={activeView} onValueChange={(value) => setActiveView(value as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <History className="w-4 h-4" />
            Lista
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Tendências
          </TabsTrigger>
          <TabsTrigger value="comparison" className="flex items-center gap-2">
            <GitCompareArrows className="w-4 h-4" />
            Comparação
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {/* Assessment List with Radar Charts */}
          <div className="grid gap-4">
            {assessments.map((assessment, index) => (
              <Card key={index} className="shadow-soft overflow-hidden">
                <CardContent className="p-0">
                  <div className="grid lg:grid-cols-3 gap-0">
                    {/* Assessment Info */}
                    <div className="lg:col-span-2 p-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge variant={getLevelColor(assessment.osrlLevel) as "default" | "destructive" | "secondary" | "outline"} className="font-bold">
                              O-SRL {assessment.osrlLevel}
                            </Badge>
                            <span className="text-2xl font-bold text-primary">
                              {assessment.overallScore}%
                            </span>
                            {index < assessments.length - 1 && (
                              <Badge variant="outline" className={`text-xs ${
                                assessment.overallScore > assessments[index + 1].overallScore 
                                  ? 'text-success border-success' 
                                  : assessment.overallScore < assessments[index + 1].overallScore 
                                    ? 'text-destructive border-destructive'
                                    : 'text-muted-foreground'
                              }`}>
                                {assessment.overallScore > assessments[index + 1].overallScore 
                                  ? `+${assessment.overallScore - assessments[index + 1].overallScore}%` 
                                  : assessment.overallScore < assessments[index + 1].overallScore
                                    ? `${assessment.overallScore - assessments[index + 1].overallScore}%`
                                    : '0%'
                                }
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground mb-3">
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

                          {/* Pillar Progress Bars */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                            {PILLARS.map((pillar) => {
                              const score = assessment.pillarScores[pillar.id] || 0;
                              return (
                                <div key={pillar.id} className="space-y-1">
                                  <div className="flex justify-between items-center">
                                    <span className="text-xs font-medium truncate">{pillar.name.split(' ')[0]}</span>
                                    <Badge variant="secondary" className="text-xs">{score}%</Badge>
                                  </div>
                                  <Progress value={score} className="h-1.5" />
                                </div>
                              );
                            })}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setSelectedAssessment(assessment)}
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  Detalhes
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Análise Detalhada da Avaliação</DialogTitle>
                                  <DialogDescription>
                                    Avaliação realizada em {formatDate(assessment.timestamp)}
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedAssessment && (
                                  <div className="grid lg:grid-cols-2 gap-6">
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
                                          {PILLARS.map((pillar) => {
                                            const score = selectedAssessment.pillarScores[pillar.id] || 0;
                                            return (
                                              <div key={pillar.id} className="space-y-1">
                                                <div className="flex justify-between items-center">
                                                  <span className="text-sm font-medium">{pillar.name}</span>
                                                  <Badge variant="secondary">{score}%</Badge>
                                                </div>
                                                <Progress value={score} className="h-2" />
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-center">
                                      <RadarChart data={selectedAssessment.pillarScores} />
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
                              <Download className="w-4 h-4 mr-2" />
                              Relatório
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Radar Chart */}
                    <div className="bg-muted/20 p-6 flex items-center justify-center border-l">
                      <div className="scale-75">
                        <RadarChart data={assessment.pillarScores} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          {/* Trend Analysis */}
          {renderTrendChart()}
          
          {/* Insights */}
          <div className="grid md:grid-cols-2 gap-6">
            {strongest && (
              <Card className="border-success/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-success">
                    <Target className="w-5 h-5" />
                    Área de Excelência
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="font-semibold">{strongest.pillar?.name}</h4>
                    <div className="text-2xl font-bold text-success">{Math.round(strongest.score)}%</div>
                    <p className="text-sm text-muted-foreground">
                      {strongest.pillar?.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {weakest && (
              <Card className="border-warning/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-warning">
                    <Target className="w-5 h-5" />
                    Oportunidade de Melhoria
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="font-semibold">{weakest.pillar?.name}</h4>
                    <div className="text-2xl font-bold text-warning">{Math.round(weakest.score)}%</div>
                    <p className="text-sm text-muted-foreground">
                      {weakest.pillar?.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          {assessments.length >= 2 ? (
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Latest vs Previous Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle>Última vs Anterior</CardTitle>
                  <CardDescription>Comparação entre as duas avaliações mais recentes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {PILLARS.map((pillar) => {
                    const latest = assessments[0].pillarScores[pillar.id] || 0;
                    const previous = assessments[1].pillarScores[pillar.id] || 0;
                    const diff = latest - previous;
                    
                    return (
                      <div key={pillar.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{pillar.name}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{Math.round(latest)}%</Badge>
                            <Badge variant={diff > 0 ? 'default' : diff < 0 ? 'destructive' : 'secondary'} className="text-xs">
                              {diff > 0 ? '+' : ''}{Math.round(diff)}%
                            </Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Progress value={previous} className="h-2 opacity-60" />
                          <Progress value={latest} className="h-2" />
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
              
              {/* Radar Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle>Comparação Visual</CardTitle>
                  <CardDescription>Evolução no radar de maturidade</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <div className="relative">
                    <RadarChart data={assessments[0].pillarScores} />
                    {/* Overlay previous assessment with different opacity */}
                    <div className="absolute inset-0 opacity-30">
                      <RadarChart data={assessments[1].pillarScores} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="p-8 text-center">
              <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Comparação Indisponível</h3>
              <p className="text-muted-foreground">
                Realize pelo menos 2 avaliações para ver comparações detalhadas.
              </p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
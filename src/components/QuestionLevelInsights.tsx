import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp,
  ArrowRight,
  Eye,
  EyeOff,
  Target,
  Clock,
  Zap,
  Users
} from 'lucide-react';
import { PILLARS, QUESTIONS } from '@/data/osrl-framework';
import { QuestionInsight, ResponsePattern } from '@/lib/detailedResponseAnalyzer';

interface QuestionLevelInsightsProps {
  questionInsights: QuestionInsight[];
  responsePatterns: ResponsePattern[];
  responses: Record<string, number>;
}

export function QuestionLevelInsights({ 
  questionInsights, 
  responsePatterns, 
  responses 
}: QuestionLevelInsightsProps) {
  const [showDetails, setShowDetails] = useState<Record<string, boolean>>({});
  const [selectedPillar, setSelectedPillar] = useState<string>('all');

  const toggleDetails = (questionId: string) => {
    setShowDetails(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case 'good':
        return <CheckCircle2 className="h-4 w-4 text-blue-500" />;
      case 'excellent':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical':
        return 'destructive';
      case 'warning':
        return 'default';
      case 'good':
        return 'secondary';
      case 'excellent':
        return 'default';
      default:
        return 'default';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return <Clock className="h-3 w-3 text-destructive" />;
      case 'medium':
        return <Clock className="h-3 w-3 text-amber-500" />;
      case 'low':
        return <Clock className="h-3 w-3 text-green-500" />;
      default:
        return <Clock className="h-3 w-3 text-muted-foreground" />;
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'high':
        return <Zap className="h-3 w-3 text-destructive" />;
      case 'medium':
        return <Zap className="h-3 w-3 text-amber-500" />;
      case 'low':
        return <Zap className="h-3 w-3 text-green-500" />;
      default:
        return <Zap className="h-3 w-3 text-muted-foreground" />;
    }
  };

  const getPatternIcon = (type: string) => {
    switch (type) {
      case 'inconsistency':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'bottleneck':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'enabler':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'cascade_risk':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const filteredInsights = selectedPillar === 'all' 
    ? questionInsights 
    : questionInsights.filter(insight => insight.pillarId === selectedPillar);

  // Organizar insights por pilar
  const insightsByPillar = PILLARS.reduce((acc, pillar) => {
    acc[pillar.id] = questionInsights.filter(insight => insight.pillarId === pillar.id);
    return acc;
  }, {} as Record<string, QuestionInsight[]>);

  // Estatísticas gerais
  const criticalCount = questionInsights.filter(insight => insight.status === 'critical').length;
  const warningCount = questionInsights.filter(insight => insight.status === 'warning').length;
  const goodCount = questionInsights.filter(insight => insight.status === 'good').length;
  const excellentCount = questionInsights.filter(insight => insight.status === 'excellent').length;

  return (
    <div className="space-y-6">
      {/* Visão Geral */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Análise Detalhada por Questão
          </CardTitle>
          <CardDescription>
            Diagnóstico específico de cada questão com insights personalizados e recomendações direcionadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-destructive">{criticalCount}</div>
              <div className="text-sm text-muted-foreground">Críticas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600">{warningCount}</div>
              <div className="text-sm text-muted-foreground">Atenção</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{goodCount}</div>
              <div className="text-sm text-muted-foreground">Boas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{excellentCount}</div>
              <div className="text-sm text-muted-foreground">Excelentes</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="insights" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="insights">Insights por Questão</TabsTrigger>
          <TabsTrigger value="patterns">Padrões Identificados</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-4">
          {/* Filtro por Pilar */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedPillar === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPillar('all')}
            >
              Todos os Pilares
            </Button>
            {PILLARS.map(pillar => (
              <Button
                key={pillar.id}
                variant={selectedPillar === pillar.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPillar(pillar.id)}
              >
                {pillar.name}
                <Badge variant="secondary" className="ml-2">
                  {insightsByPillar[pillar.id]?.length || 0}
                </Badge>
              </Button>
            ))}
          </div>

          {/* Lista de Insights */}
          <div className="space-y-3">
            {filteredInsights.map((insight) => {
              const pillar = PILLARS.find(p => p.id === insight.pillarId);
              const question = QUESTIONS.find(q => q.id === insight.questionId);
              
              return (
                <Card key={insight.questionId} className="transition-all hover:shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusIcon(insight.status)}
                          <Badge variant={getStatusColor(insight.status)}>
                            {insight.responseLabel}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {pillar?.name}
                          </Badge>
                          <div className="flex items-center gap-1">
                            {getUrgencyIcon(insight.urgency)}
                            <span className="text-xs">{insight.urgency}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {getImpactIcon(insight.impact)}
                            <span className="text-xs">{insight.impact}</span>
                          </div>
                        </div>
                        <CardTitle className="text-base">{insight.question}</CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <Progress value={insight.response * 20} className="flex-1 h-2" />
                          <span className="text-sm font-medium">{insight.response}/5</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleDetails(insight.questionId)}
                      >
                        {showDetails[insight.questionId] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </CardHeader>

                  {showDetails[insight.questionId] && (
                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        {/* Issues Específicos */}
                        {insight.specificIssues.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4 text-amber-500" />
                              Problemas Identificados
                            </h4>
                            <ul className="space-y-1">
                              {insight.specificIssues.map((issue, index) => (
                                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                                  <ArrowRight className="h-3 w-3 mt-0.5 text-amber-500 flex-shrink-0" />
                                  {issue}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Recomendações Específicas */}
                        {insight.specificRecommendations.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                              Recomendações Específicas
                            </h4>
                            <ul className="space-y-1">
                              {insight.specificRecommendations.map((rec, index) => (
                                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                                  <ArrowRight className="h-3 w-3 mt-0.5 text-green-500 flex-shrink-0" />
                                  {rec}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Dependências e Impactos */}
                        <div className="grid md:grid-cols-2 gap-4">
                          {insight.dependsOn.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-sm mb-2">Depende de:</h4>
                              <div className="flex flex-wrap gap-1">
                                {insight.dependsOn.map((dep) => (
                                  <Badge key={dep} variant="outline" className="text-xs">
                                    {dep}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {insight.affects.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-sm mb-2">Afeta:</h4>
                              <div className="flex flex-wrap gap-1">
                                {insight.affects.map((affect) => (
                                  <Badge key={affect} variant="outline" className="text-xs">
                                    {affect}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          <div className="space-y-4">
            {responsePatterns.map((pattern, index) => (
              <Card key={index} className="transition-all hover:shadow-md">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    {getPatternIcon(pattern.type)}
                    <div className="flex-1">
                      <CardTitle className="text-base">{pattern.title}</CardTitle>
                      <CardDescription className="mt-1">{pattern.description}</CardDescription>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge 
                          variant={pattern.severity === 'high' ? 'destructive' : pattern.severity === 'medium' ? 'default' : 'secondary'}
                        >
                          Severidade: {pattern.severity}
                        </Badge>
                        <Badge variant="outline">
                          {pattern.questions.length} questões envolvidas
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Questões Envolvidas */}
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Questões Envolvidas:</h4>
                      <div className="flex flex-wrap gap-1">
                        {pattern.questions.map((qId) => {
                          const question = QUESTIONS.find(q => q.id === qId);
                          return (
                            <Badge key={qId} variant="outline" className="text-xs">
                              {question?.text.substring(0, 50)}...
                            </Badge>
                          );
                        })}
                      </div>
                    </div>

                    {/* Recomendações do Padrão */}
                    <div>
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-500" />
                        Ações Recomendadas
                      </h4>
                      <ul className="space-y-1">
                        {pattern.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                            <ArrowRight className="h-3 w-3 mt-0.5 text-blue-500 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {responsePatterns.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Nenhum padrão problemático identificado. Suas respostas mostram boa consistência!
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
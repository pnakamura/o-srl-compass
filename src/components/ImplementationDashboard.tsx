import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar,
  Clock,
  DollarSign,
  Users,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Target,
  Zap,
  TrendingUp,
  PlayCircle,
  PauseCircle,
  FileText,
  Download
} from 'lucide-react';
import { ContextualRecommendation, RecommendationPlan, ImplementationStep } from '@/lib/contextualRecommendationEngine';

interface ImplementationDashboardProps {
  recommendationPlan: RecommendationPlan;
}

export function ImplementationDashboard({ recommendationPlan }: ImplementationDashboardProps) {
  const [selectedPhase, setSelectedPhase] = useState<'phase1' | 'phase2' | 'phase3'>('phase1');
  const [expandedRecommendation, setExpandedRecommendation] = useState<string | null>(null);

  const getPhaseData = (phase: string) => {
    switch (phase) {
      case 'phase1':
        return {
          title: 'Fase 1: Fundação',
          description: 'Estabelecer bases sólidas para maturidade organizacional',
          recommendations: recommendationPlan.phase1_foundation,
          timeline: recommendationPlan.estimatedTimeline.phase1,
          color: 'text-red-600 bg-red-50 border-red-200'
        };
      case 'phase2':
        return {
          title: 'Fase 2: Processos',
          description: 'Implementar processos estruturados e governance',
          recommendations: recommendationPlan.phase2_process,
          timeline: recommendationPlan.estimatedTimeline.phase2,
          color: 'text-amber-600 bg-amber-50 border-amber-200'
        };
      case 'phase3':
        return {
          title: 'Fase 3: Otimização',
          description: 'Otimizar e institucionalizar práticas avançadas',
          recommendations: recommendationPlan.phase3_optimization,
          timeline: recommendationPlan.estimatedTimeline.phase3,
          color: 'text-green-600 bg-green-50 border-green-200'
        };
      default:
        return {
          title: '',
          description: '',
          recommendations: [],
          timeline: '',
          color: ''
        };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'default';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getCostColor = (cost: string) => {
    switch (cost) {
      case 'alto':
        return 'text-red-600';
      case 'médio':
        return 'text-amber-600';
      case 'baixo':
        return 'text-green-600';
      default:
        return 'text-muted-foreground';
    }
  };

  const toggleRecommendationExpansion = (recId: string) => {
    setExpandedRecommendation(expandedRecommendation === recId ? null : recId);
  };

  const currentPhaseData = getPhaseData(selectedPhase);

  // Calcular estatísticas
  const totalRecommendations = recommendationPlan.phase1_foundation.length + 
                              recommendationPlan.phase2_process.length + 
                              recommendationPlan.phase3_optimization.length;
  
  const criticalCount = [
    ...recommendationPlan.phase1_foundation,
    ...recommendationPlan.phase2_process,
    ...recommendationPlan.phase3_optimization
  ].filter(rec => rec.priority === 'critical').length;

  const quickWinsCount = [
    ...recommendationPlan.phase1_foundation,
    ...recommendationPlan.phase2_process,
    ...recommendationPlan.phase3_optimization
  ].filter(rec => rec.quickWin).length;

  return (
    <div className="space-y-6">
      {/* Visão Geral do Plano */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Plano de Implementação Estratégico
          </CardTitle>
          <CardDescription>
            Roadmap estruturado em 3 fases para evolução da maturidade organizacional
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{totalRecommendations}</div>
              <div className="text-sm text-muted-foreground">Recomendações Totais</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-destructive">{criticalCount}</div>
              <div className="text-sm text-muted-foreground">Ações Críticas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{quickWinsCount}</div>
              <div className="text-sm text-muted-foreground">Quick Wins</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{recommendationPlan.estimatedTimeline.total}</div>
              <div className="text-sm text-muted-foreground">Duração Total</div>
            </div>
          </div>

          {/* Timeline das Fases */}
          <div className="grid md:grid-cols-3 gap-4">
            {['phase1', 'phase2', 'phase3'].map((phase, index) => {
              const phaseData = getPhaseData(phase);
              const isSelected = selectedPhase === phase;
              
              return (
                <Card 
                  key={phase}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    isSelected ? phaseData.color : 'border-border'
                  }`}
                  onClick={() => setSelectedPhase(phase as any)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">Fase {index + 1}</Badge>
                      <div className="text-sm font-medium">{phaseData.timeline}</div>
                    </div>
                    <CardTitle className="text-base">{phaseData.title}</CardTitle>
                    <CardDescription className="text-xs">
                      {phaseData.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-sm">
                      <span>{phaseData.recommendations.length} ações</span>
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                        <span className="text-xs">0% concluído</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Investimento Estimado */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="font-semibold">Investimento Total Estimado</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">
                  {recommendationPlan.totalInvestment.low} - {recommendationPlan.totalInvestment.high}
                </div>
                <div className="text-xs text-muted-foreground">
                  Faixa de investimento (recursos, treinamento, ferramentas)
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detalhes da Fase Selecionada */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlayCircle className="h-5 w-5" />
            {currentPhaseData.title}
          </CardTitle>
          <CardDescription>
            {currentPhaseData.description} • {currentPhaseData.timeline} • {currentPhaseData.recommendations.length} ações
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentPhaseData.recommendations.map((recommendation) => (
              <Card key={recommendation.id} className="transition-all hover:shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={getPriorityColor(recommendation.priority)}>
                          {recommendation.priority}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {recommendation.category}
                        </Badge>
                        {recommendation.quickWin && (
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                            <Zap className="h-3 w-3 mr-1" />
                            Quick Win
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-base">{recommendation.title}</CardTitle>
                      <CardDescription className="text-sm mt-1">
                        {recommendation.description}
                      </CardDescription>
                      
                      {/* Informações Básicas */}
                      <div className="flex flex-wrap gap-3 mt-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {recommendation.estimatedEffort.time}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {recommendation.estimatedEffort.resources}
                        </div>
                        <div className={`flex items-center gap-1 ${getCostColor(recommendation.estimatedEffort.cost)}`}>
                          <DollarSign className="h-3 w-3" />
                          Custo {recommendation.estimatedEffort.cost}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleRecommendationExpansion(recommendation.id)}
                    >
                      {expandedRecommendation === recommendation.id ? 'Menos' : 'Mais'}
                    </Button>
                  </div>
                </CardHeader>

                {expandedRecommendation === recommendation.id && (
                  <CardContent className="pt-0">
                    <Tabs defaultValue="steps" className="w-full">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="steps">Passos</TabsTrigger>
                        <TabsTrigger value="deliverables">Entregas</TabsTrigger>
                        <TabsTrigger value="impact">Impacto</TabsTrigger>
                        <TabsTrigger value="risks">Riscos</TabsTrigger>
                      </TabsList>

                      <TabsContent value="steps" className="space-y-3">
                        <h4 className="font-semibold text-sm">Passos de Implementação</h4>
                        {recommendation.implementationSteps.map((step, index) => (
                          <div key={index} className="flex gap-3">
                            <div className="flex-shrink-0">
                              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                                {step.step}
                              </div>
                            </div>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                <h5 className="font-medium text-sm">{step.title}</h5>
                                <Badge variant="outline" className="text-xs">
                                  {step.duration}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{step.description}</p>
                              <div className="text-xs text-muted-foreground">
                                <strong>Responsável:</strong> {step.responsible}
                              </div>
                              {step.deliverables.length > 0 && (
                                <div className="text-xs">
                                  <strong>Entregas:</strong> {step.deliverables.join(', ')}
                                </div>
                              )}
                              {step.checkpoints.length > 0 && (
                                <div className="text-xs">
                                  <strong>Checkpoints:</strong> {step.checkpoints.join(', ')}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </TabsContent>

                      <TabsContent value="deliverables" className="space-y-3">
                        <h4 className="font-semibold text-sm">Entregas Esperadas</h4>
                        <ul className="space-y-2">
                          {recommendation.deliverables.map((deliverable, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              {deliverable}
                            </li>
                          ))}
                        </ul>
                        
                        {recommendation.templates.length > 0 && (
                          <div className="mt-4">
                            <h5 className="font-semibold text-sm mb-2">Templates e Ferramentas</h5>
                            <div className="space-y-2">
                              {recommendation.templates.map((template, index) => (
                                <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                                  <FileText className="h-4 w-4 text-blue-500" />
                                  <div className="flex-1">
                                    <div className="font-medium text-sm">{template.name}</div>
                                    <div className="text-xs text-muted-foreground">{template.description}</div>
                                  </div>
                                  <Badge variant="outline" className="text-xs">
                                    {template.type}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent value="impact" className="space-y-3">
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <h5 className="font-semibold text-sm mb-2 flex items-center gap-1">
                              <Zap className="h-3 w-3 text-green-500" />
                              Curto Prazo
                            </h5>
                            <ul className="space-y-1">
                              {recommendation.impact.short.map((impact, index) => (
                                <li key={index} className="text-sm text-muted-foreground flex items-start gap-1">
                                  <ArrowRight className="h-3 w-3 mt-0.5 text-green-500 flex-shrink-0" />
                                  {impact}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-semibold text-sm mb-2 flex items-center gap-1">
                              <TrendingUp className="h-3 w-3 text-blue-500" />
                              Médio Prazo
                            </h5>
                            <ul className="space-y-1">
                              {recommendation.impact.medium.map((impact, index) => (
                                <li key={index} className="text-sm text-muted-foreground flex items-start gap-1">
                                  <ArrowRight className="h-3 w-3 mt-0.5 text-blue-500 flex-shrink-0" />
                                  {impact}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-semibold text-sm mb-2 flex items-center gap-1">
                              <Target className="h-3 w-3 text-purple-500" />
                              Longo Prazo
                            </h5>
                            <ul className="space-y-1">
                              {recommendation.impact.long.map((impact, index) => (
                                <li key={index} className="text-sm text-muted-foreground flex items-start gap-1">
                                  <ArrowRight className="h-3 w-3 mt-0.5 text-purple-500 flex-shrink-0" />
                                  {impact}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="mt-4">
                          <h5 className="font-semibold text-sm mb-2">Métricas de Sucesso</h5>
                          <ul className="space-y-1">
                            {recommendation.successMetrics.map((metric, index) => (
                              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                                <Target className="h-3 w-3 mt-0.5 text-primary flex-shrink-0" />
                                {metric}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </TabsContent>

                      <TabsContent value="risks" className="space-y-3">
                        <h4 className="font-semibold text-sm">Riscos de Implementação</h4>
                        <ul className="space-y-2">
                          {recommendation.risks.map((risk, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                              {risk}
                            </li>
                          ))}
                        </ul>

                        {recommendation.prerequisites.length > 0 && (
                          <div className="mt-4">
                            <h5 className="font-semibold text-sm mb-2">Pré-requisitos</h5>
                            <div className="space-y-1">
                              {recommendation.prerequisites.map((prereq, index) => (
                                <Badge key={index} variant="outline" className="mr-2 mb-1">
                                  {prereq}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {recommendation.dependentActions.length > 0 && (
                          <div className="mt-4">
                            <h5 className="font-semibold text-sm mb-2">Ações Dependentes</h5>
                            <div className="space-y-1">
                              {recommendation.dependentActions.map((action, index) => (
                                <Badge key={index} variant="outline" className="mr-2 mb-1">
                                  {action}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Caminho Crítico */}
      {recommendationPlan.criticalPath.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5" />
              Caminho Crítico
            </CardTitle>
            <CardDescription>
              Sequência prioritária de ações para maximizar impacto e eficiência
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recommendationPlan.criticalPath.map((actionId, index) => {
                const allRecommendations = [
                  ...recommendationPlan.phase1_foundation,
                  ...recommendationPlan.phase2_process,
                  ...recommendationPlan.phase3_optimization
                ];
                const recommendation = allRecommendations.find(rec => rec.id === actionId);
                
                return (
                  <div key={actionId} className="flex items-center gap-3 p-3 bg-muted/50 rounded">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{recommendation?.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {recommendation?.estimatedEffort.time} • {recommendation?.pillar}
                      </div>
                    </div>
                    <Badge variant={getPriorityColor(recommendation?.priority || 'low')}>
                      {recommendation?.priority}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
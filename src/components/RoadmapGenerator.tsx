import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar,
  Target,
  CheckCircle2,
  Clock,
  ArrowRight,
  Download,
  Users,
  DollarSign,
  TrendingUp,
  AlertCircle,
  BarChart3
} from 'lucide-react';
import { AdvancedAnalysisResult, MaturityGap, PriorityItem } from '@/lib/advancedAnalytics';

interface RoadmapGeneratorProps {
  analysisResult: AdvancedAnalysisResult;
  pillarScores: Record<string, number>;
}

interface RoadmapPhase {
  id: string;
  title: string;
  timeframe: string;
  objectives: string[];
  actions: RoadmapAction[];
  kpis: string[];
  budget: string;
  risks: string[];
}

interface RoadmapAction {
  id: string;
  title: string;
  description: string;
  pillar: string;
  effort: 'baixo' | 'médio' | 'alto';
  impact: 'baixo' | 'médio' | 'alto';
  dependencies: string[];
  resources: string[];
  timeline: string;
}

export function RoadmapGenerator({ analysisResult, pillarScores }: RoadmapGeneratorProps) {
  const [selectedPhase, setSelectedPhase] = useState<string>('phase1');
  
  const generateRoadmap = (): RoadmapPhase[] => {
    const { maturityGaps, prioritizationMatrix } = analysisResult;
    
    // Phase 1: Quick Wins (0-90 days)
    const quickWins = prioritizationMatrix
      .filter(item => item.quickWin)
      .slice(0, 8)
      .map(item => createActionFromPriorityItem(item, '2-4 semanas'));

    const phase1: RoadmapPhase = {
      id: 'phase1',
      title: 'Fase 1: Quick Wins e Estabilização',
      timeframe: '0-90 dias',
      objectives: [
        'Estabelecer bases sólidas nos pilares críticos',
        'Implementar melhorias de baixo esforço e alto impacto',
        'Criar momentum organizacional para transformação'
      ],
      actions: quickWins,
      kpis: [
        'Número de processos documentados',
        'Satisfação das equipes envolvidas',
        'Tempo de implementação vs. planejado'
      ],
      budget: 'R$ 50.000 - R$ 150.000',
      risks: [
        'Resistência à mudança',
        'Falta de recursos dedicados',
        'Priorização incorreta de ações'
      ]
    };

    // Phase 2: Structural Improvements (90-180 days)
    const structuralActions = prioritizationMatrix
      .filter(item => !item.quickWin && item.impact >= 3)
      .slice(0, 6)
      .map(item => createActionFromPriorityItem(item, '6-12 semanas'));

    const phase2: RoadmapPhase = {
      id: 'phase2',
      title: 'Fase 2: Melhorias Estruturais',
      timeframe: '90-180 dias',
      objectives: [
        'Implementar processos estruturados nos pilares principais',
        'Criar sistemas de governança e controle',
        'Estabelecer métricas e indicadores de performance'
      ],
      actions: structuralActions,
      kpis: [
        'Aumento da pontuação O-SRL por pilar',
        'Redução de retrabalhos',
        'Melhoria da eficiência operacional'
      ],
      budget: 'R$ 200.000 - R$ 500.000',
      risks: [
        'Complexidade de implementação subestimada',
        'Dependências não identificadas',
        'Mudanças organizacionais necessárias'
      ]
    };

    // Phase 3: Advanced Optimization (180-365 days)
    const optimizationActions = getAdvancedOptimizationActions(maturityGaps);

    const phase3: RoadmapPhase = {
      id: 'phase3',
      title: 'Fase 3: Otimização Avançada',
      timeframe: '180-365 dias',
      objectives: [
        'Alcançar maturidade avançada nos pilares críticos',
        'Implementar automação e inteligência nos processos',
        'Estabelecer cultura de melhoria contínua'
      ],
      actions: optimizationActions,
      kpis: [
        'Nível O-SRL geral >= 4',
        'ROI das iniciativas implementadas',
        'Índice de inovação organizacional'
      ],
      budget: 'R$ 500.000 - R$ 1.500.000',
      risks: [
        'Saturação de mudanças na organização',
        'Necessidade de novas competências',
        'Integração de sistemas complexos'
      ]
    };

    return [phase1, phase2, phase3];
  };

  const createActionFromPriorityItem = (item: PriorityItem, timeline: string): RoadmapAction => {
    return {
      id: `action_${item.pillar}_${item.impact}`,
      title: item.action,
      description: getActionDescription(item),
      pillar: item.pillar,
      effort: item.effort <= 2 ? 'baixo' : item.effort <= 3 ? 'médio' : 'alto',
      impact: item.impact <= 2 ? 'baixo' : item.impact <= 3 ? 'médio' : 'alto',
      dependencies: getActionDependencies(item),
      resources: getActionResources(item),
      timeline
    };
  };

  const getActionDescription = (item: PriorityItem): string => {
    const descriptions: Record<string, string> = {
      'Documentar processos': 'Mapear, documentar e padronizar processos críticos da organização',
      'Criar estrutura': 'Estabelecer estrutura organizacional adequada com papéis e responsabilidades definidos',
      'Implementar metodologia': 'Adotar metodologia estruturada com ferramentas e templates padronizados',
      'Estabelecer métricas': 'Definir e implementar sistema de métricas e indicadores de performance',
      'Desenvolver competências': 'Criar programa de desenvolvimento de competências técnicas e comportamentais'
    };
    
    const key = Object.keys(descriptions).find(k => item.action.toLowerCase().includes(k.toLowerCase()));
    return descriptions[key || ''] || 'Implementar melhoria conforme análise de maturidade organizacional';
  };

  const getActionDependencies = (item: PriorityItem): string[] => {
    const baseDependencies: Record<string, string[]> = {
      'baixo': [],
      'médio': ['Aprovação da liderança', 'Definição de recursos'],
      'alto': ['Aprovação da liderança', 'Definição de recursos', 'Capacitação prévia das equipes']
    };
    
    const effort = item.effort <= 2 ? 'baixo' : item.effort <= 3 ? 'médio' : 'alto';
    return baseDependencies[effort];
  };

  const getActionResources = (item: PriorityItem): string[] => {
    const baseResources: Record<string, string[]> = {
      'baixo': ['Equipe interna', 'Tempo dedicado'],
      'médio': ['Equipe interna', 'Consultoria especializada', 'Ferramentas/Software'],
      'alto': ['Equipe dedicada', 'Consultoria especializada', 'Ferramentas/Software', 'Treinamento especializado']
    };
    
    const effort = item.effort <= 2 ? 'baixo' : item.effort <= 3 ? 'médio' : 'alto';
    return baseResources[effort];
  };

  const getAdvancedOptimizationActions = (gaps: MaturityGap[]): RoadmapAction[] => {
    return [
      {
        id: 'opt_1',
        title: 'Implementar Dashboard Executivo Integrado',
        description: 'Criar dashboard com indicadores em tempo real de todos os pilares de maturidade',
        pillar: 'Governança Estratégica',
        effort: 'alto',
        impact: 'alto',
        dependencies: ['Fase 2 concluída', 'Sistemas integrados'],
        resources: ['Equipe de BI', 'Plataforma de dashboards', 'Integração de sistemas'],
        timeline: '12-16 semanas'
      },
      {
        id: 'opt_2',
        title: 'Automação Inteligente de Processos',
        description: 'Implementar automação baseada em IA para processos de alto volume e baixo valor agregado',
        pillar: 'Entrega de Projetos',
        effort: 'alto',
        impact: 'médio',
        dependencies: ['Processos padronizados', 'Dados estruturados'],
        resources: ['Especialista em automação', 'Plataforma RPA', 'Treinamento de equipes'],
        timeline: '16-24 semanas'
      },
      {
        id: 'opt_3',
        title: 'Centro de Excelência Organizacional',
        description: 'Criar centro para disseminar melhores práticas e fomentar inovação contínua',
        pillar: 'Pessoas e Cultura',
        effort: 'médio',
        impact: 'alto',
        dependencies: ['Cultura de melhoria estabelecida'],
        resources: ['Equipe dedicada', 'Espaço físico/virtual', 'Programa de incentivos'],
        timeline: '8-12 semanas'
      }
    ];
  };

  const roadmap = generateRoadmap();
  
  const getEffortBadgeVariant = (effort: string) => {
    switch (effort) {
      case 'baixo': return 'secondary';
      case 'médio': return 'default';
      case 'alto': return 'destructive';
      default: return 'secondary';
    }
  };

  const getImpactBadgeVariant = (impact: string) => {
    switch (impact) {
      case 'alto': return 'default';
      case 'médio': return 'secondary';
      case 'baixo': return 'outline';
      default: return 'secondary';
    }
  };

  const downloadRoadmap = () => {
    const roadmapContent = generateRoadmapReport(roadmap);
    const blob = new Blob([roadmapContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Roadmap-Maturidade-OSRL-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateRoadmapReport = (phases: RoadmapPhase[]): string => {
    return `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>Roadmap de Maturidade O-SRL</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
          .phase { margin: 30px 0; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
          .phase-header { background: #f5f5f5; padding: 15px; margin: -20px -20px 15px -20px; }
          .action-item { margin: 15px 0; padding: 10px; background: #fafafa; border-left: 4px solid #007acc; }
          .badge { padding: 4px 8px; border-radius: 4px; font-size: 12px; }
          .badge-low { background: #d4edda; color: #155724; }
          .badge-medium { background: #fff3cd; color: #856404; }
          .badge-high { background: #f8d7da; color: #721c24; }
        </style>
      </head>
      <body>
        <h1>Roadmap de Maturidade Organizacional O-SRL</h1>
        <p>Plano estratégico para evolução da maturidade organizacional em 3 fases.</p>
        
        ${phases.map(phase => `
          <div class="phase">
            <div class="phase-header">
              <h2>${phase.title}</h2>
              <p><strong>Prazo:</strong> ${phase.timeframe} | <strong>Orçamento:</strong> ${phase.budget}</p>
            </div>
            
            <h3>Objetivos:</h3>
            <ul>
              ${phase.objectives.map(obj => `<li>${obj}</li>`).join('')}
            </ul>
            
            <h3>Ações Principais:</h3>
            ${phase.actions.map(action => `
              <div class="action-item">
                <h4>${action.title}</h4>
                <p>${action.description}</p>
                <p><strong>Pilar:</strong> ${action.pillar} | <strong>Timeline:</strong> ${action.timeline}</p>
                <p><strong>Recursos:</strong> ${action.resources.join(', ')}</p>
              </div>
            `).join('')}
            
            <h3>KPIs de Sucesso:</h3>
            <ul>
              ${phase.kpis.map(kpi => `<li>${kpi}</li>`).join('')}
            </ul>
            
            <h3>Principais Riscos:</h3>
            <ul>
              ${phase.risks.map(risk => `<li>${risk}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
        
        <footer style="text-align: center; margin-top: 40px; font-size: 12px; color: #666;">
          <p>Roadmap gerado automaticamente pelo Framework O-SRL</p>
        </footer>
      </body>
      </html>
    `;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Roadmap Estratégico de Maturidade
          </CardTitle>
          <Button onClick={downloadRoadmap} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Baixar Roadmap
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedPhase} onValueChange={setSelectedPhase}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="phase1">Fase 1 (0-90d)</TabsTrigger>
            <TabsTrigger value="phase2">Fase 2 (90-180d)</TabsTrigger>
            <TabsTrigger value="phase3">Fase 3 (180-365d)</TabsTrigger>
          </TabsList>
          
          {roadmap.map(phase => (
            <TabsContent key={phase.id} value={phase.id} className="space-y-6">
              
              {/* Phase Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Duração</span>
                  </div>
                  <div className="text-lg font-bold">{phase.timeframe}</div>
                </div>
                
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-success" />
                    <span className="text-sm font-medium">Orçamento</span>
                  </div>
                  <div className="text-lg font-bold">{phase.budget}</div>
                </div>
                
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-warning" />
                    <span className="text-sm font-medium">Ações</span>
                  </div>
                  <div className="text-lg font-bold">{phase.actions.length} ações</div>
                </div>
              </div>

              {/* Objectives */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Objetivos da Fase
                </h4>
                <ul className="space-y-2">
                  {phase.objectives.map((objective, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-success" />
                      <span className="text-sm">{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Ações Detalhadas
                </h4>
                <div className="space-y-4">
                  {phase.actions.map((action, idx) => (
                    <div key={idx} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="font-medium">{action.title}</h5>
                          <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant={getEffortBadgeVariant(action.effort)}>
                            {action.effort}
                          </Badge>
                          <Badge variant={getImpactBadgeVariant(action.impact)}>
                            {action.impact}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Pilar: </span>
                          <span className="text-muted-foreground">{action.pillar}</span>
                        </div>
                        <div>
                          <span className="font-medium">Timeline: </span>
                          <span className="text-muted-foreground">{action.timeline}</span>
                        </div>
                      </div>
                      
                      {action.dependencies.length > 0 && (
                        <div>
                          <span className="text-sm font-medium">Dependências: </span>
                          <span className="text-sm text-muted-foreground">
                            {action.dependencies.join(', ')}
                          </span>
                        </div>
                      )}
                      
                      <div>
                        <span className="text-sm font-medium">Recursos: </span>
                        <span className="text-sm text-muted-foreground">
                          {action.resources.join(', ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* KPIs */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Indicadores de Sucesso
                </h4>
                <ul className="space-y-2">
                  {phase.kpis.map((kpi, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Target className="w-4 h-4 mt-0.5 text-primary" />
                      <span className="text-sm">{kpi}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Risks */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Principais Riscos
                </h4>
                <ul className="space-y-2">
                  {phase.risks.map((risk, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 mt-0.5 text-destructive" />
                      <span className="text-sm">{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
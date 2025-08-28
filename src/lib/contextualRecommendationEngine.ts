import { PILLARS, QUESTIONS, OSRL_LEVELS } from '@/data/osrl-framework';
import { QuestionInsight, DetailedAnalysisResult } from './detailedResponseAnalyzer';

export interface ContextualRecommendation {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: 'foundation' | 'process' | 'optimization' | 'culture';
  pillar: string;
  estimatedEffort: {
    time: string;
    resources: string;
    cost: 'baixo' | 'médio' | 'alto';
  };
  prerequisites: string[];
  dependentActions: string[];
  deliverables: string[];
  successMetrics: string[];
  implementationSteps: ImplementationStep[];
  risks: string[];
  templates: Template[];
  quickWin: boolean;
  impact: {
    short: string[];
    medium: string[];
    long: string[];
  };
}

export interface ImplementationStep {
  step: number;
  title: string;
  description: string;
  duration: string;
  responsible: string;
  deliverables: string[];
  checkpoints: string[];
}

export interface Template {
  name: string;
  type: 'document' | 'process' | 'checklist' | 'tool';
  description: string;
}

export interface RecommendationPlan {
  phase1_foundation: ContextualRecommendation[];
  phase2_process: ContextualRecommendation[];
  phase3_optimization: ContextualRecommendation[];
  criticalPath: string[];
  estimatedTimeline: {
    phase1: string;
    phase2: string;
    phase3: string;
    total: string;
  };
  totalInvestment: {
    low: string;
    high: string;
  };
}

export class ContextualRecommendationEngine {
  
  static generateRecommendationPlan(
    responses: Record<string, number>,
    detailedAnalysis: DetailedAnalysisResult
  ): RecommendationPlan {
    const allRecommendations = this.generateContextualRecommendations(responses, detailedAnalysis);
    
    // Organizar por fases
    const phase1_foundation = allRecommendations.filter(rec => 
      rec.category === 'foundation' && rec.priority === 'critical'
    );
    
    const phase2_process = allRecommendations.filter(rec => 
      rec.category === 'process' && ['critical', 'high'].includes(rec.priority)
    );
    
    const phase3_optimization = allRecommendations.filter(rec => 
      rec.category === 'optimization' || rec.category === 'culture'
    );

    // Calcular caminho crítico
    const criticalPath = this.calculateCriticalPath(allRecommendations, detailedAnalysis);
    
    // Estimar timeline
    const estimatedTimeline = this.estimateTimeline(phase1_foundation, phase2_process, phase3_optimization);
    
    // Estimar investimento
    const totalInvestment = this.estimateInvestment(allRecommendations);

    return {
      phase1_foundation,
      phase2_process,
      phase3_optimization,
      criticalPath,
      estimatedTimeline,
      totalInvestment
    };
  }

  private static generateContextualRecommendations(
    responses: Record<string, number>,
    detailedAnalysis: DetailedAnalysisResult
  ): ContextualRecommendation[] {
    const recommendations: ContextualRecommendation[] = [];

    // Gerar recomendações baseadas em questões críticas
    detailedAnalysis.questionInsights.forEach(insight => {
      if (insight.status === 'critical' || insight.status === 'warning') {
        const recommendation = this.createDetailedRecommendation(insight, responses);
        if (recommendation) {
          recommendations.push(recommendation);
        }
      }
    });

    // Gerar recomendações baseadas em padrões identificados
    detailedAnalysis.responsePatterns.forEach(pattern => {
      const patternRecommendation = this.createPatternRecommendation(pattern, responses);
      if (patternRecommendation) {
        recommendations.push(patternRecommendation);
      }
    });

    // Gerar recomendações para quick wins
    detailedAnalysis.criticalPathAnalysis.quickWins.forEach(quickWin => {
      const quickWinRecommendation = this.createQuickWinRecommendation(quickWin);
      if (quickWinRecommendation) {
        recommendations.push(quickWinRecommendation);
      }
    });

    return recommendations.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  private static createDetailedRecommendation(
    insight: QuestionInsight,
    responses: Record<string, number>
  ): ContextualRecommendation | null {
    
    const question = QUESTIONS.find(q => q.id === insight.questionId);
    if (!question) return null;

    const pillar = PILLARS.find(p => p.id === insight.pillarId);
    if (!pillar) return null;

    // Base recommendation template
    const baseRecommendation = {
      id: `rec_${insight.questionId}`,
      pillar: insight.pillarId,
      priority: insight.status === 'critical' ? 'critical' as const : 'high' as const,
      quickWin: insight.urgency === 'medium' && insight.impact === 'high',
      risks: this.getImplementationRisks(insight.questionId),
    };

    // Specific recommendations based on question
    switch (insight.questionId) {
      case 'gov1': // Decisões estratégicas
        return {
          ...baseRecommendation,
          title: 'Implementar Processo de Governança Estratégica',
          description: 'Estabelecer um processo estruturado e documentado para tomada de decisões estratégicas sobre investimentos e prioridades.',
          category: 'foundation',
          estimatedEffort: {
            time: '8-12 semanas',
            resources: '1 Executivo C-level, 2-3 Gestores Seniores, 1 Analista',
            cost: 'médio'
          },
          prerequisites: [],
          dependentActions: ['rec_gov2', 'rec_delivery2'],
          deliverables: [
            'Processo documentado de governança',
            'Critérios de priorização definidos',
            'Comitê de governança estabelecido',
            'Templates de avaliação de investimento'
          ],
          successMetrics: [
            'Tempo médio para decisões estratégicas < 30 dias',
            '90% das decisões seguem processo definido',
            'Score de alinhamento estratégico > 4.0'
          ],
          implementationSteps: [
            {
              step: 1,
              title: 'Definir Estrutura de Governança',
              description: 'Estabelecer comitê, papéis e responsabilidades',
              duration: '2 semanas',
              responsible: 'CEO/Diretoria',
              deliverables: ['Charter do comitê', 'Definição de papéis'],
              checkpoints: ['Aprovação da diretoria', 'Comunicação à organização']
            },
            {
              step: 2,
              title: 'Desenvolver Processo de Decisão',
              description: 'Criar fluxo, critérios e documentação',
              duration: '3 semanas',
              responsible: 'PMO/Strategy Office',
              deliverables: ['Processo documentado', 'Critérios de avaliação'],
              checkpoints: ['Revisão stakeholders', 'Teste piloto']
            },
            {
              step: 3,
              title: 'Implementar e Treinar',
              description: 'Capacitar equipes e iniciar operação',
              duration: '3 semanas',
              responsible: 'PMO/RH',
              deliverables: ['Treinamentos realizados', 'Sistema operacional'],
              checkpoints: ['Primeira reunião oficial', 'Feedback inicial']
            }
          ],
          templates: [
            {
              name: 'Template de Business Case',
              type: 'document',
              description: 'Estrutura padrão para avaliação de investimentos'
            },
            {
              name: 'Matriz de Priorização',
              type: 'tool',
              description: 'Ferramenta para ranquear iniciativas'
            }
          ],
          impact: {
            short: ['Decisões mais rápidas', 'Critérios claros'],
            medium: ['Melhor alocação de recursos', 'Redução de conflitos'],
            long: ['ROI otimizado', 'Cultura de governança']
          }
        };

      case 'delivery1': // Metodologia de projetos
        return {
          ...baseRecommendation,
          title: 'Implementar Metodologia Padronizada de Gestão de Projetos',
          description: 'Estabelecer e implementar uma metodologia consistente para gestão de projetos em toda a organização.',
          category: 'foundation',
          estimatedEffort: {
            time: '12-16 semanas',
            resources: '1 PMO Manager, 2-3 Project Managers, 1 Trainer',
            cost: 'médio'
          },
          prerequisites: [],
          dependentActions: ['rec_delivery2', 'rec_delivery3'],
          deliverables: [
            'Metodologia documentada',
            'Templates e ferramentas padronizados',
            'Programa de treinamento',
            'Sistema de gestão de projetos'
          ],
          successMetrics: [
            '85% dos projetos seguem metodologia',
            'Redução de 30% em atrasos de projetos',
            'Score de satisfação > 4.0'
          ],
          implementationSteps: [
            {
              step: 1,
              title: 'Selecionar Metodologia',
              description: 'Avaliar e escolher framework (PMBOK, Ágil, híbrido)',
              duration: '3 semanas',
              responsible: 'PMO Manager',
              deliverables: ['Análise de metodologias', 'Recomendação'],
              checkpoints: ['Aprovação da diretoria']
            },
            {
              step: 2,
              title: 'Customizar e Documentar',
              description: 'Adaptar metodologia ao contexto organizacional',
              duration: '4 semanas',
              responsible: 'PMO Team',
              deliverables: ['Documentação completa', 'Templates'],
              checkpoints: ['Revisão com stakeholders']
            },
            {
              step: 3,
              title: 'Implementar Sistema',
              description: 'Configurar ferramentas e sistemas de apoio',
              duration: '3 semanas',
              responsible: 'TI + PMO',
              deliverables: ['Sistema configurado', 'Integrações'],
              checkpoints: ['Teste de aceitação']
            },
            {
              step: 4,
              title: 'Treinar e Lançar',
              description: 'Capacitar equipes e iniciar rollout',
              duration: '6 semanas',
              responsible: 'PMO + RH',
              deliverables: ['Programa de treinamento', 'Projetos piloto'],
              checkpoints: ['Avaliação piloto', 'Go-live']
            }
          ],
          templates: [
            {
              name: 'Project Charter Template',
              type: 'document',
              description: 'Template padrão para iniciar projetos'
            },
            {
              name: 'WBS Template',
              type: 'document',
              description: 'Estrutura analítica de projetos'
            },
            {
              name: 'Risk Register Template',
              type: 'document',
              description: 'Registro de riscos padronizado'
            }
          ],
          impact: {
            short: ['Padronização de processos', 'Clareza de papéis'],
            medium: ['Melhoria na entrega', 'Redução de riscos'],
            long: ['Maturidade organizacional', 'Previsibilidade']
          }
        };

      case 'benefits1': // Definição de benefícios
        return {
          ...baseRecommendation,
          title: 'Implementar Gestão Estruturada de Benefícios',
          description: 'Estabelecer processo para definição, mensuração e realização de benefícios em projetos e programas.',
          category: 'process',
          estimatedEffort: {
            time: '10-14 semanas',
            resources: '1 Benefits Manager, 2 Analistas, 1 Controller',
            cost: 'médio'
          },
          prerequisites: ['rec_gov1'],
          dependentActions: ['rec_benefits2', 'rec_benefits3'],
          deliverables: [
            'Framework de benefícios',
            'Templates de business case',
            'Processo de tracking',
            'Dashboard de benefícios'
          ],
          successMetrics: [
            '100% projetos com benefícios definidos',
            '80% realização de benefícios planejados',
            'ROI médio > target organizacional'
          ],
          implementationSteps: [
            {
              step: 1,
              title: 'Desenvolver Framework',
              description: 'Criar categorias e métricas de benefícios',
              duration: '4 semanas',
              responsible: 'Benefits Manager',
              deliverables: ['Framework documentado', 'Taxonomia'],
              checkpoints: ['Validação com stakeholders']
            },
            {
              step: 2,
              title: 'Criar Templates e Processos',
              description: 'Desenvolver ferramentas de trabalho',
              duration: '3 semanas',
              responsible: 'PMO + Finance',
              deliverables: ['Templates', 'Processo documentado'],
              checkpoints: ['Teste com projeto piloto']
            },
            {
              step: 3,
              title: 'Implementar Tracking',
              description: 'Estabelecer sistema de acompanhamento',
              duration: '4 semanas',
              responsible: 'TI + Finance',
              deliverables: ['Dashboard', 'Relatórios'],
              checkpoints: ['Teste de aceitação']
            },
            {
              step: 4,
              title: 'Rollout e Treinamento',
              description: 'Implementar em toda organização',
              duration: '3 semanas',
              responsible: 'PMO + RH',
              deliverables: ['Treinamentos', 'Comunicação'],
              checkpoints: ['Primeira medição']
            }
          ],
          templates: [
            {
              name: 'Benefits Realization Plan',
              type: 'document',
              description: 'Plano de realização de benefícios'
            },
            {
              name: 'Benefits Measurement Framework',
              type: 'tool',
              description: 'Framework para mensuração'
            }
          ],
          impact: {
            short: ['Clareza de objetivos', 'Justificativa melhor'],
            medium: ['ROI melhorado', 'Decisões baseadas em valor'],
            long: ['Cultura orientada a resultados', 'Otimização contínua']
          }
        };

      // Adicionar mais casos conforme necessário...
      default:
        return {
          ...baseRecommendation,
          title: `Melhorar ${question.text}`,
          description: `Desenvolver capacidades relacionadas a: ${question.text}`,
          category: 'process',
          estimatedEffort: {
            time: '4-8 semanas',
            resources: 'A definir baseado na complexidade',
            cost: 'médio'
          },
          prerequisites: [],
          dependentActions: [],
          deliverables: insight.specificRecommendations,
          successMetrics: [`Melhoria na avaliação desta questão para > 3.5`],
          implementationSteps: [
            {
              step: 1,
              title: 'Análise Detalhada',
              description: 'Entender lacunas específicas',
              duration: '1 semana',
              responsible: 'Responsável da área',
              deliverables: ['Diagnóstico detalhado'],
              checkpoints: ['Validação com stakeholders']
            },
            {
              step: 2,
              title: 'Plano de Ação',
              description: 'Desenvolver estratégia específica',
              duration: '2 semanas',
              responsible: 'Responsável da área',
              deliverables: ['Plano detalhado'],
              checkpoints: ['Aprovação de recursos']
            },
            {
              step: 3,
              title: 'Implementação',
              description: 'Executar melhorias planejadas',
              duration: '4-5 semanas',
              responsible: 'Equipe da área',
              deliverables: ['Melhorias implementadas'],
              checkpoints: ['Avaliação de progresso']
            }
          ],
          templates: [],
          impact: {
            short: ['Processo melhorado'],
            medium: ['Capacidade ampliada'],
            long: ['Maturidade aumentada']
          }
        };
    }
  }

  private static createPatternRecommendation(
    pattern: any,
    responses: Record<string, number>
  ): ContextualRecommendation | null {
    return {
      id: `pattern_${pattern.type}_${Date.now()}`,
      title: pattern.title,
      description: pattern.description,
      priority: pattern.severity === 'high' ? 'critical' : 'high',
      category: 'process',
      pillar: 'cross-functional',
      estimatedEffort: {
        time: '6-10 semanas',
        resources: 'Equipe multifuncional',
        cost: 'alto'
      },
      prerequisites: [],
      dependentActions: [],
      deliverables: pattern.recommendations,
      successMetrics: ['Resolução do padrão identificado'],
      implementationSteps: [
        {
          step: 1,
          title: 'Análise do Padrão',
          description: 'Entender causas raiz do padrão',
          duration: '2 semanas',
          responsible: 'PMO',
          deliverables: ['Análise de causa raiz'],
          checkpoints: ['Validação com áreas afetadas']
        },
        {
          step: 2,
          title: 'Estratégia Integrada',
          description: 'Desenvolver abordagem coordenada',
          duration: '2 semanas',
          responsible: 'Liderança',
          deliverables: ['Estratégia coordenada'],
          checkpoints: ['Alinhamento de recursos']
        },
        {
          step: 3,
          title: 'Execução Coordenada',
          description: 'Implementar melhorias sincronizadas',
          duration: '4-6 semanas',
          responsible: 'Equipes das áreas',
          deliverables: ['Melhorias implementadas'],
          checkpoints: ['Progresso coordenado']
        }
      ],
      templates: [],
      quickWin: false,
      risks: ['Complexidade de coordenação', 'Resistência à mudança'],
      impact: {
        short: ['Resolução de inconsistências'],
        medium: ['Sinergia entre áreas'],
        long: ['Maturidade sistêmica']
      }
    };
  }

  private static createQuickWinRecommendation(insight: QuestionInsight): ContextualRecommendation | null {
    return {
      id: `quickwin_${insight.questionId}`,
      title: `Quick Win: ${insight.question}`,
      description: `Oportunidade de melhoria rápida com alto impacto.`,
      priority: 'medium',
      category: 'process',
      pillar: insight.pillarId,
      estimatedEffort: {
        time: '2-4 semanas',
        resources: 'Recursos mínimos',
        cost: 'baixo'
      },
      prerequisites: [],
      dependentActions: [],
      deliverables: insight.specificRecommendations.slice(0, 2),
      successMetrics: [`Melhoria na questão ${insight.questionId}`],
      implementationSteps: [
        {
          step: 1,
          title: 'Implementação Rápida',
          description: 'Executar melhoria com recursos existentes',
          duration: '2-4 semanas',
          responsible: 'Responsável da área',
          deliverables: ['Melhoria implementada'],
          checkpoints: ['Resultado medido']
        }
      ],
      templates: [],
      quickWin: true,
      risks: ['Falta de sustentabilidade'],
      impact: {
        short: ['Melhoria imediata'],
        medium: ['Momentum positivo'],
        long: ['Base para melhorias maiores']
      }
    };
  }

  private static calculateCriticalPath(
    recommendations: ContextualRecommendation[],
    detailedAnalysis: DetailedAnalysisResult
  ): string[] {
    // Identificar sequência crítica baseada em dependências
    const criticalRecommendations = recommendations.filter(rec => rec.priority === 'critical');
    
    // Ordenar por dependências
    const orderedRecommendations = this.topologicalSort(criticalRecommendations);
    
    return orderedRecommendations.map(rec => rec.id);
  }

  private static topologicalSort(recommendations: ContextualRecommendation[]): ContextualRecommendation[] {
    // Implementação simplificada - ordenar por categoria e prioridade
    return recommendations.sort((a, b) => {
      const categoryOrder = { foundation: 1, process: 2, optimization: 3, culture: 4 };
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      
      if (categoryOrder[a.category] !== categoryOrder[b.category]) {
        return categoryOrder[a.category] - categoryOrder[b.category];
      }
      
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  private static estimateTimeline(
    phase1: ContextualRecommendation[],
    phase2: ContextualRecommendation[],
    phase3: ContextualRecommendation[]
  ) {
    // Estimativa baseada no número e complexidade das recomendações
    const phase1Time = Math.max(12, phase1.length * 8); // mínimo 12 semanas
    const phase2Time = Math.max(16, phase2.length * 6); // mínimo 16 semanas
    const phase3Time = Math.max(20, phase3.length * 4); // mínimo 20 semanas
    
    return {
      phase1: `${phase1Time} semanas`,
      phase2: `${phase2Time} semanas`,
      phase3: `${phase3Time} semanas`,
      total: `${phase1Time + phase2Time + phase3Time} semanas (${Math.ceil((phase1Time + phase2Time + phase3Time) / 4)} meses)`
    };
  }

  private static estimateInvestment(recommendations: ContextualRecommendation[]) {
    const costMapping = { baixo: 50000, médio: 150000, alto: 300000 };
    
    let lowEstimate = 0;
    let highEstimate = 0;
    
    recommendations.forEach(rec => {
      const baseCost = costMapping[rec.estimatedEffort.cost];
      lowEstimate += baseCost * 0.7;
      highEstimate += baseCost * 1.3;
    });
    
    return {
      low: `R$ ${(lowEstimate / 1000).toFixed(0)}k`,
      high: `R$ ${(highEstimate / 1000).toFixed(0)}k`
    };
  }

  private static getImplementationRisks(questionId: string): string[] {
    const riskMapping: Record<string, string[]> = {
      'gov1': ['Resistência da liderança', 'Mudança cultural necessária'],
      'delivery1': ['Resistência das equipes', 'Curva de aprendizado'],
      'benefits1': ['Falta de dados históricos', 'Definição de métricas'],
      'financial1': ['Integração com sistemas existentes', 'Mudança de processos'],
      'risk1': ['Identificação incompleta', 'Falta de expertise'],
      'stakeholders1': ['Stakeholders não cooperativos', 'Expectativas conflitantes'],
      'people1': ['Rotatividade de pessoal', 'Investimento em treinamento']
    };
    
    return riskMapping[questionId] || ['Resistência à mudança', 'Recursos insuficientes'];
  }
}
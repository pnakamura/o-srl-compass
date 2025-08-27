import { PILLARS, QUESTIONS, OSRL_LEVELS } from '@/data/osrl-framework';

export interface AdvancedAnalysisResult {
  interdependencyMatrix: Record<string, Record<string, number>>;
  riskFactors: RiskFactor[];
  predictiveInsights: PredictiveInsight[];
  benchmarkData: BenchmarkData;
  maturityGaps: MaturityGap[];
  prioritizationMatrix: PriorityItem[];
}

export interface RiskFactor {
  type: 'critical' | 'warning' | 'moderate';
  pillar: string;
  title: string;
  description: string;
  impact: number;
  recommendations: string[];
}

export interface PredictiveInsight {
  type: 'trend' | 'opportunity' | 'threat';
  title: string;
  description: string;
  confidence: number;
  timeframe: string;
  actions: string[];
}

export interface BenchmarkData {
  overallPercentile: number;
  pillarPercentiles: Record<string, number>;
  industryAverage: Record<string, number>;
  topPerformers: Record<string, number>;
}

export interface MaturityGap {
  pillar: string;
  currentLevel: number;
  targetLevel: number;
  effort: 'baixo' | 'médio' | 'alto';
  impact: 'baixo' | 'médio' | 'alto';
  priority: number;
  actions: string[];
}

export interface PriorityItem {
  pillar: string;
  action: string;
  impact: number;
  effort: number;
  priority: number;
  quickWin: boolean;
}

export class AdvancedAnalytics {
  
  static calculateInterdependencies(responses: Record<string, number>): Record<string, Record<string, number>> {
    const matrix: Record<string, Record<string, number>> = {};
    
    PILLARS.forEach(pillarA => {
      matrix[pillarA.id] = {};
      
      PILLARS.forEach(pillarB => {
        if (pillarA.id === pillarB.id) {
          matrix[pillarA.id][pillarB.id] = 1;
        } else {
          // Calcular correlação baseada nas respostas
          const correlation = this.calculateCorrelation(pillarA.id, pillarB.id, responses);
          matrix[pillarA.id][pillarB.id] = correlation;
        }
      });
    });
    
    return matrix;
  }

  private static calculateCorrelation(pillarA: string, pillarB: string, responses: Record<string, number>): number {
    const questionsA = QUESTIONS.filter(q => q.pillarId === pillarA);
    const questionsB = QUESTIONS.filter(q => q.pillarId === pillarB);
    
    const responsesA = questionsA.map(q => responses[q.id]).filter(r => r !== undefined);
    const responsesB = questionsB.map(q => responses[q.id]).filter(r => r !== undefined);
    
    if (responsesA.length === 0 || responsesB.length === 0) return 0;
    
    const avgA = responsesA.reduce((sum, r) => sum + r, 0) / responsesA.length;
    const avgB = responsesB.reduce((sum, r) => sum + r, 0) / responsesB.length;
    
    // Correlação simplificada baseada na diferença das médias
    const difference = Math.abs(avgA - avgB);
    return Math.max(0, 1 - (difference / 4)); // Normalizado para 0-1
  }

  static identifyRiskFactors(responses: Record<string, number>, pillarScores: Record<string, number>): RiskFactor[] {
    const risks: RiskFactor[] = [];
    
    PILLARS.forEach(pillar => {
      const score = pillarScores[pillar.id] || 0;
      const pillarQuestions = QUESTIONS.filter(q => q.pillarId === pillar.id);
      const lowResponses = pillarQuestions.filter(q => responses[q.id] && responses[q.id] <= 2);
      
      if (score < 40) {
        risks.push({
          type: 'critical',
          pillar: pillar.name,
          title: `Deficiência Crítica em ${pillar.name}`,
          description: `Pontuação muito baixa (${score}%) indica riscos significativos à capacidade organizacional.`,
          impact: 0.9,
          recommendations: this.getCriticalRecommendations(pillar.id, lowResponses)
        });
      } else if (score < 60) {
        risks.push({
          type: 'warning',
          pillar: pillar.name,
          title: `Oportunidade de Melhoria em ${pillar.name}`,
          description: `Pontuação média (${score}%) sugere necessidade de atenção para evitar gargalos futuros.`,
          impact: 0.6,
          recommendations: this.getImprovementRecommendations(pillar.id)
        });
      }
    });
    
    return risks.sort((a, b) => b.impact - a.impact);
  }

  private static getCriticalRecommendations(pillarId: string, lowResponses: any[]): string[] {
    const recommendations: Record<string, string[]> = {
      governance: [
        "Implementar comitê executivo para decisões estratégicas",
        "Criar processo formal de governança com papéis definidos",
        "Estabelecer métricas de acompanhamento estratégico"
      ],
      delivery: [
        "Adotar metodologia de gestão de projetos padrão",
        "Criar escritório de projetos (PMO) básico",
        "Implementar ferramentas de controle e monitoramento"
      ],
      benefits: [
        "Desenvolver processo de identificação de benefícios",
        "Criar métricas de ROI e acompanhamento de valor",
        "Estabelecer responsabilidades pela realização de benefícios"
      ],
      financial: [
        "Implementar controles orçamentários rigorosos",
        "Criar processo de aprovação de investimentos",
        "Estabelecer métricas financeiras de acompanhamento"
      ],
      risk: [
        "Desenvolver registro de riscos corporativo",
        "Criar processo de identificação e mitigação",
        "Implementar planos de continuidade de negócio"
      ],
      stakeholders: [
        "Mapear partes interessadas críticas",
        "Criar plano de comunicação estruturado",
        "Estabelecer canais regulares de feedback"
      ],
      people: [
        "Desenvolver programa de capacitação",
        "Criar planos de desenvolvimento individual",
        "Implementar processos de gestão de conhecimento"
      ]
    };
    
    return recommendations[pillarId] || ["Buscar consultoria especializada para este pilar"];
  }

  private static getImprovementRecommendations(pillarId: string): string[] {
    const recommendations: Record<string, string[]> = {
      governance: [
        "Otimizar processos de tomada de decisão",
        "Implementar dashboard de indicadores estratégicos",
        "Criar ciclos regulares de revisão estratégica"
      ],
      delivery: [
        "Expandir capacidades de gestão de portfólio",
        "Implementar metodologias ágeis híbridas",
        "Otimizar alocação de recursos entre projetos"
      ],
      benefits: [
        "Automatizar monitoramento de benefícios",
        "Criar benchmarks externos de valor",
        "Implementar análise preditiva de ROI"
      ],
      financial: [
        "Implementar análise de cenários financeiros",
        "Otimizar processo de alocação de orçamento",
        "Criar métricas avançadas de performance financeira"
      ],
      risk: [
        "Implementar análise quantitativa de riscos",
        "Criar simulações de cenários adversos",
        "Automatizar monitoramento de riscos"
      ],
      stakeholders: [
        "Implementar pesquisas regulares de satisfação",
        "Criar comunidades de prática",
        "Otimizar canais de comunicação digital"
      ],
      people: [
        "Implementar programa de mentoria",
        "Criar trilhas de carreira estruturadas",
        "Desenvolver cultura de inovação"
      ]
    };
    
    return recommendations[pillarId] || ["Buscar benchmarks de mercado para este pilar"];
  }

  static generatePredictiveInsights(responses: Record<string, number>, pillarScores: Record<string, number>): PredictiveInsight[] {
    const insights: PredictiveInsight[] = [];
    
    // Análise de tendências baseada nas pontuações
    const averageScore = Object.values(pillarScores).reduce((sum, score) => sum + score, 0) / Object.keys(pillarScores).length;
    
    if (averageScore > 75) {
      insights.push({
        type: 'opportunity',
        title: 'Pronto para Transformação Digital Avançada',
        description: 'Sua organização possui maturidade suficiente para liderar iniciativas de inovação disruptiva.',
        confidence: 0.85,
        timeframe: '6-12 meses',
        actions: [
          'Explorar tecnologias emergentes como IA e automação',
          'Criar centro de inovação interno',
          'Estabelecer parcerias com startups e universidades'
        ]
      });
    } else if (averageScore < 40) {
      insights.push({
        type: 'threat',
        title: 'Risco de Obsolescência Organizacional',
        description: 'Baixa maturidade pode comprometer competitividade em mercados dinâmicos.',
        confidence: 0.75,
        timeframe: '3-6 meses',
        actions: [
          'Priorizar modernização de processos críticos',
          'Investir em capacitação da liderança',
          'Buscar mentoria de organizações maduras'
        ]
      });
    }
    
    // Análise específica por pilar
    Object.entries(pillarScores).forEach(([pillarId, score]) => {
      const pillar = PILLARS.find(p => p.id === pillarId);
      
      if (score > 80) {
        insights.push({
          type: 'opportunity',
          title: `${pillar?.name} como Vantagem Competitiva`,
          description: `Excelência neste pilar pode ser alavancada para diferenciação no mercado.`,
          confidence: 0.8,
          timeframe: '3-6 meses',
          actions: [
            'Documentar melhores práticas para replicação',
            'Criar casos de sucesso para marketing',
            'Desenvolver produtos/serviços baseados nesta competência'
          ]
        });
      }
    });
    
    return insights;
  }

  static createMaturityGapAnalysis(pillarScores: Record<string, number>): MaturityGap[] {
    const gaps: MaturityGap[] = [];
    
    PILLARS.forEach(pillar => {
      const currentScore = pillarScores[pillar.id] || 0;
      const currentLevel = Math.ceil(currentScore / 20); // Converte score para nível 1-5
      const targetLevel = Math.min(5, currentLevel + 1);
      
      if (currentLevel < 5) {
        const effort = currentScore < 40 ? 'alto' : currentScore < 70 ? 'médio' : 'baixo';
        const impact = this.calculatePillarImpact(pillar.id);
        
        gaps.push({
          pillar: pillar.name,
          currentLevel,
          targetLevel,
          effort: effort as 'baixo' | 'médio' | 'alto',
          impact: impact as 'baixo' | 'médio' | 'alto',
          priority: this.calculatePriority(effort, impact),
          actions: this.getMaturityActions(pillar.id, currentLevel, targetLevel)
        });
      }
    });
    
    return gaps.sort((a, b) => b.priority - a.priority);
  }

  private static calculatePillarImpact(pillarId: string): string {
    // Impacto baseado na importância estratégica do pilar
    const impactMap: Record<string, string> = {
      governance: 'alto',
      delivery: 'alto',
      benefits: 'médio',
      financial: 'alto',
      risk: 'médio',
      stakeholders: 'médio',
      people: 'alto'
    };
    
    return impactMap[pillarId] || 'médio';
  }

  private static calculatePriority(effort: string, impact: string): number {
    const effortWeight = { baixo: 3, médio: 2, alto: 1 };
    const impactWeight = { baixo: 1, médio: 2, alto: 3 };
    
    return effortWeight[effort as keyof typeof effortWeight] + impactWeight[impact as keyof typeof impactWeight];
  }

  private static getMaturityActions(pillarId: string, currentLevel: number, targetLevel: number): string[] {
    const actionMap: Record<string, Record<number, string[]>> = {
      governance: {
        2: ['Documentar processos de tomada de decisão', 'Criar estrutura básica de governança'],
        3: ['Implementar comitês executivos', 'Estabelecer métricas de governança'],
        4: ['Otimizar processos de governança', 'Implementar governança digital'],
        5: ['Criar governança adaptativa', 'Implementar IA para tomada de decisão']
      },
      delivery: {
        2: ['Padronizar metodologia de projetos', 'Criar templates básicos'],
        3: ['Implementar PMO', 'Desenvolver gestão de portfólio'],
        4: ['Otimizar entrega ágil', 'Implementar métricas avançadas'],
        5: ['Criar delivery inteligente', 'Implementar automação completa']
      }
    };
    
    return actionMap[pillarId]?.[targetLevel] || ['Buscar melhores práticas do mercado'];
  }

  static createPrioritizationMatrix(pillarScores: Record<string, number>, responses: Record<string, number>): PriorityItem[] {
    const items: PriorityItem[] = [];
    
    PILLARS.forEach(pillar => {
      const score = pillarScores[pillar.id] || 0;
      const actions = this.getActionsByScore(pillar.id, score);
      
      actions.forEach(action => {
        const impact = this.calculateActionImpact(pillar.id, action, score);
        const effort = this.calculateActionEffort(action, score);
        const priority = (impact * 2) + (5 - effort); // Fórmula de priorização
        
        items.push({
          pillar: pillar.name,
          action,
          impact,
          effort,
          priority,
          quickWin: impact >= 3 && effort <= 2
        });
      });
    });
    
    return items.sort((a, b) => b.priority - a.priority).slice(0, 20); // Top 20 ações
  }

  private static getActionsByScore(pillarId: string, score: number): string[] {
    if (score < 40) {
      return this.getCriticalRecommendations(pillarId, []);
    } else if (score < 70) {
      return this.getImprovementRecommendations(pillarId);
    } else {
      return [
        'Documentar melhores práticas',
        'Criar programa de mentoria',
        'Implementar inovações incrementais'
      ];
    }
  }

  private static calculateActionImpact(pillarId: string, action: string, score: number): number {
    // Impacto maior para pilares com score baixo
    const baseImpact = score < 40 ? 4 : score < 70 ? 3 : 2;
    
    // Ajustar baseado no tipo de ação
    if (action.includes('implementar') || action.includes('criar')) {
      return Math.min(5, baseImpact + 1);
    }
    
    return baseImpact;
  }

  private static calculateActionEffort(action: string, score: number): number {
    // Esforço baseado na complexidade da ação
    if (action.includes('documentar') || action.includes('mapear')) {
      return 1;
    } else if (action.includes('criar') || action.includes('estabelecer')) {
      return score < 40 ? 3 : 2;
    } else if (action.includes('implementar') || action.includes('desenvolver')) {
      return score < 40 ? 4 : 3;
    } else if (action.includes('otimizar') || action.includes('automatizar')) {
      return 4;
    }
    
    return 3;
  }

  static generateBenchmarkData(pillarScores: Record<string, number>): BenchmarkData {
    // Simulação de dados de benchmark (em um cenário real, viria de banco de dados)
    const industryAverages: Record<string, number> = {
      governance: 65,
      delivery: 58,
      benefits: 52,
      financial: 68,
      risk: 55,
      stakeholders: 60,
      people: 63
    };
    
    const topPerformers: Record<string, number> = {
      governance: 85,
      delivery: 82,
      benefits: 78,
      financial: 88,
      risk: 80,
      stakeholders: 84,
      people: 86
    };
    
    const overallScore = Object.values(pillarScores).reduce((sum, score) => sum + score, 0) / Object.keys(pillarScores).length;
    const industryOverall = Object.values(industryAverages).reduce((sum, score) => sum + score, 0) / Object.keys(industryAverages).length;
    
    const pillarPercentiles: Record<string, number> = {};
    Object.entries(pillarScores).forEach(([pillarId, score]) => {
      const industryAvg = industryAverages[pillarId];
      pillarPercentiles[pillarId] = Math.min(100, Math.max(0, 
        50 + ((score - industryAvg) / industryAvg) * 30
      ));
    });
    
    return {
      overallPercentile: Math.min(100, Math.max(0, 
        50 + ((overallScore - industryOverall) / industryOverall) * 30
      )),
      pillarPercentiles,
      industryAverage: industryAverages,
      topPerformers
    };
  }

  static performAdvancedAnalysis(
    responses: Record<string, number>,
    pillarScores: Record<string, number>
  ): AdvancedAnalysisResult {
    return {
      interdependencyMatrix: this.calculateInterdependencies(responses),
      riskFactors: this.identifyRiskFactors(responses, pillarScores),
      predictiveInsights: this.generatePredictiveInsights(responses, pillarScores),
      benchmarkData: this.generateBenchmarkData(pillarScores),
      maturityGaps: this.createMaturityGapAnalysis(pillarScores),
      prioritizationMatrix: this.createPrioritizationMatrix(pillarScores, responses)
    };
  }
}
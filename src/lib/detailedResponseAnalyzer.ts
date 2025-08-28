import { PILLARS, QUESTIONS, OSRL_LEVELS } from '@/data/osrl-framework';

export interface QuestionInsight {
  questionId: string;
  pillarId: string;
  question: string;
  response: number;
  responseLabel: string;
  status: 'critical' | 'warning' | 'good' | 'excellent';
  specificIssues: string[];
  specificRecommendations: string[];
  dependsOn: string[];
  affects: string[];
  urgency: 'high' | 'medium' | 'low';
  impact: 'high' | 'medium' | 'low';
}

export interface ResponsePattern {
  type: 'inconsistency' | 'bottleneck' | 'enabler' | 'cascade_risk';
  title: string;
  description: string;
  questions: string[];
  severity: 'high' | 'medium' | 'low';
  recommendations: string[];
}

export interface DetailedAnalysisResult {
  questionInsights: QuestionInsight[];
  responsePatterns: ResponsePattern[];
  criticalPathAnalysis: {
    blockers: QuestionInsight[];
    enablers: QuestionInsight[];
    quickWins: QuestionInsight[];
  };
  pillarDependencies: Record<string, {
    dependsOnPillars: string[];
    affectsPillars: string[];
    score: number;
    criticalQuestions: string[];
  }>;
  organizationalReadiness: {
    foundationLevel: number;
    executionLevel: number;
    optimizationLevel: number;
    missingFoundations: string[];
    prematureAdvanced: string[];
  };
}

export class DetailedResponseAnalyzer {
  
  static analyzeResponses(responses: Record<string, number>): DetailedAnalysisResult {
    const questionInsights = this.analyzeIndividualQuestions(responses);
    const responsePatterns = this.identifyPatterns(responses, questionInsights);
    const criticalPathAnalysis = this.analyzeCriticalPath(questionInsights);
    const pillarDependencies = this.analyzePillarDependencies(responses, questionInsights);
    const organizationalReadiness = this.assessOrganizationalReadiness(responses, questionInsights);

    return {
      questionInsights,
      responsePatterns,
      criticalPathAnalysis,
      pillarDependencies,
      organizationalReadiness
    };
  }

  private static analyzeIndividualQuestions(responses: Record<string, number>): QuestionInsight[] {
    return QUESTIONS.map(question => {
      const response = responses[question.id] || 1;
      const responseOption = question.options.find(opt => opt.value === response);
      
      const insight: QuestionInsight = {
        questionId: question.id,
        pillarId: question.pillarId,
        question: question.text,
        response,
        responseLabel: responseOption?.label || '',
        status: this.getQuestionStatus(response),
        specificIssues: this.getSpecificIssues(question, response),
        specificRecommendations: this.getSpecificRecommendations(question, response),
        dependsOn: this.getQuestionDependencies(question.id),
        affects: this.getQuestionImpacts(question.id),
        urgency: this.getUrgency(question, response),
        impact: this.getImpact(question, response)
      };

      return insight;
    });
  }

  private static getQuestionStatus(response: number): 'critical' | 'warning' | 'good' | 'excellent' {
    if (response <= 1.5) return 'critical';
    if (response <= 2.5) return 'warning';
    if (response <= 3.5) return 'good';
    return 'excellent';
  }

  private static getSpecificIssues(question: any, response: number): string[] {
    const issues: string[] = [];
    
    // Análise específica baseada na questão e resposta
    if (response <= 2) {
      switch (question.id) {
        case 'gov1': // Decisões estratégicas
          issues.push('Falta de processo estruturado para decisões estratégicas pode levar a investimentos inadequados');
          issues.push('Ausência de critérios claros pode gerar conflitos e atrasos');
          break;
        case 'gov2': // Alinhamento estratégia-operação
          issues.push('Desconexão entre estratégia e execução resulta em desperdício de recursos');
          issues.push('Equipes operacionais podem trabalhar em direções conflitantes');
          break;
        case 'delivery1': // Metodologia de projetos
          issues.push('Falta de metodologia padronizada aumenta risco de falhas');
          issues.push('Dificuldade em comparar e otimizar performance entre projetos');
          break;
        case 'delivery2': // Gestão de portfólio
          issues.push('Ausência de visão integrada do portfólio impede priorização eficaz');
          issues.push('Recursos podem ser mal distribuídos entre iniciativas');
          break;
        case 'benefits1': // Definição de benefícios
          issues.push('Sem definição clara de benefícios, projetos podem não gerar valor esperado');
          issues.push('Dificuldade em justificar investimentos e medir sucesso');
          break;
        case 'financial1': // Orçamentação e controle
          issues.push('Controles financeiros inadequados podem levar a estouros de orçamento');
          issues.push('Falta de visibilidade financeira impede tomada de decisão adequada');
          break;
        case 'risk1': // Identificação de riscos
          issues.push('Riscos não identificados podem causar impactos significativos');
          issues.push('Ausência de processo sistemático aumenta vulnerabilidade');
          break;
        case 'stakeholders1': // Identificação de stakeholders
          issues.push('Stakeholders não identificados podem criar resistência e bloqueios');
          issues.push('Falta de mapeamento adequado prejudica comunicação e engajamento');
          break;
        case 'people1': // Competências
          issues.push('Lacunas de competência podem comprometer entrega de projetos');
          issues.push('Falta de desenvolvimento pode limitar crescimento organizacional');
          break;
        default:
          issues.push('Processo imaturo nesta área pode impactar negativamente resultados');
      }
    }

    return issues;
  }

  private static getSpecificRecommendations(question: any, response: number): string[] {
    const recommendations: string[] = [];
    
    if (response <= 2) {
      switch (question.id) {
        case 'gov1':
          recommendations.push('Implementar comitê de governança com representantes-chave');
          recommendations.push('Criar processo documentado para avaliação de investimentos');
          recommendations.push('Estabelecer critérios claros de priorização (ROI, alinhamento estratégico, risco)');
          break;
        case 'gov2':
          recommendations.push('Desenvolver cascata estratégica (estratégia → objetivos → projetos → atividades)');
          recommendations.push('Implementar OKRs ou Balanced Scorecard para alinhamento');
          recommendations.push('Criar rituais de revisão estratégica trimestrais');
          break;
        case 'delivery1':
          recommendations.push('Selecionar e implementar metodologia padrão (PMBOK, PRINCE2, Ágil)');
          recommendations.push('Treinar equipes na metodologia escolhida');
          recommendations.push('Criar templates e ferramentas padronizadas');
          break;
        case 'delivery2':
          recommendations.push('Implementar PMO (Project Management Office)');
          recommendations.push('Criar dashboard de portfólio com visão unificada');
          recommendations.push('Estabelecer processo de revisão e balanceamento do portfólio');
          break;
        case 'benefits1':
          recommendations.push('Criar templates de business case com benefícios quantificados');
          recommendations.push('Estabelecer métricas claras para cada tipo de benefício');
          recommendations.push('Implementar processo de aprovação baseado em benefícios');
          break;
        case 'financial1':
          recommendations.push('Implementar controles financeiros básicos (orçamento × realizado)');
          recommendations.push('Criar relatórios mensais de performance financeira');
          recommendations.push('Estabelecer aprovações por alçadas financeiras');
          break;
        case 'risk1':
          recommendations.push('Criar registro de riscos padronizado');
          recommendations.push('Implementar processo de identificação sistemática');
          recommendations.push('Estabelecer matriz de probabilidade vs impacto');
          break;
        case 'stakeholders1':
          recommendations.push('Desenvolver matriz de stakeholders (poder vs interesse)');
          recommendations.push('Criar plano de comunicação específico por stakeholder');
          recommendations.push('Estabelecer canais regulares de feedback');
          break;
        case 'people1':
          recommendations.push('Realizar assessment de competências atual');
          recommendations.push('Criar plano de desenvolvimento individual e coletivo');
          recommendations.push('Implementar programa de mentoring/coaching');
          break;
      }
    }

    return recommendations;
  }

  private static getQuestionDependencies(questionId: string): string[] {
    // Mapeamento de dependências entre questões
    const dependencies: Record<string, string[]> = {
      'gov2': ['gov1'], // Alinhamento depende de processo de decisão
      'delivery2': ['delivery1'], // Gestão de portfólio depende de metodologia
      'delivery3': ['delivery1', 'delivery2'], // Monitoramento depende de metodologia e portfólio
      'delivery4': ['delivery1', 'delivery2', 'delivery3'], // Lições aprendidas dependem dos anteriores
      'benefits2': ['benefits1'], // Mensuração depende de definição
      'benefits3': ['benefits1', 'benefits2'], // Realização depende de definição e mensuração
      'benefits4': ['benefits1', 'benefits2', 'benefits3'], // Otimização depende dos anteriores
      'financial2': ['financial1'], // Monitoramento depende de orçamentação
      'financial3': ['financial1', 'financial2'], // Otimização depende dos anteriores
      'financial4': ['financial1', 'financial2', 'financial3'], // ROI depende dos anteriores
      'risk2': ['risk1'], // Análise depende de identificação
      'risk3': ['risk1', 'risk2'], // Mitigação depende de identificação e análise
      'risk4': ['risk1', 'risk2', 'risk3'], // Monitoramento depende dos anteriores
      'stakeholders2': ['stakeholders1'], // Engajamento depende de identificação
      'stakeholders3': ['stakeholders1', 'stakeholders2'], // Comunicação depende dos anteriores
      'stakeholders4': ['stakeholders1', 'stakeholders2', 'stakeholders3'], // Gestão depende dos anteriores
      'people2': ['people1'], // Desenvolvimento depende de identificação
      'people3': ['people1', 'people2'], // Cultura depende dos anteriores
      'people4': ['people1', 'people2', 'people3'] // Inovação depende dos anteriores
    };

    return dependencies[questionId] || [];
  }

  private static getQuestionImpacts(questionId: string): string[] {
    // Questões que são impactadas por esta
    const impacts: Record<string, string[]> = {
      'gov1': ['gov2', 'delivery2', 'financial1'], // Decisões estratégicas impactam alinhamento, portfólio e finanças
      'gov2': ['delivery1', 'delivery2', 'benefits1'], // Alinhamento impacta entrega e benefícios
      'delivery1': ['delivery2', 'delivery3', 'delivery4'], // Metodologia impacta outras questões de entrega
      'benefits1': ['benefits2', 'benefits3', 'benefits4'], // Definição impacta outras questões de benefícios
      'financial1': ['financial2', 'financial3', 'financial4'], // Orçamentação impacta outras questões financeiras
      'risk1': ['risk2', 'risk3', 'risk4'], // Identificação impacta outras questões de risco
      'stakeholders1': ['stakeholders2', 'stakeholders3', 'stakeholders4'], // Identificação impacta outras questões de stakeholders
      'people1': ['people2', 'people3', 'people4'] // Competências impactam outras questões de pessoas
    };

    return impacts[questionId] || [];
  }

  private static getUrgency(question: any, response: number): 'high' | 'medium' | 'low' {
    // Questões fundamentais têm alta urgência quando pontuação é baixa
    const foundationalQuestions = ['gov1', 'delivery1', 'benefits1', 'financial1', 'risk1', 'stakeholders1', 'people1'];
    
    if (foundationalQuestions.includes(question.id) && response <= 2) {
      return 'high';
    }
    
    if (response <= 1.5) return 'high';
    if (response <= 2.5) return 'medium';
    return 'low';
  }

  private static getImpact(question: any, response: number): 'high' | 'medium' | 'low' {
    // Questões que afetam múltiplas outras têm alto impacto
    const impacts = this.getQuestionImpacts(question.id);
    
    if (impacts.length >= 3 && response <= 2) return 'high';
    if (impacts.length >= 2 && response <= 2) return 'medium';
    if (response <= 1.5) return 'high';
    if (response <= 2.5) return 'medium';
    return 'low';
  }

  private static identifyPatterns(responses: Record<string, number>, insights: QuestionInsight[]): ResponsePattern[] {
    const patterns: ResponsePattern[] = [];

    // Identificar inconsistências
    patterns.push(...this.findInconsistencies(responses, insights));
    
    // Identificar gargalos
    patterns.push(...this.findBottlenecks(insights));
    
    // Identificar habilitadores
    patterns.push(...this.findEnablers(insights));
    
    // Identificar riscos em cascata
    patterns.push(...this.findCascadeRisks(insights));

    return patterns;
  }

  private static findInconsistencies(responses: Record<string, number>, insights: QuestionInsight[]): ResponsePattern[] {
    const inconsistencies: ResponsePattern[] = [];

    // Exemplo: Alta governança mas baixa entrega
    const govScore = this.getPillarAverage('governance', responses);
    const deliveryScore = this.getPillarAverage('delivery', responses);
    
    if (govScore >= 4 && deliveryScore <= 2) {
      inconsistencies.push({
        type: 'inconsistency',
        title: 'Governança Forte vs Entrega Fraca',
        description: 'Sua organização tem boa governança estratégica, mas falha na execução. Esta inconsistência pode indicar que as decisões não estão sendo efetivamente traduzidas em resultados.',
        questions: ['gov1', 'gov2', 'delivery1', 'delivery2'],
        severity: 'high',
        recommendations: [
          'Criar ponte entre estratégia e execução através de PMO',
          'Implementar rituais de revisão que conectem decisões estratégicas com progresso operacional',
          'Desenvolver capacidades de gestão de projetos na organização'
        ]
      });
    }

    // Benefícios definidos mas não mensurados
    if (responses['benefits1'] >= 4 && responses['benefits2'] <= 2) {
      inconsistencies.push({
        type: 'inconsistency',
        title: 'Benefícios Definidos mas Não Mensurados',
        description: 'A organização define bem os benefícios esperados, mas não tem capacidade de mensurá-los adequadamente.',
        questions: ['benefits1', 'benefits2'],
        severity: 'medium',
        recommendations: [
          'Implementar sistema de métricas e KPIs',
          'Criar dashboards de acompanhamento de benefícios',
          'Estabelecer responsáveis pela coleta e análise de dados'
        ]
      });
    }

    return inconsistencies;
  }

  private static findBottlenecks(insights: QuestionInsight[]): ResponsePattern[] {
    const bottlenecks: ResponsePattern[] = [];

    // Encontrar questões com muitas dependências e pontuação baixa
    const criticalBottlenecks = insights.filter(insight => 
      insight.affects.length >= 2 && 
      insight.response <= 2 &&
      insight.status === 'critical'
    );

    criticalBottlenecks.forEach(bottleneck => {
      bottlenecks.push({
        type: 'bottleneck',
        title: `Gargalo Crítico: ${bottleneck.question}`,
        description: `Esta área está limitando o progresso em múltiplas outras áreas da organização.`,
        questions: [bottleneck.questionId, ...bottleneck.affects],
        severity: 'high',
        recommendations: bottleneck.specificRecommendations
      });
    });

    return bottlenecks;
  }

  private static findEnablers(insights: QuestionInsight[]): ResponsePattern[] {
    const enablers: ResponsePattern[] = [];

    // Encontrar questões com pontuação alta que podem acelerar outras
    const potentialEnablers = insights.filter(insight => 
      insight.affects.length >= 2 && 
      insight.response >= 4 &&
      insight.status === 'excellent'
    );

    potentialEnablers.forEach(enabler => {
      enablers.push({
        type: 'enabler',
        title: `Habilitador: ${enabler.question}`,
        description: `Esta é uma área forte que pode ser leverageada para acelerar o desenvolvimento de outras áreas.`,
        questions: [enabler.questionId, ...enabler.affects],
        severity: 'low',
        recommendations: [
          `Usar essa capacidade para apoiar desenvolvimento em ${enabler.affects.join(', ')}`,
          'Replicar as boas práticas desta área para outras',
          'Designar especialistas desta área como mentores para outras'
        ]
      });
    });

    return enablers;
  }

  private static findCascadeRisks(insights: QuestionInsight[]): ResponsePattern[] {
    const cascadeRisks: ResponsePattern[] = [];

    // Identificar quando múltiplas questões de um pilar estão mal
    PILLARS.forEach(pillar => {
      const pillarInsights = insights.filter(insight => insight.pillarId === pillar.id);
      const criticalCount = pillarInsights.filter(insight => insight.status === 'critical').length;
      
      if (criticalCount >= 3) {
        cascadeRisks.push({
          type: 'cascade_risk',
          title: `Risco em Cascata: ${pillar.name}`,
          description: `Múltiplas áreas deste pilar estão críticas, criando risco sistêmico para a organização.`,
          questions: pillarInsights.filter(insight => insight.status === 'critical').map(insight => insight.questionId),
          severity: 'high',
          recommendations: [
            `Priorizar investimento imediato no pilar ${pillar.name}`,
            'Criar plano de recuperação específico para esta área',
            'Alocar recursos especializados para resolver as deficiências'
          ]
        });
      }
    });

    return cascadeRisks;
  }

  private static analyzeCriticalPath(insights: QuestionInsight[]) {
    const blockers = insights.filter(insight => 
      insight.status === 'critical' && 
      insight.affects.length >= 2 &&
      insight.urgency === 'high'
    );

    const enablers = insights.filter(insight => 
      insight.status === 'excellent' && 
      insight.affects.length >= 2
    );

    const quickWins = insights.filter(insight => 
      insight.status === 'warning' && 
      insight.impact === 'high' &&
      insight.urgency === 'medium'
    );

    return { blockers, enablers, quickWins };
  }

  private static analyzePillarDependencies(responses: Record<string, number>, insights: QuestionInsight[]) {
    const dependencies: Record<string, any> = {};

    PILLARS.forEach(pillar => {
      const pillarInsights = insights.filter(insight => insight.pillarId === pillar.id);
      const score = this.getPillarAverage(pillar.id, responses);
      
      // Determinar dependências baseado nas questões críticas
      const criticalQuestions = pillarInsights
        .filter(insight => insight.status === 'critical')
        .map(insight => insight.questionId);

      dependencies[pillar.id] = {
        dependsOnPillars: this.getPillarDependencies(pillar.id),
        affectsPillars: this.getPillarImpacts(pillar.id),
        score,
        criticalQuestions
      };
    });

    return dependencies;
  }

  private static assessOrganizationalReadiness(responses: Record<string, number>, insights: QuestionInsight[]) {
    // Questões fundamentais (base)
    const foundationQuestions = ['gov1', 'delivery1', 'benefits1', 'financial1', 'risk1', 'stakeholders1', 'people1'];
    const foundationScores = foundationQuestions.map(qId => responses[qId] || 1);
    const foundationLevel = foundationScores.reduce((sum, score) => sum + score, 0) / foundationScores.length;

    // Questões de execução (intermediárias)
    const executionQuestions = ['gov2', 'delivery2', 'benefits2', 'financial2', 'risk2', 'stakeholders2', 'people2'];
    const executionScores = executionQuestions.map(qId => responses[qId] || 1);
    const executionLevel = executionScores.reduce((sum, score) => sum + score, 0) / executionScores.length;

    // Questões de otimização (avançadas)
    const optimizationQuestions = ['delivery4', 'benefits4', 'financial4', 'risk4', 'stakeholders4', 'people4'];
    const optimizationScores = optimizationQuestions.map(qId => responses[qId] || 1);
    const optimizationLevel = optimizationScores.reduce((sum, score) => sum + score, 0) / optimizationScores.length;

    // Identificar bases faltantes
    const missingFoundations = foundationQuestions.filter(qId => responses[qId] <= 2);
    
    // Identificar áreas avançadas prematuras
    const prematureAdvanced = optimizationQuestions.filter(qId => {
      const qIdBase = qId.replace('4', '1');
      return responses[qId] >= 4 && responses[qIdBase] <= 2;
    });

    return {
      foundationLevel,
      executionLevel,
      optimizationLevel,
      missingFoundations,
      prematureAdvanced
    };
  }

  private static getPillarAverage(pillarId: string, responses: Record<string, number>): number {
    const pillarQuestions = QUESTIONS.filter(q => q.pillarId === pillarId);
    const pillarResponses = pillarQuestions.map(q => responses[q.id]).filter(r => r !== undefined);
    return pillarResponses.length > 0 ? pillarResponses.reduce((sum, r) => sum + r, 0) / pillarResponses.length : 0;
  }

  private static getPillarDependencies(pillarId: string): string[] {
    const dependencies: Record<string, string[]> = {
      'delivery': ['governance'],
      'benefits': ['governance', 'delivery'],
      'financial': ['governance'],
      'risk': ['governance'],
      'stakeholders': ['governance'],
      'people': ['governance']
    };
    return dependencies[pillarId] || [];
  }

  private static getPillarImpacts(pillarId: string): string[] {
    const impacts: Record<string, string[]> = {
      'governance': ['delivery', 'benefits', 'financial', 'risk', 'stakeholders', 'people'],
      'delivery': ['benefits'],
      'financial': ['delivery', 'benefits'],
      'people': ['delivery', 'benefits']
    };
    return impacts[pillarId] || [];
  }
}
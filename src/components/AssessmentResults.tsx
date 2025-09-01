import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Download, 
  RotateCcw, 
  Target, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle,
  ArrowUp,
  Users,
  Zap,
  Shield,
  Save,
  CheckCircle
} from 'lucide-react';
import { PILLARS, OSRL_LEVELS, QUESTIONS } from '@/data/osrl-framework';
import { RadarChart } from './RadarChart';
import { useToast } from '@/hooks/use-toast';
import { useAssessments } from '@/hooks/useAssessments';
import { AdvancedAnalytics } from '@/lib/advancedAnalytics';
import { DetailedResponseAnalyzer } from '@/lib/detailedResponseAnalyzer';
import { ContextualRecommendationEngine } from '@/lib/contextualRecommendationEngine';
import { AdvancedInsights } from './AdvancedInsights';
import { RoadmapGenerator } from './RoadmapGenerator';
import { QuestionLevelInsights } from './QuestionLevelInsights';
import { InteractiveHeatmap } from './InteractiveHeatmap';
import { ImplementationDashboard } from './ImplementationDashboard';

interface AssessmentResultsProps {
  osrlLevel: number;
  pillarScores: Record<string, number>;
  responses: Record<string, number>;
  onReset: () => void;
  user: any;
}

export function AssessmentResults({ osrlLevel, pillarScores, responses, onReset, user }: AssessmentResultsProps) {
  const { toast } = useToast();
  const { createAssessment } = useAssessments();
  const currentLevel = OSRL_LEVELS.find(level => level.level === osrlLevel);
  
  // Save state
  const [isSaving, setIsSaving] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  
  // Generate advanced analysis
  const advancedAnalysis = AdvancedAnalytics.performAdvancedAnalysis(responses, pillarScores);
  const detailedAnalysis = DetailedResponseAnalyzer.analyzeResponses(responses);
  const recommendationPlan = ContextualRecommendationEngine.generateRecommendationPlan(responses, detailedAnalysis);
  
  // Calculate overall score
  const overallScore = Math.round(
    Object.values(pillarScores).reduce((sum, score) => sum + score, 0) / Object.keys(pillarScores).length
  );

  // Analyze specific responses for personalized insights
  const getPersonalizedDescription = () => {
    const averageScore = Object.values(responses).reduce((sum, score) => sum + score, 0) / Object.keys(responses).length;
    
    // Find specific strong and weak areas based on responses
    const strongAreas = [];
    const weakAreas = [];
    
    PILLARS.forEach(pillar => {
      const pillarQuestions = QUESTIONS.filter(q => q.pillarId === pillar.id);
      const pillarResponses = pillarQuestions.map(q => responses[q.id]).filter(r => r !== undefined);
      const pillarAverage = pillarResponses.reduce((sum, score) => sum + score, 0) / pillarResponses.length;
      
      if (pillarAverage >= 4) {
        strongAreas.push(pillar.name);
      } else if (pillarAverage <= 2.5) {
        weakAreas.push(pillar.name);
      }
    });

    let description = currentLevel?.description || '';
    
    // Add specific insights based on responses
    if (strongAreas.length > 0) {
      description += ` Sua organização demonstra particular força em ${strongAreas.join(' e ')}.`;
    }
    
    if (weakAreas.length > 0) {
      description += ` Há oportunidades significativas de desenvolvimento em ${weakAreas.join(' e ')}.`;
    }
    
    return description;
  };

  const getPersonalizedStrengthsAndImprovements = () => {
    const analysis = PILLARS.map(pillar => {
      const pillarQuestions = QUESTIONS.filter(q => q.pillarId === pillar.id);
      const pillarResponses = pillarQuestions.map(q => responses[q.id]).filter(r => r !== undefined);
      const pillarAverage = pillarResponses.reduce((sum, score) => sum + score, 0) / pillarResponses.length;
      
      // Find specific question responses for detailed analysis
      const specificInsights = pillarQuestions.map(q => {
        const response = responses[q.id];
        return { question: q, response, pillarAverage };
      }).filter(insight => insight.response !== undefined);
      
      return {
        ...pillar,
        score: pillarScores[pillar.id] || 0,
        average: pillarAverage,
        insights: specificInsights
      };
    }).sort((a, b) => b.score - a.score);

    const strengths = analysis.slice(0, 2).map(pillar => ({
      ...pillar,
      specificStrength: getSpecificStrengthMessage(pillar)
    }));
    
    const improvements = analysis.slice(-2).map(pillar => ({
      ...pillar,
      specificImprovement: getSpecificImprovementMessage(pillar)
    }));

    return { strengths, improvements };
  };

  const getSpecificStrengthMessage = (pillar: any) => {
    const strongResponses = pillar.insights.filter((insight: any) => insight.response >= 4);
    if (strongResponses.length > 0) {
      return `Destaque em ${strongResponses.length} de ${pillar.insights.length} aspectos avaliados, demonstrando processos bem estruturados.`;
    }
    return pillar.description;
  };

  const getSpecificImprovementMessage = (pillar: any) => {
    const weakResponses = pillar.insights.filter((insight: any) => insight.response <= 2);
    if (weakResponses.length > 0) {
      return `${weakResponses.length} de ${pillar.insights.length} aspectos precisam de atenção imediata para estruturação básica.`;
    }
    return `Área com potencial de crescimento para alcançar processos mais maduros.`;
  };

  const generateAndDownloadReport = () => {
    const reportData = {
      osrlLevel,
      overallScore,
      pillarScores,
      personalizedDescription: getPersonalizedDescription(),
      analysis: getPersonalizedStrengthsAndImprovements(),
      recommendations: getRecommendationsByLevel(osrlLevel),
      timestamp: new Date().toLocaleDateString('pt-BR')
    };

    // Create HTML report
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Relatório O-SRL - Nível ${osrlLevel}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; color: #333; }
          .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #e0e0e0; padding-bottom: 20px; }
          .level-badge { background: #3b82f6; color: white; padding: 10px 20px; border-radius: 25px; font-weight: bold; }
          .section { margin: 30px 0; }
          .pillar-item { margin: 15px 0; padding: 15px; border-left: 4px solid #3b82f6; background: #f8fafc; }
          .strength { border-left-color: #10b981; background: #f0fdf4; }
          .improvement { border-left-color: #f59e0b; background: #fffbeb; }
          .recommendation-list { list-style: none; padding: 0; }
          .recommendation-list li { margin: 10px 0; padding: 10px; background: #f1f5f9; border-radius: 5px; }
          .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Relatório de Diagnóstico O-SRL</h1>
          <div class="level-badge">O-SRL ${osrlLevel} - ${currentLevel?.name}</div>
          <p><strong>Pontuação Geral:</strong> ${overallScore}%</p>
          <p><strong>Data:</strong> ${reportData.timestamp}</p>
        </div>

        <div class="section">
          <h2>Análise do Nível Alcançado</h2>
          <p>${reportData.personalizedDescription}</p>
        </div>

        <div class="section">
          <h2>Pontuação Detalhada por Pilar</h2>
          ${PILLARS.map(pillar => `
            <div class="pillar-item">
              <strong>${pillar.name}:</strong> ${pillarScores[pillar.id] || 0}%
              <br><small>${pillar.description}</small>
            </div>
          `).join('')}
        </div>

        <div class="section">
          <h2>Pontos Fortes</h2>
          ${reportData.analysis.strengths.map(strength => `
            <div class="pillar-item strength">
              <strong>${strength.name}</strong> (${strength.score}%)
              <br><small>${strength.specificStrength}</small>
            </div>
          `).join('')}
        </div>

        <div class="section">
          <h2>Oportunidades de Melhoria</h2>
          ${reportData.analysis.improvements.map(improvement => `
            <div class="pillar-item improvement">
              <strong>${improvement.name}</strong> (${improvement.score}%)
              <br><small>${improvement.specificImprovement}</small>
            </div>
          `).join('')}
        </div>

        <div class="section">
          <h2>Recomendações Específicas</h2>
          <ul class="recommendation-list">
            ${reportData.recommendations.map(rec => `<li>${rec}</li>`).join('')}
          </ul>
        </div>

        <div class="footer">
          <p>Relatório gerado pelo Framework O-SRL - Organizational Strategic Readiness Level</p>
          <p>Este diagnóstico oferece uma visão geral da maturidade organizacional baseada nas respostas fornecidas.</p>
        </div>
      </body>
      </html>
    `;

    // Create and download the report
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Relatorio-OSRL-Nivel-${osrlLevel}-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Relatório Baixado com Sucesso!",
      description: "Seu relatório personalizado foi gerado e baixado. Abra o arquivo HTML em qualquer navegador.",
      duration: 5000,
    });
  };

  // Identify strengths and weaknesses with personalized analysis
  const { strengths, improvements } = getPersonalizedStrengthsAndImprovements();

  const handleDownloadReport = () => {
    generateAndDownloadReport();
  };

  const getLevelColor = (level: number) => {
    if (level <= 3) return 'text-warning';
    if (level <= 6) return 'text-primary';
    return 'text-success';
  };

  const getLevelBadgeVariant = (level: number) => {
    if (level <= 3) return 'outline' as const;
    if (level <= 6) return 'default' as const;
    return 'default' as const;
  };

  // Webhook functions
  const generateReportHtml = () => {
    const reportData = {
      osrlLevel,
      overallScore,
      pillarScores,
      personalizedDescription: getPersonalizedDescription(),
      analysis: getPersonalizedStrengthsAndImprovements(),
      recommendations: getRecommendationsByLevel(osrlLevel),
      timestamp: new Date().toLocaleDateString('pt-BR')
    };

    return `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Relatório O-SRL - Nível ${osrlLevel}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; color: #333; }
          .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #e0e0e0; padding-bottom: 20px; }
          .level-badge { background: #3b82f6; color: white; padding: 10px 20px; border-radius: 25px; font-weight: bold; }
          .section { margin: 30px 0; }
          .pillar-item { margin: 15px 0; padding: 15px; border-left: 4px solid #3b82f6; background: #f8fafc; }
          .strength { border-left-color: #10b981; background: #f0fdf4; }
          .improvement { border-left-color: #f59e0b; background: #fffbeb; }
          .recommendation-list { list-style: none; padding: 0; }
          .recommendation-list li { margin: 10px 0; padding: 10px; background: #f1f5f9; border-radius: 5px; }
          .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Relatório de Diagnóstico O-SRL</h1>
          <div class="level-badge">O-SRL ${osrlLevel} - ${currentLevel?.name}</div>
          <p><strong>Pontuação Geral:</strong> ${overallScore}%</p>
          <p><strong>Data:</strong> ${reportData.timestamp}</p>
        </div>

        <div class="section">
          <h2>Análise do Nível Alcançado</h2>
          <p>${reportData.personalizedDescription}</p>
        </div>

        <div class="section">
          <h2>Pontuação Detalhada por Pilar</h2>
          ${PILLARS.map(pillar => `
            <div class="pillar-item">
              <strong>${pillar.name}:</strong> ${pillarScores[pillar.id] || 0}%
              <br><small>${pillar.description}</small>
            </div>
          `).join('')}
        </div>

        <div class="section">
          <h2>Pontos Fortes</h2>
          ${reportData.analysis.strengths.map(strength => `
            <div class="pillar-item strength">
              <strong>${strength.name}</strong> (${strength.score}%)
              <br><small>${strength.specificStrength}</small>
            </div>
          `).join('')}
        </div>

        <div class="section">
          <h2>Oportunidades de Melhoria</h2>
          ${reportData.analysis.improvements.map(improvement => `
            <div class="pillar-item improvement">
              <strong>${improvement.name}</strong> (${improvement.score}%)
              <br><small>${improvement.specificImprovement}</small>
            </div>
          `).join('')}
        </div>

        <div class="section">
          <h2>Recomendações Específicas</h2>
          <ul class="recommendation-list">
            ${reportData.recommendations.map(rec => `<li>${rec}</li>`).join('')}
          </ul>
        </div>

        <div class="footer">
          <p>Relatório gerado pelo Framework O-SRL - Organizational Strategic Readiness Level</p>
          <p>Este diagnóstico oferece uma visão geral da maturidade organizacional baseada nas respostas fornecidas.</p>
        </div>
      </body>
      </html>
    `;
  };


  // Auto-save to Supabase when component loads
  useEffect(() => {
    const saveToSupabase = async () => {
      if (!user || hasSaved || isSaving) return;
      
      setIsSaving(true);
      try {
        const assessmentData = {
          user_id: user.id,
          email: user.email || '',
          timestamp: new Date().toISOString(),
          osrl_level: osrlLevel,
          overall_score: overallScore,
          pillar_scores: pillarScores,
          responses: responses,
          personalized_analysis: {
            description: getPersonalizedDescription(),
            analysis: getPersonalizedStrengthsAndImprovements(),
            recommendations: getRecommendationsByLevel(osrlLevel)
          },
          report_html: generateReportHtml()
        };

        await createAssessment(assessmentData);
        setHasSaved(true);
        
        toast({
          title: "Avaliação Salva!",
          description: "Sua avaliação foi salva automaticamente no seu histórico.",
          duration: 3000,
        });
      } catch (error) {
        console.error('Erro ao salvar avaliação:', error);
        toast({
          title: "Erro ao Salvar",
          description: "Não foi possível salvar a avaliação automaticamente.",
          variant: "destructive",
        });
      } finally {
        setIsSaving(false);
      }
    };

    saveToSupabase();
  }, [user, osrlLevel, overallScore, pillarScores, responses, hasSaved, isSaving, createAssessment, toast]);

  const getRecommendationsByLevel = (level: number) => {
    if (level <= 3) {
      return [
        "Documente e padronize processos críticos existentes",
        "Estabeleça métricas básicas de acompanhamento e controle",
        "Crie estrutura mínima de governança com papéis definidos",
        "Implemente comunicação regular entre equipes e departamentos"
      ];
    } else if (level <= 5) {
      return [
        "Implemente uma visão de Gestão de Portfólio de Projetos (PPM)",
        "Desenvolva mecanismos de compartilhamento de conhecimento",
        "Estabeleça framework de governança integrado",
        "Crie sistemas para quebrar silos organizacionais"
      ];
    } else {
      return [
        "Implemente otimização de processos baseada em dados quantitativos",
        "Desenvolva cultura de melhoria contínua sistemática",
        "Explore tecnologias emergentes para automação inteligente",
        "Estabeleça parcerias estratégicas para co-inovação"
      ];
    }
  };

  return (
    <div className="min-h-screen bg-gradient-secondary p-2 sm:p-4">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8 px-1 sm:px-2">
        
        {/* Header */}
        <Card className="shadow-strong bg-gradient-hero text-white border-0">
          <CardHeader className="text-center pb-6 sm:pb-8 px-4 sm:px-6">
            <div className="mx-auto mb-4 w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Target className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 break-words hyphens-auto">
              Seu Diagnóstico O-SRL
            </CardTitle>
            <CardDescription className="text-white/90 text-sm sm:text-base md:text-lg break-words hyphens-auto leading-relaxed">
              Análise Completa de Maturidade Organizacional
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Main Results Grid */}
        <div className="grid lg:grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          
          {/* O-SRL Level Card */}
          <Card className="shadow-medium">
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="flex items-start sm:items-center gap-2 text-lg sm:text-xl break-words hyphens-auto">
                <ArrowUp className={`w-5 h-5 sm:w-6 sm:h-6 ${getLevelColor(osrlLevel)} flex-shrink-0 mt-1 sm:mt-0`} />
                <span className="break-words hyphens-auto">Nível O-SRL Alcançado</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
              <div className="text-center space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                  <Badge 
                    variant={getLevelBadgeVariant(osrlLevel)} 
                    className="text-lg sm:text-2xl px-4 py-2 sm:px-6 sm:py-3 font-bold"
                  >
                    O-SRL {osrlLevel}
                  </Badge>
                  <div className="text-center sm:text-right">
                    <div className="text-2xl sm:text-3xl font-bold text-primary">{overallScore}%</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Pontuação Geral</div>
                  </div>
                </div>
                
                <h3 className="text-lg sm:text-xl font-semibold text-foreground break-words hyphens-auto">
                  {currentLevel?.name}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed break-words hyphens-auto">
                  {getPersonalizedDescription()}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-sm sm:text-base text-foreground flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                  <span className="break-words hyphens-auto">Características do Seu Nível</span>
                </h4>
                <ul className="space-y-2">
                  {currentLevel?.characteristics.map((characteristic, index) => (
                    <li key={index} className="text-xs sm:text-sm text-muted-foreground flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                      <span className="break-words hyphens-auto">{characteristic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Radar Chart */}
          <Card className="shadow-medium">
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="flex items-start sm:items-center gap-2 text-lg sm:text-xl break-words hyphens-auto">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0 mt-1 sm:mt-0" />
                <span className="break-words hyphens-auto">Análise dos 7 Pilares</span>
              </CardTitle>
              <CardDescription className="text-sm break-words hyphens-auto">
                Visão detalhada do desempenho por área de maturidade
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <RadarChart data={pillarScores} />
            </CardContent>
          </Card>
        </div>

        {/* Detailed Pillar Scores */}
        <Card className="shadow-medium">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="flex items-start sm:items-center gap-2 text-lg sm:text-xl break-words hyphens-auto">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0 mt-1 sm:mt-0" />
              <span className="break-words hyphens-auto">Pontuação Detalhada por Pilar</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
              {PILLARS.map((pillar) => {
                const score = pillarScores[pillar.id] || 0;
                return (
                  <div key={pillar.id} className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-medium text-xs sm:text-sm break-words hyphens-auto flex-1">
                        {pillar.name}
                      </span>
                      <Badge variant="secondary" className="flex-shrink-0">{score}%</Badge>
                    </div>
                    <Progress value={score} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Strengths and Improvements */}
        <div className="grid lg:grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          
          {/* Strengths */}
          <Card className="shadow-medium border-success/20">
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="flex items-start sm:items-center gap-2 text-lg sm:text-xl text-success break-words hyphens-auto">
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 mt-1 sm:mt-0" />
                <span className="break-words hyphens-auto">Pontos Fortes</span>
              </CardTitle>
              <CardDescription className="text-sm break-words hyphens-auto">
                Áreas onde sua organização demonstra maior maturidade
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-4 sm:px-6">
              {strengths.map((pillar) => (
                <div key={pillar.id} className="p-3 sm:p-4 bg-success/5 rounded-lg border border-success/20">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-2">
                    <h4 className="font-medium text-sm sm:text-base text-success break-words hyphens-auto flex-1">
                      {pillar.name}
                    </h4>
                    <Badge variant="secondary" className="bg-success/10 text-success flex-shrink-0">
                      {pillar.score}%
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground break-words hyphens-auto leading-relaxed">
                    {pillar.specificStrength}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Improvements */}
          <Card className="shadow-medium border-warning/20">
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="flex items-start sm:items-center gap-2 text-lg sm:text-xl text-warning break-words hyphens-auto">
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 mt-1 sm:mt-0" />
                <span className="break-words hyphens-auto">Oportunidades de Melhoria</span>
              </CardTitle>
              <CardDescription className="text-sm break-words hyphens-auto">
                Áreas prioritárias para desenvolvimento e crescimento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-4 sm:px-6">
              {improvements.map((pillar) => (
                <div key={pillar.id} className="p-3 sm:p-4 bg-warning/5 rounded-lg border border-warning/20">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-2">
                    <h4 className="font-medium text-sm sm:text-base text-warning break-words hyphens-auto flex-1">
                      {pillar.name}
                    </h4>
                    <Badge variant="secondary" className="bg-warning/10 text-warning flex-shrink-0">
                      {pillar.score}%
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground break-words hyphens-auto leading-relaxed">
                    {pillar.specificImprovement}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        <Card className="shadow-medium">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="flex items-start sm:items-center gap-2 text-lg sm:text-xl break-words hyphens-auto">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0 mt-1 sm:mt-0" />
              <span className="break-words hyphens-auto">Próximos Passos Recomendados</span>
            </CardTitle>
            <CardDescription className="text-sm break-words hyphens-auto">
              Ações estratégicas para evoluir para o próximo nível de maturidade
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="grid lg:grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-sm sm:text-base text-foreground break-words hyphens-auto">
                  Recomendações Específicas:
                </h4>
                <ul className="space-y-3">
                  {getRecommendationsByLevel(osrlLevel).map((recommendation, index) => (
                    <li key={index} className="flex items-start gap-2 sm:gap-3">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-semibold text-primary">{index + 1}</span>
                      </div>
                      <span className="text-xs sm:text-sm text-muted-foreground break-words hyphens-auto">
                        {recommendation}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium text-sm sm:text-base text-foreground break-words hyphens-auto">
                  Recomendações do Framework:
                </h4>
                <ul className="space-y-3">
                  {currentLevel?.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start gap-2 sm:gap-3">
                      <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-primary mt-1 flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-muted-foreground break-words hyphens-auto">
                        {recommendation}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Insights Section */}
        <div className="space-y-6 sm:space-y-8">
          <Card>
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="text-center text-lg sm:text-xl md:text-2xl break-words hyphens-auto">
                Análise Avançada e Insights Inteligentes
              </CardTitle>
              <CardDescription className="text-center text-sm break-words hyphens-auto">
                Diagnóstico profundo com recomendações baseadas em análise preditiva
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <AdvancedInsights analysisResult={advancedAnalysis} />
            </CardContent>
          </Card>

          {/* Roadmap Generator */}
          <RoadmapGenerator 
            analysisResult={advancedAnalysis} 
            pillarScores={pillarScores}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-2 sm:px-0">
          <Button 
            size="lg" 
            onClick={handleDownloadReport}
            className="bg-gradient-primary hover:shadow-medium transition-all duration-300 px-6 sm:px-8 text-sm sm:text-base"
          >
            <Download className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            Baixar Relatório Completo
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            onClick={onReset}
            className="px-6 sm:px-8 text-sm sm:text-base"
          >
            <RotateCcw className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            Nova Avaliação
          </Button>
        </div>

        {/* Save Status */}
        {hasSaved && (
          <Card className="shadow-medium border-success/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-success">
                <CheckCircle className="w-6 h-6" />
                <div>
                  <p className="font-medium">Avaliação Salva Automaticamente</p>
                  <p className="text-sm text-muted-foreground">
                    Seus resultados foram salvos no seu histórico online
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {isSaving && (
          <Card className="shadow-medium border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Save className="w-6 h-6 animate-pulse text-primary" />
                <div>
                  <p className="font-medium">Salvando Avaliação...</p>
                  <p className="text-sm text-muted-foreground">
                    Aguarde enquanto salvamos seus resultados
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Framework Info */}
        <Card className="border-muted">
          <CardContent className="pt-6">
            <div className="text-center text-sm text-muted-foreground space-y-2">
              <p className="font-medium">Sobre o Framework O-SRL</p>
              <p>
                O Organizational Strategic Readiness Level (O-SRL) é uma metodologia estruturada 
                para avaliar e desenvolver a maturidade organizacional em 7 pilares fundamentais.
              </p>
              <p className="text-xs">
                Esta avaliação fornece insights para impulsionar a evolução estratégica da sua organização 
                através de processos estruturados e melhores práticas comprovadas.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
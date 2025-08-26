import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
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
  Send,
  Loader2,
  Mail
} from 'lucide-react';
import { PILLARS, OSRL_LEVELS, QUESTIONS } from '@/data/osrl-framework';
import { RadarChart } from './RadarChart';
import { useToast } from '@/hooks/use-toast';

interface AssessmentResultsProps {
  osrlLevel: number;
  pillarScores: Record<string, number>;
  responses: Record<string, number>;
  onReset: () => void;
}

export function AssessmentResults({ osrlLevel, pillarScores, responses, onReset }: AssessmentResultsProps) {
  const { toast } = useToast();
  const currentLevel = OSRL_LEVELS.find(level => level.level === osrlLevel);
  
  // Webhook form state
  const [email, setEmail] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [hasSent, setHasSent] = useState(false);
  
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

  const saveToLocalStorage = (data: any) => {
    try {
      const existingData = JSON.parse(localStorage.getItem('osrl-assessments') || '[]');
      existingData.push(data);
      localStorage.setItem('osrl-assessments', JSON.stringify(existingData));
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error);
    }
  };

  const sendToWebhook = async () => {
    if (!isAnonymous && (!email || !email.includes('@'))) {
      toast({
        title: "E-mail Inválido",
        description: "Por favor, insira um e-mail válido ou marque a opção 'Enviar de forma anônima'.",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);

    try {
      const webhookData = {
        email: isAnonymous ? "anonimo" : email,
        timestamp: new Date().toISOString(),
        osrlLevel,
        overallScore,
        pillarScores,
        responses,
        reportHtml: generateReportHtml(),
        personalizedAnalysis: {
          description: getPersonalizedDescription(),
          analysis: getPersonalizedStrengthsAndImprovements(),
          recommendations: getRecommendationsByLevel(osrlLevel)
        }
      };

      // Save to localStorage
      saveToLocalStorage(webhookData);

      // Send to n8n webhook
      const response = await fetch('https://postgres-n8n.wuzmwk.easypanel.host/webhook/ca6725ba-2167-46fb-8b95-b8245215de56', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData),
        mode: 'no-cors' // Para evitar problemas de CORS
      });

      setHasSent(true);
      toast({
        title: "Dados Enviados com Sucesso!",
        description: "Sua avaliação foi registrada e o relatório foi enviado para análise.",
        duration: 5000,
      });

    } catch (error) {
      console.error('Erro ao enviar dados:', error);
      toast({
        title: "Erro ao Enviar Dados",
        description: "Ocorreu um erro ao enviar os dados. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const validateEmail = (email: string) => {
    return email.includes('@') && email.includes('.');
  };

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
    <div className="min-h-screen bg-gradient-secondary p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <Card className="shadow-strong bg-gradient-hero text-white border-0">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto mb-4 w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Target className="w-8 h-8" />
            </div>
            <CardTitle className="text-3xl font-bold mb-2">
              Seu Diagnóstico O-SRL
            </CardTitle>
            <CardDescription className="text-white/90 text-lg">
              Análise Completa de Maturidade Organizacional
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Main Results Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* O-SRL Level Card */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <ArrowUp className={`w-6 h-6 ${getLevelColor(osrlLevel)}`} />
                Nível O-SRL Alcançado
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <Badge 
                    variant={getLevelBadgeVariant(osrlLevel)} 
                    className="text-2xl px-6 py-3 font-bold"
                  >
                    O-SRL {osrlLevel}
                  </Badge>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary">{overallScore}%</div>
                    <div className="text-sm text-muted-foreground">Pontuação Geral</div>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold mb-2 text-foreground">
                  {currentLevel?.name}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {getPersonalizedDescription()}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-foreground flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  Características do Seu Nível
                </h4>
                <ul className="space-y-2">
                  {currentLevel?.characteristics.map((characteristic, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      {characteristic}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Radar Chart */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Zap className="w-6 h-6 text-primary" />
                Análise dos 7 Pilares
              </CardTitle>
              <CardDescription>
                Visão detalhada do desempenho por área de maturidade
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadarChart data={pillarScores} />
            </CardContent>
          </Card>
        </div>

        {/* Detailed Pillar Scores */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Shield className="w-6 h-6 text-primary" />
              Pontuação Detalhada por Pilar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {PILLARS.map((pillar) => {
                const score = pillarScores[pillar.id] || 0;
                return (
                  <div key={pillar.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm">{pillar.name}</span>
                      <Badge variant="secondary">{score}%</Badge>
                    </div>
                    <Progress value={score} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Strengths and Improvements */}
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Strengths */}
          <Card className="shadow-medium border-success/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-success">
                <CheckCircle2 className="w-6 h-6" />
                Pontos Fortes
              </CardTitle>
              <CardDescription>
                Áreas onde sua organização demonstra maior maturidade
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {strengths.map((pillar) => (
                <div key={pillar.id} className="p-4 bg-success/5 rounded-lg border border-success/20">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-success">{pillar.name}</h4>
                    <Badge variant="secondary" className="bg-success/10 text-success">
                      {pillar.score}%
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{pillar.specificStrength}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Improvements */}
          <Card className="shadow-medium border-warning/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-warning">
                <AlertCircle className="w-6 h-6" />
                Oportunidades de Melhoria
              </CardTitle>
              <CardDescription>
                Áreas prioritárias para desenvolvimento e crescimento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {improvements.map((pillar) => (
                <div key={pillar.id} className="p-4 bg-warning/5 rounded-lg border border-warning/20">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-warning">{pillar.name}</h4>
                    <Badge variant="secondary" className="bg-warning/10 text-warning">
                      {pillar.score}%
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{pillar.specificImprovement}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <TrendingUp className="w-6 h-6 text-primary" />
              Próximos Passos Recomendados
            </CardTitle>
            <CardDescription>
              Ações estratégicas para evoluir para o próximo nível de maturidade
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-foreground">Recomendações Específicas:</h4>
                <ul className="space-y-3">
                  {getRecommendationsByLevel(osrlLevel).map((recommendation, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-semibold text-primary">{index + 1}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium text-foreground">Recomendações do Framework:</h4>
                <ul className="space-y-3">
                  {currentLevel?.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            onClick={handleDownloadReport}
            className="bg-gradient-primary hover:shadow-medium transition-all duration-300 px-8"
          >
            <Download className="mr-2 h-5 w-5" />
            Baixar Relatório Completo
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            onClick={onReset}
            className="px-8"
          >
            <RotateCcw className="mr-2 h-5 w-5" />
            Nova Avaliação
          </Button>
        </div>

        {/* Webhook Data Submission */}
        <Card className="shadow-medium border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Mail className="w-6 h-6 text-primary" />
              Registrar Avaliação
            </CardTitle>
            <CardDescription>
              Envie seus dados para análise posterior e contribua para pesquisas de maturidade organizacional
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail (opcional)</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isAnonymous || hasSent}
                    className={isAnonymous ? 'opacity-50' : ''}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="anonymous"
                    checked={isAnonymous}
                    onCheckedChange={(checked) => {
                      setIsAnonymous(checked as boolean);
                      if (checked) setEmail('');
                    }}
                    disabled={hasSent}
                  />
                  <Label htmlFor="anonymous" className="text-sm">
                    Enviar de forma anônima
                  </Label>
                </div>

                {hasSent && (
                  <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                    <div className="flex items-center gap-2 text-success text-sm">
                      <CheckCircle2 className="w-4 h-4" />
                      Dados enviados com sucesso!
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium text-foreground mb-2">O que será enviado:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Todas as respostas do formulário</li>
                    <li>• Nível O-SRL e pontuações dos pilares</li>
                    <li>• Relatório HTML completo</li>
                    <li>• Análise personalizada gerada</li>
                    <li>• Data e horário da avaliação</li>
                  </ul>
                </div>
                
                <Button
                  onClick={sendToWebhook}
                  disabled={isSending || hasSent || (!isAnonymous && !validateEmail(email))}
                  className="w-full"
                  size="lg"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : hasSent ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Dados Enviados
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Enviar Dados
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground py-8">
          <p className="flex items-center justify-center gap-2 mb-2">
            <Users className="w-4 h-4" />
            Diagnóstico baseado no Framework O-SRL • 100% Anônimo e Gratuito
          </p>
          <p>
            Esta avaliação fornece uma visão geral da maturidade organizacional. 
            Para análises mais profundas, considere consultar especialistas em transformação organizacional.
          </p>
        </div>
      </div>
    </div>
  );
}
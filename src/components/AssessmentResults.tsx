import React from 'react';
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
  Shield
} from 'lucide-react';
import { PILLARS, OSRL_LEVELS } from '@/data/osrl-framework';
import { RadarChart } from './RadarChart';
import { useToast } from '@/hooks/use-toast';

interface AssessmentResultsProps {
  osrlLevel: number;
  pillarScores: Record<string, number>;
  onReset: () => void;
}

export function AssessmentResults({ osrlLevel, pillarScores, onReset }: AssessmentResultsProps) {
  const { toast } = useToast();
  const currentLevel = OSRL_LEVELS.find(level => level.level === osrlLevel);
  
  // Calculate overall score
  const overallScore = Math.round(
    Object.values(pillarScores).reduce((sum, score) => sum + score, 0) / Object.keys(pillarScores).length
  );

  // Identify strengths and weaknesses
  const sortedPillars = PILLARS.map(pillar => ({
    ...pillar,
    score: pillarScores[pillar.id] || 0
  })).sort((a, b) => b.score - a.score);

  const strengths = sortedPillars.slice(0, 2);
  const improvements = sortedPillars.slice(-2);

  const handleDownloadReport = () => {
    toast({
      title: "Relatório em Desenvolvimento",
      description: "A funcionalidade de download será implementada em breve. Por enquanto, você pode capturar esta tela.",
      duration: 3000,
    });
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
                  {currentLevel?.description}
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
                  <p className="text-sm text-muted-foreground">{pillar.description}</p>
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
                  <p className="text-sm text-muted-foreground">{pillar.description}</p>
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
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { InfoIcon, ArrowRight, ArrowLeft, CheckCircle2, History, Play, Target } from 'lucide-react';
import { PILLARS, QUESTIONS, OSRL_LEVELS, calculateOSRLLevel, calculatePillarScores } from '@/data/osrl-framework';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AssessmentResults } from './AssessmentResults';
import { AssessmentHistory } from './AssessmentHistory';
import { GoogleSheetsHistory } from './GoogleSheetsHistory';

export function OSRLAssessment() {
  const [currentStep, setCurrentStep] = useState<'intro' | 'assessment' | 'results' | 'history' | 'google-history'>('intro');
  const [currentPillar, setCurrentPillar] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<string, number>>({});
  
  const pillarQuestions = QUESTIONS.filter(q => q.pillarId === PILLARS[currentPillar]?.id);
  const totalQuestions = QUESTIONS.length;
  const answeredQuestions = Object.keys(responses).length;
  const progressPercentage = (answeredQuestions / totalQuestions) * 100;

  const handleResponse = (questionId: string, value: number) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
    
    // Auto-advance to next question
    setTimeout(() => {
      if (currentQuestion < pillarQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else if (currentPillar < PILLARS.length - 1) {
        setCurrentPillar(prev => prev + 1);
        setCurrentQuestion(0);
      } else {
        // Assessment completed
        setCurrentStep('results');
      }
    }, 500);
  };

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    } else if (currentPillar > 0) {
      setCurrentPillar(prev => prev - 1);
      const prevPillarQuestions = QUESTIONS.filter(q => q.pillarId === PILLARS[currentPillar - 1]?.id);
      setCurrentQuestion(prevPillarQuestions.length - 1);
    }
  };

  const startAssessment = () => {
    setCurrentStep('assessment');
    setCurrentPillar(0);
    setCurrentQuestion(0);
    setResponses({});
  };

  const resetAssessment = () => {
    setCurrentStep('intro');
    setCurrentPillar(0);
    setCurrentQuestion(0);
    setResponses({});
  };

  const showHistory = () => {
    setCurrentStep('history');
  };

  const showGoogleHistory = () => {
    setCurrentStep('google-history');
  };

  const backToIntro = () => {
    setCurrentStep('intro');
  };

  if (currentStep === 'results') {
    const osrlLevel = calculateOSRLLevel(responses);
    const pillarScores = calculatePillarScores(responses);
    
    return (
      <AssessmentResults
        osrlLevel={osrlLevel}
        pillarScores={pillarScores}
        responses={responses}
        onReset={resetAssessment}
      />
    );
  }

  // Show assessment history
  if (currentStep === 'history') {
    return (
      <div className="min-h-screen bg-gradient-secondary p-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Button variant="outline" onClick={backToIntro} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Início
            </Button>
          </div>
          <AssessmentHistory />
        </div>
      </div>
    );
  }

  // Show Google Sheets history
  if (currentStep === 'google-history') {
    return (
      <div className="min-h-screen bg-gradient-secondary p-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Button variant="outline" onClick={backToIntro} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Início
            </Button>
          </div>
          <GoogleSheetsHistory />
        </div>
      </div>
    );
  }

  if (currentStep === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-secondary flex items-center justify-center p-4">
        <Card className="max-w-4xl w-full shadow-strong">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto mb-6 w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent">
              Ferramenta de Diagnóstico Aberto O-SRL
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Avalie a maturidade organizacional da sua empresa e descubra seu potencial de crescimento
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-8">
            {/* O que é O-SRL */}
            <div className="bg-gradient-secondary rounded-xl p-6 border">
              <h3 className="text-xl font-semibold mb-4 text-foreground">
                O que é o Framework O-SRL?
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                O <strong className="text-primary">Organizational Strategic Readiness Level (O-SRL)</strong> é um framework 
                de avaliação de maturidade organizacional que mede a capacidade de uma organização em executar estratégias 
                complexas de forma consistente e previsível.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Baseado em 9 níveis progressivos, o O-SRL avalia desde organizações com processos caóticos e imprevisíveis 
                até aquelas com agilidade estratégica total, passando por estágios de estruturação, padronização, 
                integração e otimização contínua.
              </p>
            </div>

            {/* Os 9 Níveis */}
            <div className="bg-gradient-secondary rounded-xl p-6 border">
              <h3 className="text-xl font-semibold mb-4 text-foreground">
                Os 9 Níveis de Maturidade Organizacional
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-destructive">Níveis Iniciais (1-3)</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div><strong>1. Inicial:</strong> Processos caóticos</div>
                    <div><strong>2. Consciente:</strong> Processos fragmentados</div>
                    <div><strong>3. Estruturado:</strong> Processos repetíveis</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium text-primary">Níveis Intermediários (4-6)</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div><strong>4. Definido:</strong> Processos padronizados</div>
                    <div><strong>5. Integrado:</strong> Processos institucionalizados</div>
                    <div><strong>6. Gerenciado:</strong> Medido quantitativamente</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium text-success">Níveis Avançados (7-9)</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div><strong>7. Preditivo:</strong> Controlado quantitativamente</div>
                    <div><strong>8. Otimizado:</strong> Melhoria contínua</div>
                    <div><strong>9. Adaptativo:</strong> Agilidade estratégica</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Por que Importa */}
            <div className="bg-gradient-secondary rounded-xl p-6 border">
              <h3 className="text-xl font-semibold mb-4 text-foreground">
                Por que a Maturidade Organizacional Importa?
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                O sucesso na execução de estratégias complexas depende de processos robustos. 
                Esta ferramenta avalia a sua capacidade organizacional em dimensões críticas, como ter{' '}
                <strong className="text-primary">processos definidos e documentados</strong>, gerenciar um{' '}
                <strong className="text-primary">Portfólio de Projetos (PPM) alinhado à estratégia</strong>, e sua habilidade em{' '}
                <strong className="text-primary">desenhar, implementar, monitorar e otimizar fluxos de trabalho</strong>{' '}
                para garantir eficiência e transparência. Descubra seu nível de prontidão e os próximos passos para evoluir.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-foreground">O que você receberá:</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                    <span>Diagnóstico instantâneo do seu nível O-SRL (1-9)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                    <span>Análise detalhada dos 7 pilares de maturidade</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                    <span>Recomendações específicas para evolução</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                    <span>Relatório profissional para download</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-foreground">Características da avaliação:</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Badge variant="secondary" className="mt-0.5">28</Badge>
                    <span>perguntas estratégicas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="secondary" className="mt-0.5">7</Badge>
                    <span>pilares de maturidade organizacional</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="secondary" className="mt-0.5">15</Badge>
                    <span>minutos aproximados</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="secondary" className="mt-0.5">100%</Badge>
                    <span>anônimo e gratuito</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="text-center pt-4 space-y-4">
              <div className="flex flex-col gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={startAssessment}
                  className="bg-gradient-primary hover:shadow-medium transition-all duration-300 px-8 py-6 text-lg"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Iniciar Diagnóstico
                </Button>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={showHistory}
                    className="px-8 py-6 text-lg"
                  >
                    <History className="mr-2 h-5 w-5" />
                    Histórico Local
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={showGoogleHistory}
                    className="px-8 py-6 text-lg"
                  >
                    <Target className="mr-2 h-5 w-5" />
                    Resultados Online
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Nenhum cadastro necessário • Resultados instantâneos • Totalmente confidencial
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Assessment interface
  const currentQuestionData = pillarQuestions[currentQuestion];
  const currentPillarData = PILLARS[currentPillar];
  const isFirstQuestion = currentPillar === 0 && currentQuestion === 0;
  const questionNumber = QUESTIONS.findIndex(q => q.id === currentQuestionData?.id) + 1;

  return (
    <div className="min-h-screen bg-gradient-secondary p-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Badge variant="secondary" className="text-sm">
              Pergunta {questionNumber} de {totalQuestions}
            </Badge>
            <Badge variant="outline" className="text-sm">
              {Math.round(progressPercentage)}% Concluído
            </Badge>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Current Pillar Info */}
        {currentQuestion === 0 && (
          <Card className="mb-6 shadow-soft border-primary/20">
            <CardHeader>
              <CardTitle className="text-xl text-primary flex items-center gap-2">
                {currentPillarData?.name}
                <Badge variant="secondary" className="text-xs">
                  Pilar {currentPillar + 1}
                </Badge>
              </CardTitle>
              <CardDescription className="text-base leading-relaxed">
                {currentPillarData?.importance}
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {/* Question Card */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="text-xl leading-relaxed flex items-start gap-2">
              {currentQuestionData?.text}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="w-5 h-5 text-muted-foreground mt-1 flex-shrink-0 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-sm">
                    <p>{currentQuestionData?.context}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-3">
            {currentQuestionData?.options.map((option) => {
              const isSelected = responses[currentQuestionData.id] === option.value;
              return (
                <Button
                  key={option.value}
                  variant={isSelected ? "default" : "outline"}
                  className={`w-full text-left p-6 h-auto justify-start transition-all duration-200 ${
                    isSelected 
                      ? 'bg-gradient-primary shadow-medium border-primary' 
                      : 'hover:bg-secondary/50 hover:border-primary/30'
                  }`}
                  onClick={() => handleResponse(currentQuestionData.id, option.value)}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={isSelected ? "secondary" : "outline"}
                        className={isSelected ? 'bg-white/20 text-white' : ''}
                      >
                        {option.value}
                      </Badge>
                      <span className="font-medium">{option.label}</span>
                    </div>
                    <p className={`text-sm ${isSelected ? 'text-white/90' : 'text-muted-foreground'}`}>
                      {option.description}
                    </p>
                  </div>
                </Button>
              );
            })}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={goToPreviousQuestion}
            disabled={isFirstQuestion}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Anterior
          </Button>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {answeredQuestions > 0 && (
              <span>{answeredQuestions} de {totalQuestions} respondidas</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
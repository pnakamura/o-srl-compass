import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { InfoIcon, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { PILLARS, QUESTIONS, OSRL_LEVELS, calculateOSRLLevel, calculatePillarScores } from '@/data/osrl-framework';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AssessmentResults } from './AssessmentResults';

export function OSRLAssessment() {
  const [currentStep, setCurrentStep] = useState<'intro' | 'assessment' | 'results'>('intro');
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

  if (currentStep === 'results') {
    const osrlLevel = calculateOSRLLevel(responses);
    const pillarScores = calculatePillarScores(responses);
    
    return (
      <AssessmentResults
        osrlLevel={osrlLevel}
        pillarScores={pillarScores}
        onReset={resetAssessment}
      />
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
            <div className="bg-gradient-secondary rounded-xl p-6 border">
              <h3 className="text-xl font-semibold mb-4 text-foreground">
                Por que Processos Maduros Importam?
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

            <div className="text-center pt-4">
              <Button 
                size="lg" 
                onClick={startAssessment}
                className="bg-gradient-primary hover:shadow-medium transition-all duration-300 px-8 py-6 text-lg"
              >
                Iniciar Diagnóstico
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
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
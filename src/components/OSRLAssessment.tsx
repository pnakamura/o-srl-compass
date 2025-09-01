import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { PILLARS, QUESTIONS, calculateOSRLLevel, calculatePillarScores } from '@/data/osrl-framework';
import { AssessmentResults } from './AssessmentResults';
import { AssessmentHistory } from './AssessmentHistory';
import SupabaseHistory from './SupabaseHistory';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, ArrowLeft } from 'lucide-react';

type Step = 'intro' | 'assessment' | 'results' | 'history' | 'supabase-history';

export const OSRLAssessment: React.FC = () => {
  const { user, loading, signOut, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>('intro');
  const [currentPillar, setCurrentPillar] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<string, number>>({});

  // Get current pillar and question data
  const pillarQuestions = QUESTIONS.filter(q => q.pillarId === PILLARS[currentPillar]?.id);
  const currentQuestionData = pillarQuestions[currentQuestion];
  const currentPillarData = PILLARS[currentPillar];
  
  // Calculate progress
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

  const showSupabaseHistory = () => {
    setCurrentStep('supabase-history');
  };

  const backToIntro = () => {
    setCurrentStep('intro');
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (currentStep === 'results') {
    const osrlLevel = calculateOSRLLevel(responses);
    const pillarScores = calculatePillarScores(responses);
    
    return (
      <AssessmentResults
        osrlLevel={osrlLevel}
        pillarScores={pillarScores}
        responses={responses}
        onReset={resetAssessment}
        user={user}
      />
    );
  }

  if (currentStep === 'history') {
    if (!isAuthenticated) {
      return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Card>
            <CardContent className="pt-6 text-center space-y-4">
              <h2 className="text-xl font-semibold">Login Necessário</h2>
              <p className="text-muted-foreground">
                Você precisa estar logado para acessar o histórico de avaliações.
              </p>
              <Button onClick={() => navigate('/auth')} className="bg-gradient-primary">
                Fazer Login
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }
    return <AssessmentHistory onBack={backToIntro} />;
  }

  if (currentStep === 'supabase-history') {
    if (!isAuthenticated) {
      return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Card>
            <CardContent className="pt-6 text-center space-y-4">
              <h2 className="text-xl font-semibold">Login Necessário</h2>
              <p className="text-muted-foreground">
                Você precisa estar logado para acessar o histórico online de avaliações.
              </p>
              <Button onClick={() => navigate('/auth')} className="bg-gradient-primary">
                Fazer Login
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }
    return <SupabaseHistory onBack={backToIntro} />;
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-4xl min-h-screen">
      <TooltipProvider>
        <Card className="mb-8">
          <CardHeader className="text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 px-3 sm:px-6">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
              <div className="flex-1 text-left sm:text-center">
                <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 break-words hyphens-auto">
                  Diagnóstico O-SRL Municipal
                </CardTitle>
                <CardDescription className="text-sm sm:text-base md:text-lg break-words hyphens-auto leading-relaxed">
                  Avalie a maturidade do seu departamento em gestão de projetos e programas públicos complexos
                </CardDescription>
              </div>
              {isAuthenticated && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 self-start sm:self-auto">
                  <span className="text-xs sm:text-sm text-muted-foreground break-all">
                    {user?.email}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSignOut}
                    className="flex items-center gap-2 text-xs sm:text-sm"
                  >
                    <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
                    Sair
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>

          {currentStep === 'intro' && (
            <CardContent className="space-y-6 pt-6">
              <div className="text-center space-y-4">
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground break-words hyphens-auto leading-relaxed">
                  Esta avaliação mede a maturidade do seu departamento em gestão de projetos e programas públicos complexos.
                </p>
                
                <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-left">
                  <div className="space-y-3">
                    <h3 className="font-semibold mb-3 text-base sm:text-lg">O que você receberá:</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span className="break-words hyphens-auto">Nível de maturidade organizacional (1-9)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span className="break-words hyphens-auto">Análise detalhada por pilares</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span className="break-words hyphens-auto">Recomendações personalizadas</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span className="break-words hyphens-auto">Relatório completo para download</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-semibold mb-3 text-base sm:text-lg">Sobre a avaliação:</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span className="break-words hyphens-auto">{totalQuestions} perguntas estratégicas</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span className="break-words hyphens-auto">{PILLARS.length} pilares de maturidade</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span className="break-words hyphens-auto">Aproximadamente 15 minutos</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span className="break-words hyphens-auto">Completamente confidencial</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Button onClick={startAssessment} size="lg" className="flex-1 max-w-xs">
                  Iniciar Avaliação
                </Button>
              </div>
              
              {!isAuthenticated && (
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-3">
                    Para acessar histórico, relatórios e exportação, faça login
                  </p>
                  <Button onClick={() => navigate('/auth')} variant="outline" size="sm">
                    Fazer Login
                  </Button>
                </div>
              )}
              
              {isAuthenticated && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={showHistory} variant="outline" className="flex-1">
                    Ver Histórico Local
                  </Button>
                  <Button onClick={showSupabaseHistory} variant="outline" className="flex-1">
                    Ver Histórico Online
                  </Button>
                </div>
              )}
            </CardContent>
          )}

          {currentStep === 'assessment' && (
            <>
              <CardContent className="space-y-6 pt-6">
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Pergunta {answeredQuestions + 1} de {totalQuestions}</span>
                    <span>{Math.round(progressPercentage)}% concluído</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>

                {/* Current Pillar Info */}
                {currentQuestion === 0 && (
                  <div className="bg-muted/50 p-3 sm:p-4 rounded-lg space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <h3 className="font-semibold text-base sm:text-lg break-words hyphens-auto flex-1">
                        {currentPillarData.name}
                      </h3>
                      <Badge variant="secondary" className="self-start sm:self-center">
                        Pilar {currentPillar + 1}
                      </Badge>
                    </div>
                    <p className="text-sm sm:text-base text-muted-foreground break-words hyphens-auto leading-relaxed">
                      {currentPillarData.description}
                    </p>
                  </div>
                )}

                {/* Question */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <h2 className="text-lg sm:text-xl font-semibold leading-relaxed flex-1 break-words hyphens-auto">
                      {currentQuestionData?.text}
                    </h2>
                     {currentQuestionData?.context && (
                       <Tooltip>
                         <TooltipTrigger className="flex-shrink-0 mt-1">
                           <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs hover:bg-muted/80 transition-colors">?</div>
                         </TooltipTrigger>
                         <TooltipContent side="left" className="max-w-xs sm:max-w-sm">
                           <p className="text-sm break-words">{currentQuestionData.context}</p>
                         </TooltipContent>
                       </Tooltip>
                     )}
                  </div>

                  {/* Options */}
                  <div className="space-y-3">
                    {currentQuestionData?.options.map((option) => {
                      const isSelected = responses[currentQuestionData.id] === option.value;
                      return (
                        <Button
                          key={option.value}
                          variant={isSelected ? "default" : "outline"}
                          className="w-full text-left p-3 sm:p-4 h-auto justify-start whitespace-normal"
                          onClick={() => handleResponse(currentQuestionData.id, option.value)}
                        >
                          <div className="space-y-2 w-full">
                            <div className="flex items-start gap-2 sm:gap-3">
                              <Badge variant={isSelected ? "secondary" : "outline"} className="flex-shrink-0 mt-0.5">
                                {option.value}
                              </Badge>
                              <span className="font-medium text-sm sm:text-base break-words hyphens-auto flex-1">
                                {option.label}
                              </span>
                            </div>
                            {option.description && (
                              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed break-words hyphens-auto pl-8 sm:pl-10">
                                {option.description}
                              </p>
                            )}
                          </div>
                        </Button>
                      );
                    })}
                  </div>

                  {/* Navigation */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-4">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToPreviousQuestion}
                        disabled={currentPillar === 0 && currentQuestion === 0}
                        className="flex items-center gap-2"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Anterior
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={backToIntro}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Voltar ao Início
                      </Button>
                    </div>
                    
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      {answeredQuestions > 0 && (
                        <span>{answeredQuestions} de {totalQuestions} respondidas</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </>
          )}
        </Card>
      </TooltipProvider>
    </div>
  );
};
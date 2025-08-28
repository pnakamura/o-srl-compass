import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { LogOut } from 'lucide-react';

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

  // Check authentication
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/auth');
    }
  }, [loading, isAuthenticated, navigate]);

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

  if (!isAuthenticated) {
    return null;
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
    return <AssessmentHistory />;
  }

  if (currentStep === 'supabase-history') {
    return <SupabaseHistory onBack={backToIntro} />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <TooltipProvider>
        <Card className="mb-8">
          <CardHeader className="text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <CardTitle className="text-3xl font-bold mb-2">
                  Diagnóstico O-SRL Municipal
                </CardTitle>
                <CardDescription className="text-lg">
                  Avalie a maturidade do seu departamento em gestão de projetos e programas públicos complexos
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {user?.email}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </Button>
              </div>
            </div>
          </CardHeader>

          {currentStep === 'intro' && (
            <CardContent className="space-y-6 pt-6">
              <div className="text-center space-y-4">
                <p className="text-lg text-muted-foreground">
                  Esta avaliação mede a maturidade do seu departamento em gestão de projetos e programas públicos complexos.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6 text-left">
                  <div>
                    <h3 className="font-semibold mb-3">O que você receberá:</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Nível de maturidade organizacional (1-5)</li>
                      <li>• Análise detalhada por pilares</li>
                      <li>• Recomendações personalizadas</li>
                      <li>• Relatório completo para download</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3">Sobre a avaliação:</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• {totalQuestions} perguntas estratégicas</li>
                      <li>• {PILLARS.length} pilares de maturidade</li>
                      <li>• Aproximadamente 15 minutos</li>
                      <li>• Completamente confidencial</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Button onClick={startAssessment} size="lg" className="flex-1 max-w-xs">
                  Iniciar Avaliação
                </Button>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={showHistory} variant="outline" className="flex-1">
                  Ver Histórico Local
                </Button>
                <Button onClick={showSupabaseHistory} variant="outline" className="flex-1">
                  Ver Histórico Online
                </Button>
              </div>
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
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">
                      {currentPillarData.name} 
                      <Badge variant="secondary" className="ml-2">
                        Pilar {currentPillar + 1}
                      </Badge>
                    </h3>
                    <p className="text-muted-foreground">
                      {currentPillarData.description}
                    </p>
                  </div>
                )}

                {/* Question */}
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <h2 className="text-xl font-semibold leading-relaxed flex-1">
                      {currentQuestionData?.text}
                    </h2>
                     {currentQuestionData?.context && (
                       <Tooltip>
                         <TooltipTrigger>
                           <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs">?</div>
                         </TooltipTrigger>
                         <TooltipContent side="left" className="max-w-sm">
                           <p>{currentQuestionData.context}</p>
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
                          className="w-full text-left p-4 h-auto justify-start"
                          onClick={() => handleResponse(currentQuestionData.id, option.value)}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Badge variant={isSelected ? "secondary" : "outline"}>
                                {option.value}
                              </Badge>
                              <span className="font-medium">{option.label}</span>
                            </div>
                            {option.description && (
                              <p className="text-sm text-muted-foreground">
                                {option.description}
                              </p>
                            )}
                          </div>
                        </Button>
                      );
                    })}
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between pt-4">
                    <Button
                      variant="outline"
                      onClick={goToPreviousQuestion}
                      disabled={currentPillar === 0 && currentQuestion === 0}
                    >
                      Anterior
                    </Button>
                    
                    <div className="text-sm text-muted-foreground">
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
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { PILLARS, QUESTIONS } from '@/data/osrl-framework';
import { QuestionInsight } from '@/lib/detailedResponseAnalyzer';

interface InteractiveHeatmapProps {
  responses: Record<string, number>;
  questionInsights: QuestionInsight[];
}

export function InteractiveHeatmap({ responses, questionInsights }: InteractiveHeatmapProps) {
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'score' | 'status' | 'urgency' | 'impact'>('score');

  const getHeatmapColor = (questionId: string, mode: string) => {
    const response = responses[questionId] || 1;
    const insight = questionInsights.find(i => i.questionId === questionId);
    
    switch (mode) {
      case 'score':
        if (response <= 1.5) return 'bg-red-500';
        if (response <= 2.5) return 'bg-amber-500';
        if (response <= 3.5) return 'bg-yellow-400';
        if (response <= 4.5) return 'bg-green-400';
        return 'bg-green-500';
      
      case 'status':
        switch (insight?.status) {
          case 'critical': return 'bg-red-500';
          case 'warning': return 'bg-amber-500';
          case 'good': return 'bg-blue-400';
          case 'excellent': return 'bg-green-500';
          default: return 'bg-gray-400';
        }
      
      case 'urgency':
        switch (insight?.urgency) {
          case 'high': return 'bg-red-500';
          case 'medium': return 'bg-amber-500';
          case 'low': return 'bg-green-400';
          default: return 'bg-gray-400';
        }
      
      case 'impact':
        switch (insight?.impact) {
          case 'high': return 'bg-purple-500';
          case 'medium': return 'bg-blue-400';
          case 'low': return 'bg-green-400';
          default: return 'bg-gray-400';
        }
      
      default:
        return 'bg-gray-400';
    }
  };

  const getTextColor = (bgColor: string) => {
    return bgColor.includes('yellow') ? 'text-black' : 'text-white';
  };

  const selectedQuestionData = selectedQuestion ? {
    question: QUESTIONS.find(q => q.id === selectedQuestion),
    response: responses[selectedQuestion],
    insight: questionInsights.find(i => i.questionId === selectedQuestion)
  } : null;

  const getLegend = (mode: string) => {
    switch (mode) {
      case 'score':
        return [
          { color: 'bg-red-500', label: '1.0-1.5', text: 'text-white' },
          { color: 'bg-amber-500', label: '1.6-2.5', text: 'text-white' },
          { color: 'bg-yellow-400', label: '2.6-3.5', text: 'text-black' },
          { color: 'bg-green-400', label: '3.6-4.5', text: 'text-black' },
          { color: 'bg-green-500', label: '4.6-5.0', text: 'text-white' }
        ];
      case 'status':
        return [
          { color: 'bg-red-500', label: 'Crítico', text: 'text-white' },
          { color: 'bg-amber-500', label: 'Atenção', text: 'text-white' },
          { color: 'bg-blue-400', label: 'Bom', text: 'text-white' },
          { color: 'bg-green-500', label: 'Excelente', text: 'text-white' }
        ];
      case 'urgency':
        return [
          { color: 'bg-red-500', label: 'Alta', text: 'text-white' },
          { color: 'bg-amber-500', label: 'Média', text: 'text-white' },
          { color: 'bg-green-400', label: 'Baixa', text: 'text-black' }
        ];
      case 'impact':
        return [
          { color: 'bg-purple-500', label: 'Alto', text: 'text-white' },
          { color: 'bg-blue-400', label: 'Médio', text: 'text-white' },
          { color: 'bg-green-400', label: 'Baixo', text: 'text-black' }
        ];
      default:
        return [];
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Mapa de Calor - Diagnóstico por Questão</CardTitle>
          <CardDescription>
            Visualização interativa de todas as 28 questões organizadas por pilar. 
            Clique em uma questão para ver detalhes específicos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Controles de Visualização */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              variant={viewMode === 'score' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('score')}
            >
              Pontuação
            </Button>
            <Button
              variant={viewMode === 'status' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('status')}
            >
              Status
            </Button>
            <Button
              variant={viewMode === 'urgency' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('urgency')}
            >
              Urgência
            </Button>
            <Button
              variant={viewMode === 'impact' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('impact')}
            >
              Impacto
            </Button>
          </div>

          {/* Legenda */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="text-sm font-medium mr-2">Legenda:</span>
            {getLegend(viewMode).map((item, index) => (
              <div key={index} className="flex items-center gap-1">
                <div className={`w-4 h-4 rounded ${item.color}`}></div>
                <span className="text-xs">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="grid gap-6">
            {PILLARS.map((pillar) => {
              const pillarQuestions = QUESTIONS.filter(q => q.pillarId === pillar.id);
              
              return (
                <div key={pillar.id} className="space-y-3">
                  <h3 className="font-semibold text-base">{pillar.name}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                    {pillarQuestions.map((question) => {
                      const bgColor = getHeatmapColor(question.id, viewMode);
                      const textColor = getTextColor(bgColor);
                      const response = responses[question.id] || 1;
                      const insight = questionInsights.find(i => i.questionId === question.id);
                      
                      return (
                        <TooltipProvider key={question.id}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                className={`${bgColor} ${textColor} p-3 h-auto text-left hover:opacity-80 transition-all ${
                                  selectedQuestion === question.id ? 'ring-2 ring-primary' : ''
                                }`}
                                onClick={() => setSelectedQuestion(
                                  selectedQuestion === question.id ? null : question.id
                                )}
                              >
                                <div className="space-y-1">
                                  <div className="text-xs font-medium">
                                    {question.id.toUpperCase()}
                                  </div>
                                  <div className="text-xs leading-tight">
                                    {question.text.substring(0, 60)}
                                    {question.text.length > 60 ? '...' : ''}
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <Badge 
                                      variant="secondary" 
                                      className="text-xs px-1 py-0 bg-black/20 text-current border-0"
                                    >
                                      {response}/5
                                    </Badge>
                                    {insight?.status === 'critical' && (
                                      <span className="text-xs">🚨</span>
                                    )}
                                  </div>
                                </div>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <div className="space-y-2">
                                <p className="font-medium">{question.text}</p>
                                <p className="text-xs text-muted-foreground">{question.context}</p>
                                <div className="flex gap-2">
                                  <Badge variant="outline">Score: {response}/5</Badge>
                                  {insight && (
                                    <Badge variant="outline">
                                      Status: {insight.status}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Detalhes da Questão Selecionada */}
      {selectedQuestionData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Detalhes da Questão: {selectedQuestionData.question?.id.toUpperCase()}
              <Badge variant="outline">
                {selectedQuestionData.response}/5
              </Badge>
            </CardTitle>
            <CardDescription>
              {selectedQuestionData.question?.text}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Contexto</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedQuestionData.question?.context}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Resposta Selecionada</h4>
                  <div className="space-y-2">
                    {selectedQuestionData.question?.options.map((option) => (
                      <div 
                        key={option.value}
                        className={`p-2 rounded border ${
                          option.value === selectedQuestionData.response 
                            ? 'border-primary bg-primary/10' 
                            : 'border-border'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Badge variant={option.value === selectedQuestionData.response ? 'default' : 'outline'}>
                            {option.value}
                          </Badge>
                          <span className="font-medium">{option.label}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {option.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {selectedQuestionData.insight && (
                  <>
                    <div>
                      <h4 className="font-semibold mb-2">Análise</h4>
                      <div className="flex gap-2 mb-2">
                        <Badge variant={
                          selectedQuestionData.insight.status === 'critical' ? 'destructive' :
                          selectedQuestionData.insight.status === 'warning' ? 'default' :
                          'secondary'
                        }>
                          {selectedQuestionData.insight.status}
                        </Badge>
                        <Badge variant="outline">
                          Urgência: {selectedQuestionData.insight.urgency}
                        </Badge>
                        <Badge variant="outline">
                          Impacto: {selectedQuestionData.insight.impact}
                        </Badge>
                      </div>
                    </div>

                    {selectedQuestionData.insight.specificIssues.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Problemas Identificados</h4>
                        <ul className="space-y-1">
                          {selectedQuestionData.insight.specificIssues.map((issue, index) => (
                            <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-destructive">•</span>
                              {issue}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedQuestionData.insight.specificRecommendations.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Recomendações</h4>
                        <ul className="space-y-1">
                          {selectedQuestionData.insight.specificRecommendations.map((rec, index) => (
                            <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-green-500">•</span>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  AlertTriangle, 
  TrendingUp, 
  Target, 
  Zap, 
  Shield, 
  Users,
  ArrowRight,
  CheckCircle2,
  Clock,
  BarChart3,
  Lightbulb
} from 'lucide-react';
import { AdvancedAnalysisResult, RiskFactor, PredictiveInsight, MaturityGap } from '@/lib/advancedAnalytics';

interface AdvancedInsightsProps {
  analysisResult: AdvancedAnalysisResult;
}

export function AdvancedInsights({ analysisResult }: AdvancedInsightsProps) {
  const { riskFactors, predictiveInsights, benchmarkData, maturityGaps, prioritizationMatrix } = analysisResult;

  const getRiskIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="w-5 h-5 text-destructive" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-warning" />;
      default: return <Shield className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <TrendingUp className="w-5 h-5 text-success" />;
      case 'threat': return <AlertTriangle className="w-5 h-5 text-destructive" />;
      default: return <Lightbulb className="w-5 h-5 text-primary" />;
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'baixo': return 'text-success';
      case 'médio': return 'text-warning';
      case 'alto': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'alto': return 'text-destructive';
      case 'médio': return 'text-warning';
      case 'baixo': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Benchmark Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Comparação com Mercado
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {Math.round(benchmarkData.overallPercentile)}º
              </div>
              <div className="text-sm text-muted-foreground">Percentil Geral</div>
            </div>
            
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-success">
                {Object.values(benchmarkData.pillarPercentiles).filter(p => p > 70).length}
              </div>
              <div className="text-sm text-muted-foreground">Pilares Acima da Média</div>
            </div>
            
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-warning">
                {Object.values(benchmarkData.pillarPercentiles).filter(p => p < 40).length}
              </div>
              <div className="text-sm text-muted-foreground">Pilares Críticos</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Analysis */}
      {riskFactors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Análise de Riscos Organizacionais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {riskFactors.slice(0, 3).map((risk, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    {getRiskIcon(risk.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{risk.title}</h4>
                        <Badge variant={risk.type === 'critical' ? 'destructive' : 'secondary'}>
                          {risk.type === 'critical' ? 'Crítico' : 'Atenção'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{risk.description}</p>
                      
                      <div>
                        <div className="text-sm font-medium mb-2">Ações Recomendadas:</div>
                        <ul className="text-sm space-y-1">
                          {risk.recommendations.slice(0, 2).map((rec, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <ArrowRight className="w-3 h-3 mt-0.5 text-muted-foreground" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Predictive Insights */}
      {predictiveInsights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Insights Preditivos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {predictiveInsights.map((insight, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    {getInsightIcon(insight.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{insight.title}</h4>
                        <Badge variant="outline">{insight.timeframe}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                      
                      <div className="flex items-center gap-4 mb-3">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Confiança: </span>
                          <span className="font-medium">{Math.round(insight.confidence * 100)}%</span>
                        </div>
                        <Progress value={insight.confidence * 100} className="flex-1 max-w-32" />
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium mb-2">Ações Sugeridas:</div>
                        <ul className="text-sm space-y-1">
                          {insight.actions.slice(0, 2).map((action, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle2 className="w-3 h-3 mt-0.5 text-success" />
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Maturity Gap Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Análise de Lacunas de Maturidade
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {maturityGaps.slice(0, 5).map((gap, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{gap.pillar}</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getEffortColor(gap.effort)}>
                      Esforço {gap.effort}
                    </Badge>
                    <Badge variant="outline" className={getImpactColor(gap.impact)}>
                      Impacto {gap.impact}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mb-3">
                  <div className="text-sm text-muted-foreground">
                    Nível atual: <span className="font-medium">{gap.currentLevel}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  <div className="text-sm text-muted-foreground">
                    Próximo nível: <span className="font-medium">{gap.targetLevel}</span>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium mb-2">Ações Prioritárias:</div>
                  <ul className="text-sm space-y-1">
                    {gap.actions.slice(0, 2).map((action, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Target className="w-3 h-3 mt-0.5 text-primary" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Wins */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Quick Wins - Ações de Alto Impacto
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {prioritizationMatrix
              .filter(item => item.quickWin)
              .slice(0, 6)
              .map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{item.action}</div>
                    <div className="text-xs text-muted-foreground">{item.pillar}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      Impacto {item.impact}/5
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Esforço {item.effort}/5
                    </Badge>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
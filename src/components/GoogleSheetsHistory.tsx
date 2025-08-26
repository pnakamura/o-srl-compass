import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  History, 
  Calendar, 
  Target, 
  Mail,
  User,
  Download,
  Eye,
  RefreshCw,
  Search,
  Filter,
  BarChart3,
  Wifi,
  WifiOff,
  Loader2
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { fetchGoogleSheetsData, GoogleSheetsAssessmentData, getDataStatistics } from '@/utils/googleSheetsApi';
import { PILLARS } from '@/data/osrl-framework';

export function GoogleSheetsHistory() {
  const { toast } = useToast();
  const [assessments, setAssessments] = useState<GoogleSheetsAssessmentData[]>([]);
  const [filteredAssessments, setFilteredAssessments] = useState<GoogleSheetsAssessmentData[]>([]);
  const [selectedAssessment, setSelectedAssessment] = useState<GoogleSheetsAssessmentData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [searchEmail, setSearchEmail] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    loadAssessments();
    
    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    applyFilters();
  }, [assessments, searchEmail, levelFilter]);

  const loadAssessments = async () => {
    if (!isOnline) {
      toast({
        title: "Sem Conexão",
        description: "Você está offline. Não é possível carregar dados online.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('🔄 Iniciando carregamento dos dados da Google Sheets...');
      const data = await fetchGoogleSheetsData();
      console.log(`✅ ${data.length} avaliações carregadas com sucesso`);
      
      setAssessments(data);
      
      if (data.length > 0) {
        toast({
          title: "Dados Carregados",
          description: `${data.length} avaliação${data.length !== 1 ? 'ões' : ''} encontrada${data.length !== 1 ? 's' : ''}.`,
        });
        
        // Debug info
        console.log('📊 Dados carregados:', {
          totalAssessments: data.length,
          firstAssessment: data[0],
          pillarScores: data[0]?.pillarScores || {},
          responses: data[0]?.responses || {}
        });
      } else {
        console.log('⚠️ Nenhum dado encontrado na planilha');
        toast({
          title: "Nenhum Dado Encontrado",
          description: "A planilha não contém dados válidos ou está vazia.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error('❌ Erro detalhado ao carregar dados:', error);
      
      let errorMessage = 'Erro desconhecido';
      if (error instanceof Error) {
        errorMessage = error.message;
        console.error('📋 Stack trace:', error.stack);
      }
      
      toast({
        title: "Erro ao Carregar Dados",
        description: `Não foi possível carregar os dados da planilha: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = assessments;
    
    // Filter by email
    if (searchEmail.trim()) {
      filtered = filtered.filter(assessment => 
        assessment.email.toLowerCase().includes(searchEmail.toLowerCase())
      );
    }
    
    // Filter by level
    if (levelFilter !== 'all') {
      const level = parseInt(levelFilter);
      filtered = filtered.filter(assessment => assessment.osrlLevel === level);
    }
    
    setFilteredAssessments(filtered);
  };

  const downloadReport = (assessment: GoogleSheetsAssessmentData) => {
    if (!assessment.reportHtml) {
      toast({
        title: "Relatório Não Disponível",
        description: "Este registro não possui relatório HTML para download.",
        variant: "destructive",
      });
      return;
    }

    const blob = new Blob([assessment.reportHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Relatorio-OSRL-Nivel-${assessment.osrlLevel}-${new Date(assessment.timestamp).toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Relatório Baixado",
      description: "O relatório foi baixado com sucesso.",
    });
  };

  const formatDate = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return timestamp;
    }
  };

  const getLevelColor = (level: number) => {
    if (level <= 3) return 'destructive';
    if (level <= 6) return 'default';
    return 'secondary';
  };

  const stats = getDataStatistics(assessments);

  // Loading state
  if (isLoading) {
    return (
      <Card className="shadow-medium">
        <CardContent className="text-center py-12">
          <Loader2 className="w-8 h-8 text-primary mx-auto mb-4 animate-spin" />
          <h3 className="text-lg font-medium text-foreground mb-2">Carregando Dados Online</h3>
          <p className="text-muted-foreground">
            Buscando avaliações na planilha Google Sheets...
          </p>
        </CardContent>
      </Card>
    );
  }

  // Offline state
  if (!isOnline) {
    return (
      <Card className="shadow-medium">
        <CardContent className="text-center py-8">
          <WifiOff className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Você Está Offline</h3>
          <p className="text-muted-foreground mb-4">
            Conecte-se à internet para visualizar os dados online.
          </p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Tentar Novamente
          </Button>
        </CardContent>
      </Card>
    );
  }

  // No data state
  if (assessments.length === 0) {
    return (
      <Card className="shadow-medium">
        <CardContent className="text-center py-8">
          <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Nenhum Dado Encontrado</h3>
          <p className="text-muted-foreground mb-4">
            Não há avaliações registradas na planilha online ainda.
          </p>
          <Button variant="outline" onClick={loadAssessments}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with stats toggle */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Wifi className="w-6 h-6 text-success" />
              Resultados Online
            </h2>
            <p className="text-muted-foreground">
              {assessments.length} avaliação{assessments.length !== 1 ? 'ões' : ''} na planilha Google Sheets
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowStats(!showStats)}>
            <BarChart3 className="w-4 h-4 mr-2" />
            {showStats ? 'Ocultar' : 'Mostrar'} Estatísticas
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.open(`https://docs.google.com/spreadsheets/d/1mKctTHsgwo1vFaFyggqnkij89q3P1_QUUtZRv2PEks8/pub?output=csv&gid=0`, '_blank')}
          >
            🔗 Testar URL
          </Button>
          <Button variant="outline" size="sm" onClick={loadAssessments}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Statistics */}
      {showStats && (
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Estatísticas Gerais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-primary/5 rounded-lg">
                <div className="text-2xl font-bold text-primary">{stats.totalAssessments}</div>
                <div className="text-sm text-muted-foreground">Total de Avaliações</div>
              </div>
              <div className="p-4 bg-success/5 rounded-lg">
                <div className="text-2xl font-bold text-success">{stats.averageLevel}</div>
                <div className="text-sm text-muted-foreground">Nível Médio O-SRL</div>
              </div>
              <div className="p-4 bg-warning/5 rounded-lg">
                <div className="text-2xl font-bold text-warning">
                  {Object.values(stats.levelDistribution).length}
                </div>
                <div className="text-sm text-muted-foreground">Níveis Diferentes</div>
              </div>
              <div className="p-4 bg-info/5 rounded-lg">
                <div className="text-2xl font-bold text-info">
                  {Object.keys(stats.mostCommonPillarScores).length}
                </div>
                <div className="text-sm text-muted-foreground">Pilares Avaliados</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search-email">Buscar por E-mail</Label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="search-email"
                  placeholder="Digite o e-mail..."
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="level-filter">Filtrar por Nível O-SRL</Label>
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os níveis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os níveis</SelectItem>
                  {Array.from({length: 9}, (_, i) => i + 1).map(level => (
                    <SelectItem key={level} value={level.toString()}>
                      Nível {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="text-sm text-muted-foreground mb-2">
        Mostrando {filteredAssessments.length} de {assessments.length} avaliações
      </div>

      <div className="grid gap-4">
        {filteredAssessments.map((assessment, index) => (
          <Card key={index} className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant={getLevelColor(assessment.osrlLevel) as "default" | "destructive" | "secondary" | "outline"} className="font-bold">
                      O-SRL {assessment.osrlLevel}
                    </Badge>
                    <span className="text-2xl font-bold text-primary">
                      {assessment.overallScore}%
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(assessment.timestamp)}
                    </div>
                    <div className="flex items-center gap-1">
                      {assessment.email === 'anonimo' ? (
                        <>
                          <User className="w-4 h-4" />
                          Anônimo
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4" />
                          {assessment.email}
                        </>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-foreground">Pilares Avaliados</div>
                      <div className="text-muted-foreground">
                        {Object.keys(assessment.pillarScores).length} pilares
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Perguntas Respondidas</div>
                      <div className="text-muted-foreground">
                        {Object.keys(assessment.responses).length} perguntas
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Melhor Pilar</div>
                      <div className="text-muted-foreground">
                        {Object.keys(assessment.pillarScores).length > 0 
                          ? Math.max(...Object.values(assessment.pillarScores)) + '%'
                          : 'N/A'
                        }
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedAssessment(assessment)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Detalhes da Avaliação Online</DialogTitle>
                        <DialogDescription>
                          Avaliação realizada em {formatDate(assessment.timestamp)}
                        </DialogDescription>
                      </DialogHeader>
                      {selectedAssessment && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-4 bg-primary/5 rounded-lg">
                              <div className="text-2xl font-bold text-primary">O-SRL {selectedAssessment.osrlLevel}</div>
                              <div className="text-sm text-muted-foreground">Nível Alcançado</div>
                            </div>
                            <div className="text-center p-4 bg-success/5 rounded-lg">
                              <div className="text-2xl font-bold text-success">{selectedAssessment.overallScore}%</div>
                              <div className="text-sm text-muted-foreground">Pontuação Geral</div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-2">Pontuação por Pilar:</h4>
                            <div className="space-y-2">
                              {Object.entries(selectedAssessment.pillarScores).map(([pillarId, score]) => {
                                const pillar = PILLARS.find(p => p.id === pillarId);
                                return (
                                  <div key={pillarId} className="flex justify-between items-center">
                                    <span className="text-sm">{pillar?.name || `Pilar ${pillarId}`}</span>
                                    <Badge variant="secondary">{score}%</Badge>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          
                          {selectedAssessment.personalizedAnalysis?.description && (
                            <div>
                              <h4 className="font-medium mb-2">Análise Personalizada:</h4>
                              <p className="text-sm text-muted-foreground bg-secondary/20 p-3 rounded">
                                {selectedAssessment.personalizedAnalysis.description}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  
                  {assessment.reportHtml && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => downloadReport(assessment)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAssessments.length === 0 && assessments.length > 0 && (
        <Card className="shadow-medium">
          <CardContent className="text-center py-8">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Nenhum Resultado Encontrado</h3>
            <p className="text-muted-foreground mb-4">
              Tente ajustar os filtros ou limpar a busca.
            </p>
            <Button variant="outline" onClick={() => {
              setSearchEmail('');
              setLevelFilter('all');
            }}>
              Limpar Filtros
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
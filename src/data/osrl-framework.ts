export interface Pillar {
  id: string;
  name: string;
  description: string;
  importance: string;
}

export interface Question {
  id: string;
  pillarId: string;
  text: string;
  context: string;
  options: {
    value: number;
    label: string;
    description: string;
  }[];
}

export interface OSRLLevel {
  level: number;
  name: string;
  description: string;
  characteristics: string[];
  recommendations: string[];
}

export const PILLARS: Pillar[] = [
  {
    id: "governance",
    name: "Governança Estratégica e Liderança",
    description: "Estruturas de tomada de decisão e alinhamento estratégico",
    importance: "Define como a organização direciona recursos e esforços para maximizar o retorno estratégico"
  },
  {
    id: "delivery",
    name: "Entrega de Portfólio, Programas e Projetos",
    description: "Capacidades de execução e gestão de portfólio (PPM)",
    importance: "Determina a eficácia na transformação de estratégias em resultados tangíveis através de processos estruturados"
  },
  {
    id: "benefits",
    name: "Gestão de Benefícios e Realização de Valor",
    description: "Mecanismos de captura e maximização de valor",
    importance: "Garante que investimentos se convertam em benefícios mensuráveis e sustentáveis para a organização"
  },
  {
    id: "financial",
    name: "Gestão Financeira e de Recursos",
    description: "Otimização de recursos e controles financeiros",
    importance: "Estabelece a disciplina financeira necessária para suportar crescimento sustentável e alocação eficiente"
  },
  {
    id: "risk",
    name: "Gestão de Riscos e Resiliência",
    description: "Antecipação e mitigação de ameaças organizacionais",
    importance: "Constrói a capacidade de navegar incertezas e manter continuidade operacional em cenários adversos"
  },
  {
    id: "stakeholders",
    name: "Engajamento de Stakeholders e Comunicações",
    description: "Alinhamento e comunicação com partes interessadas",
    importance: "Facilita a colaboração e o suporte necessários para execução bem-sucedida de iniciativas estratégicas"
  },
  {
    id: "people",
    name: "Pessoas, Cultura e Competência",
    description: "Desenvolvimento humano e cultura organizacional",
    importance: "Desenvolve as capacidades humanas e culturais que sustentam a execução eficaz de processos maduros"
  }
];

export const QUESTIONS: Question[] = [
  // Governança Estratégica e Liderança
  {
    id: "gov1",
    pillarId: "governance",
    text: "Como sua organização toma decisões estratégicas sobre investimentos e prioridades?",
    context: "Avalia se existe um processo estruturado e documentado para decisões estratégicas.",
    options: [
      { value: 1, label: "Ad-hoc", description: "Decisões tomadas caso a caso, sem processo definido" },
      { value: 2, label: "Informal", description: "Algumas práticas existem mas não são documentadas" },
      { value: 3, label: "Básico", description: "Processo básico documentado e seguido ocasionalmente" },
      { value: 4, label: "Estruturado", description: "Processo bem definido, documentado e seguido consistentemente" },
      { value: 5, label: "Otimizado", description: "Processo maduro com melhoria contínua baseada em dados" }
    ]
  },
  {
    id: "gov2",
    pillarId: "governance",
    text: "Qual o nível de alinhamento entre estratégia corporativa e execução operacional?",
    context: "Mede a capacidade de traduzir estratégia em ações operacionais concretas.",
    options: [
      { value: 1, label: "Desconectado", description: "Estratégia e operação funcionam independentemente" },
      { value: 2, label: "Ocasional", description: "Algum alinhamento existe mas é inconsistente" },
      { value: 3, label: "Parcial", description: "Alinhamento claro em algumas áreas da organização" },
      { value: 4, label: "Integrado", description: "Forte alinhamento com mecanismos de tradução estabelecidos" },
      { value: 5, label: "Dinâmico", description: "Alinhamento contínuo com adaptação em tempo real" }
    ]
  },
  {
    id: "gov3",
    pillarId: "governance",
    text: "Como a liderança monitora e comunica o progresso estratégico?",
    context: "Avalia a existência de sistemas de monitoramento e comunicação do progresso estratégico.",
    options: [
      { value: 1, label: "Inexistente", description: "Sem monitoramento formal ou comunicação regular" },
      { value: 2, label: "Básico", description: "Monitoramento esporádico com comunicação limitada" },
      { value: 3, label: "Regular", description: "Relatórios periódicos e comunicação estruturada" },
      { value: 4, label: "Sistemático", description: "Dashboards em tempo real e comunicação proativa" },
      { value: 5, label: "Integrado", description: "Inteligência estratégica contínua com feedback loops" }
    ]
  },
  {
    id: "gov4",
    pillarId: "governance",
    text: "Qual o grau de maturidade dos processos de governança da sua organização?",
    context: "Verifica se existem processos de governança documentados, implementados e otimizados.",
    options: [
      { value: 1, label: "Inicial", description: "Processos inexistentes ou completamente ad-hoc" },
      { value: 2, label: "Emergente", description: "Alguns processos básicos começando a ser definidos" },
      { value: 3, label: "Definido", description: "Processos documentados e parcialmente implementados" },
      { value: 4, label: "Gerenciado", description: "Processos implementados com métricas e controles" },
      { value: 5, label: "Otimizado", description: "Processos maduros com melhoria contínua" }
    ]
  },
  
  // Entrega de Portfólio, Programas e Projetos
  {
    id: "del1",
    pillarId: "delivery",
    text: "Sua organização possui uma metodologia estruturada para Gestão de Portfólio de Projetos (PPM)?",
    context: "Avalia se existe um sistema formal de PPM para alinhar projetos à estratégia organizacional.",
    options: [
      { value: 1, label: "Inexistente", description: "Projetos gerenciados individualmente sem coordenação" },
      { value: 2, label: "Básica", description: "Lista de projetos com alguma priorização informal" },
      { value: 3, label: "Estruturada", description: "PPM básico com critérios de priorização definidos" },
      { value: 4, label: "Integrada", description: "PPM maduro integrado ao planejamento estratégico" },
      { value: 5, label: "Otimizada", description: "PPM dinâmico com otimização contínua de portfólio" }
    ]
  },
  {
    id: "del2",
    pillarId: "delivery",
    text: "Como são definidas e documentadas as metodologias de entrega de projetos?",
    context: "Verifica se existem processos padronizados e documentados para execução de projetos.",
    options: [
      { value: 1, label: "Inexistente", description: "Cada projeto segue abordagem própria sem padronização" },
      { value: 2, label: "Informal", description: "Algumas práticas comuns mas não documentadas" },
      { value: 3, label: "Padronizada", description: "Metodologia básica documentada e utilizada" },
      { value: 4, label: "Matura", description: "Metodologia robusta com templates e ferramentas" },
      { value: 5, label: "Adaptativa", description: "Metodologia flexível que se adapta ao contexto do projeto" }
    ]
  },
  {
    id: "del3",
    pillarId: "delivery",
    text: "Qual o nível de integração entre diferentes projetos e programas na organização?",
    context: "Mede a capacidade de coordenar projetos interdependentes e maximizar sinergias.",
    options: [
      { value: 1, label: "Isolado", description: "Projetos executados independentemente sem coordenação" },
      { value: 2, label: "Ocasional", description: "Alguma coordenação quando conflitos surgem" },
      { value: 3, label: "Planejado", description: "Coordenação planejada com identificação de dependências" },
      { value: 4, label: "Integrado", description: "Forte integração com gestão ativa de interdependências" },
      { value: 5, label: "Otimizado", description: "Sinergia máxima com otimização contínua do portfólio" }
    ]
  },
  {
    id: "del4",
    pillarId: "delivery",
    text: "Como é feito o monitoramento e controle da entrega de valor dos projetos?",
    context: "Avalia se existe acompanhamento sistemático do progresso e entrega de valor.",
    options: [
      { value: 1, label: "Inexistente", description: "Sem monitoramento formal de progresso ou valor" },
      { value: 2, label: "Básico", description: "Relatórios ocasionais de status sem métricas claras" },
      { value: 3, label: "Regular", description: "Monitoramento periódico com métricas básicas" },
      { value: 4, label: "Sistemático", description: "Dashboard em tempo real com métricas de valor" },
      { value: 5, label: "Preditivo", description: "Análise preditiva e otimização contínua" }
    ]
  },

  // Gestão de Benefícios e Realização de Valor
  {
    id: "ben1",
    pillarId: "benefits",
    text: "Como sua organização identifica e quantifica benefícios esperados de iniciativas?",
    context: "Verifica se existe processo estruturado para definir e medir benefícios antes da execução.",
    options: [
      { value: 1, label: "Inexistente", description: "Benefícios não são formalmente identificados ou quantificados" },
      { value: 2, label: "Informal", description: "Benefícios estimados informalmente sem documentação" },
      { value: 3, label: "Básico", description: "Processo básico de identificação e documentação de benefícios" },
      { value: 4, label: "Estruturado", description: "Metodologia robusta com métricas claras e baselines" },
      { value: 5, label: "Otimizado", description: "Sistema integrado de gestão de valor com otimização contínua" }
    ]
  },
  {
    id: "ben2",
    pillarId: "benefits",
    text: "Qual o nível de rastreamento da realização efetiva de benefícios pós-implementação?",
    context: "Mede se benefícios prometidos são efetivamente monitorados e realizados após projetos.",
    options: [
      { value: 1, label: "Inexistente", description: "Nenhum acompanhamento de benefícios após conclusão" },
      { value: 2, label: "Esporádico", description: "Verificação ocasional e informal de alguns benefícios" },
      { value: 3, label: "Periódico", description: "Acompanhamento regular com relatórios estruturados" },
      { value: 4, label: "Sistemático", description: "Monitoramento contínuo integrado à gestão operacional" },
      { value: 5, label: "Otimizado", description: "Sistema de inteligência de benefícios com ações corretivas automáticas" }
    ]
  },
  {
    id: "ben3",
    pillarId: "benefits",
    text: "Como são gerenciadas as dependências organizacionais para realização de benefícios?",
    context: "Avalia se mudanças organizacionais necessárias para capturar benefícios são adequadamente gerenciadas.",
    options: [
      { value: 1, label: "Ignoradas", description: "Mudanças organizacionais não são consideradas sistematicamente" },
      { value: 2, label: "Reativas", description: "Mudanças abordadas quando problemas surgem" },
      { value: 3, label: "Planejadas", description: "Mudanças organizacionais identificadas e planejadas" },
      { value: 4, label: "Gerenciadas", description: "Gestão ativa de mudanças com suporte dedicado" },
      { value: 5, label: "Integradas", description: "Mudança organizacional totalmente integrada à entrega de valor" }
    ]
  },
  {
    id: "ben4",
    pillarId: "benefits",
    text: "Qual o grau de otimização contínua na captura de valor organizacional?",
    context: "Verifica se existe melhoria contínua nos processos de realização de benefícios.",
    options: [
      { value: 1, label: "Inexistente", description: "Nenhuma otimização ou melhoria nos processos de valor" },
      { value: 2, label: "Ocasional", description: "Melhorias esporádicas quando problemas são identificados" },
      { value: 3, label: "Planejada", description: "Ciclos regulares de revisão e melhoria" },
      { value: 4, label: "Sistemática", description: "Otimização contínua baseada em dados e métricas" },
      { value: 5, label: "Adaptativa", description: "Sistema auto-otimizante com inteligência artificial" }
    ]
  },

  // Gestão Financeira e de Recursos
  {
    id: "fin1",
    pillarId: "financial",
    text: "Como é realizado o planejamento e controle orçamentário de iniciativas estratégicas?",
    context: "Avalia a maturidade dos processos de planejamento financeiro e controle orçamentário.",
    options: [
      { value: 1, label: "Inexistente", description: "Sem planejamento financeiro formal ou controle orçamentário" },
      { value: 2, label: "Básico", description: "Orçamentos simples com controle limitado" },
      { value: 3, label: "Estruturado", description: "Planejamento orçamentário com acompanhamento regular" },
      { value: 4, label: "Integrado", description: "Gestão financeira integrada com planejamento estratégico" },
      { value: 5, label: "Otimizado", description: "Sistema financeiro dinâmico com otimização de recursos em tempo real" }
    ]
  },
  {
    id: "fin2",
    pillarId: "financial",
    text: "Qual o nível de transparência e governança nos processos financeiros?",
    context: "Mede se existem controles adequados e transparência na gestão de recursos financeiros.",
    options: [
      { value: 1, label: "Opaco", description: "Processos financeiros com pouca transparência ou controles" },
      { value: 2, label: "Limitado", description: "Controles básicos com transparência restrita" },
      { value: 3, label: "Adequado", description: "Controles estabelecidos com relatórios regulares" },
      { value: 4, label: "Robusto", description: "Sistema de governança financeira maduro e transparente" },
      { value: 5, label: "Exemplar", description: "Governança financeira de classe mundial com auditoria contínua" }
    ]
  },
  {
    id: "fin3",
    pillarId: "financial",
    text: "Como é feita a otimização da alocação de recursos entre diferentes iniciativas?",
    context: "Verifica se existe processo estruturado para otimizar o uso de recursos organizacionais.",
    options: [
      { value: 1, label: "Ad-hoc", description: "Alocação baseada em disponibilidade sem otimização" },
      { value: 2, label: "Simples", description: "Critérios básicos de alocação com pouca análise" },
      { value: 3, label: "Criteriosa", description: "Processo estruturado com critérios claros de alocação" },
      { value: 4, label: "Otimizada", description: "Otimização sistemática baseada em retorno e prioridades" },
      { value: 5, label: "Dinâmica", description: "Alocação dinâmica com rebalanceamento contínuo" }
    ]
  },
  {
    id: "fin4",
    pillarId: "financial",
    text: "Qual o grau de integração entre gestão financeira e entrega de valor?",
    context: "Avalia se decisões financeiras estão alinhadas com objetivos de criação de valor.",
    options: [
      { value: 1, label: "Desconectado", description: "Gestão financeira independente dos objetivos de valor" },
      { value: 2, label: "Básico", description: "Alguma consideração de valor nas decisões financeiras" },
      { value: 3, label: "Alinhado", description: "Decisões financeiras consideram impacto no valor" },
      { value: 4, label: "Integrado", description: "Gestão financeira totalmente alinhada à estratégia de valor" },
      { value: 5, label: "Otimizado", description: "Sistema integrado que maximiza valor através de decisões financeiras" }
    ]
  },

  // Gestão de Riscos e Resiliência
  {
    id: "risk1",
    pillarId: "risk",
    text: "Como sua organização identifica e avalia riscos estratégicos e operacionais?",
    context: "Verifica se existe processo sistemático de identificação e avaliação de riscos.",
    options: [
      { value: 1, label: "Inexistente", description: "Sem processo formal de identificação ou avaliação de riscos" },
      { value: 2, label: "Reativo", description: "Riscos identificados apenas quando se materializam" },
      { value: 3, label: "Básico", description: "Processo básico de identificação com avaliação periódica" },
      { value: 4, label: "Sistemático", description: "Framework robusto de gestão de riscos bem implementado" },
      { value: 5, label: "Preditivo", description: "Sistema avançado com análise preditiva e cenários" }
    ]
  },
  {
    id: "risk2",
    pillarId: "risk",
    text: "Qual o nível de preparação para continuidade de negócios e resposta a crises?",
    context: "Mede a capacidade organizacional de manter operações durante eventos adversos.",
    options: [
      { value: 1, label: "Inexistente", description: "Sem planos de contingência ou preparação para crises" },
      { value: 2, label: "Básico", description: "Alguns planos básicos para cenários mais óbvios" },
      { value: 3, label: "Estruturado", description: "Planos de continuidade documentados e testados ocasionalmente" },
      { value: 4, label: "Robusto", description: "Sistema maduro de continuidade com testes regulares" },
      { value: 5, label: "Resiliente", description: "Organização altamente resiliente com capacidade adaptativa" }
    ]
  },
  {
    id: "risk3",
    pillarId: "risk",
    text: "Como são implementadas e monitoradas as estratégias de mitigação de riscos?",
    context: "Avalia se ações de mitigação são efetivamente implementadas e acompanhadas.",
    options: [
      { value: 1, label: "Inexistente", description: "Sem estratégias formais de mitigação" },
      { value: 2, label: "Ad-hoc", description: "Ações de mitigação implementadas caso a caso" },
      { value: 3, label: "Planejadas", description: "Estratégias definidas com implementação básica" },
      { value: 4, label: "Sistemáticas", description: "Implementação sistemática com monitoramento regular" },
      { value: 5, label: "Adaptativas", description: "Sistema dinâmico de mitigação com ajustes contínuos" }
    ]
  },
  {
    id: "risk4",
    pillarId: "risk",
    text: "Qual o grau de integração da gestão de riscos com o planejamento estratégico?",
    context: "Verifica se considerações de risco estão integradas ao processo de tomada de decisão estratégica.",
    options: [
      { value: 1, label: "Desconectado", description: "Gestão de riscos separada do planejamento estratégico" },
      { value: 2, label: "Ocasional", description: "Riscos considerados esporadicamente nas decisões" },
      { value: 3, label: "Incorporado", description: "Riscos regularmente considerados no planejamento" },
      { value: 4, label: "Integrado", description: "Gestão de riscos totalmente integrada à estratégia" },
      { value: 5, label: "Otimizado", description: "Decisões estratégicas otimizadas considerando perfil de risco" }
    ]
  },

  // Engajamento de Stakeholders e Comunicações
  {
    id: "stake1",
    pillarId: "stakeholders",
    text: "Como sua organização identifica e engaja stakeholders críticos?",
    context: "Avalia se existe processo estruturado para mapear e engajar partes interessadas.",
    options: [
      { value: 1, label: "Inexistente", description: "Sem mapeamento formal ou estratégia de engajamento" },
      { value: 2, label: "Básico", description: "Identificação básica com engajamento esporádico" },
      { value: 3, label: "Estruturado", description: "Mapeamento sistemático com planos de engajamento" },
      { value: 4, label: "Estratégico", description: "Gestão sofisticada de stakeholders com segmentação" },
      { value: 5, label: "Dinâmico", description: "Eco-sistema de stakeholders auto-organizativo" }
    ]
  },
  {
    id: "stake2",
    pillarId: "stakeholders",
    text: "Qual a eficácia dos canais e processos de comunicação organizacional?",
    context: "Mede se informações fluem adequadamente entre diferentes níveis e áreas da organização.",
    options: [
      { value: 1, label: "Deficiente", description: "Comunicação fragmentada com muitos ruídos e gaps" },
      { value: 2, label: "Limitada", description: "Canais básicos com comunicação ocasional" },
      { value: 3, label: "Adequada", description: "Canais estabelecidos com comunicação regular" },
      { value: 4, label: "Eficaz", description: "Sistema de comunicação maduro e multi-direcional" },
      { value: 5, label: "Otimizada", description: "Comunicação inteligente e personalizada por stakeholder" }
    ]
  },
  {
    id: "stake3",
    pillarId: "stakeholders",
    text: "Como é gerenciado o feedback e as expectativas dos stakeholders?",
    context: "Verifica se existe processo para capturar e responder ao feedback das partes interessadas.",
    options: [
      { value: 1, label: "Inexistente", description: "Sem mecanismos formais de feedback ou gestão de expectativas" },
      { value: 2, label: "Reativo", description: "Feedback coletado apenas quando problemas surgem" },
      { value: 3, label: "Periódico", description: "Coleta regular de feedback com algumas ações de resposta" },
      { value: 4, label: "Proativo", description: "Gestão ativa de expectativas com feedback loops estruturados" },
      { value: 5, label: "Colaborativo", description: "Stakeholders co-criam soluções através de feedback contínuo" }
    ]
  },
  {
    id: "stake4",
    pillarId: "stakeholders",
    text: "Qual o nível de transparência e prestação de contas para stakeholders?",
    context: "Avalia se a organização mantém transparência adequada e presta contas aos stakeholders.",
    options: [
      { value: 1, label: "Opaca", description: "Pouca ou nenhuma transparência nas operações e decisões" },
      { value: 2, label: "Limitada", description: "Transparência básica apenas quando solicitada" },
      { value: 3, label: "Regular", description: "Relatórios periódicos e comunicações estruturadas" },
      { value: 4, label: "Proativa", description: "Transparência proativa com múltiplos canais de informação" },
      { value: 5, label: "Exemplar", description: "Transparência total com dashboards em tempo real" }
    ]
  },

  // Pessoas, Cultura e Competência
  {
    id: "people1",
    pillarId: "people",
    text: "Como sua organização desenvolve competências críticas para execução estratégica?",
    context: "Verifica se existe programa estruturado de desenvolvimento de competências alinhado à estratégia.",
    options: [
      { value: 1, label: "Ad-hoc", description: "Desenvolvimento esporádico sem alinhamento estratégico" },
      { value: 2, label: "Básico", description: "Programas básicos de treinamento com foco técnico" },
      { value: 3, label: "Estruturado", description: "Plano de desenvolvimento alinhado às necessidades organizacionais" },
      { value: 4, label: "Estratégico", description: "Desenvolvimento integrado à estratégia com trilhas claras" },
      { value: 5, label: "Adaptativo", description: "Sistema de desenvolvimento contínuo e personalizado" }
    ]
  },
  {
    id: "people2",
    pillarId: "people",
    text: "Qual o grau de colaboração e integração entre equipes e departamentos?",
    context: "Mede se existem mecanismos efetivos para quebrar silos e promover colaboração.",
    options: [
      { value: 1, label: "Silos", description: "Equipes trabalham isoladamente com pouca colaboração" },
      { value: 2, label: "Ocasional", description: "Colaboração acontece esporadicamente quando necessário" },
      { value: 3, label: "Estruturada", description: "Mecanismos formais de colaboração estabelecidos" },
      { value: 4, label: "Integrada", description: "Cultura de colaboração com estruturas de suporte maduras" },
      { value: 5, label: "Sinérgica", description: "Colaboração natural e auto-organizativa maximizando sinergia" }
    ]
  },
  {
    id: "people3",
    pillarId: "people",
    text: "Como é promovida a cultura de compartilhamento de conhecimento na organização?",
    context: "Avalia se existem práticas e sistemas para capturar, organizar e compartilhar conhecimento organizacional.",
    options: [
      { value: 1, label: "Inexistente", description: "Conhecimento permanece com indivíduos sem compartilhamento" },
      { value: 2, label: "Informal", description: "Compartilhamento ocasional através de conversas informais" },
      { value: 3, label: "Estruturado", description: "Sistemas básicos de gestão do conhecimento implementados" },
      { value: 4, label: "Cultivado", description: "Cultura forte de compartilhamento com práticas estabelecidas" },
      { value: 5, label: "Inteligente", description: "Sistema inteligente de conhecimento com aprendizado contínuo" }
    ]
  },
  {
    id: "people4",
    pillarId: "people",
    text: "Qual o nível de adaptabilidade cultural para mudanças e inovação?",
    context: "Mede a capacidade cultural da organização para abraçar mudanças e fomentar inovação.",
    options: [
      { value: 1, label: "Resistente", description: "Cultura resistente a mudanças com foco no status quo" },
      { value: 2, label: "Cautelosa", description: "Mudanças aceitas com relutância e processo lento" },
      { value: 3, label: "Receptiva", description: "Cultura aberta a mudanças quando bem justificadas" },
      { value: 4, label: "Proativa", description: "Cultura que busca ativamente melhorias e inovação" },
      { value: 5, label: "Transformadora", description: "Cultura de inovação contínua e adaptação natural" }
    ]
  }
];

export const OSRL_LEVELS: OSRLLevel[] = [
  {
    level: 1,
    name: "Inicial - Processos Ad Hoc",
    description: "Organização com processos imprevisíveis, mal controlados e reativos.",
    characteristics: [
      "Processos não documentados ou inexistentes",
      "Decisões tomadas de forma reativa e ad-hoc", 
      "Falta de visibilidade sobre progresso e resultados",
      "Silos organizacionais com pouca colaboração"
    ],
    recommendations: [
      "Documentar processos críticos existentes",
      "Estabelecer métricas básicas de acompanhamento",
      "Criar estrutura mínima de governança",
      "Implementar comunicação regular entre equipes"
    ]
  },
  {
    level: 2,
    name: "Repetível - Processos Básicos",
    description: "Organização com alguns processos básicos repetíveis, mas ainda inconsistentes.",
    characteristics: [
      "Alguns processos documentados e seguidos ocasionalmente",
      "Controles básicos de projeto implementados",
      "Sucessos podem ser repetidos em projetos similares",
      "Disciplina de processo em desenvolvimento"
    ],
    recommendations: [
      "Padronizar processos existentes",
      "Treinar equipes nos processos definidos",
      "Estabelecer templates e ferramentas básicas",
      "Criar métricas de qualidade e prazo"
    ]
  },
  {
    level: 3,
    name: "Definido - Processos Padronizados",
    description: "Organização com processos documentados, padronizados e compreendidos.",
    characteristics: [
      "Processos organizacionais bem definidos",
      "Projetos adaptam processos padrão às suas necessidades",
      "Treinamento formal em processos organizacionais",
      "Coleta consistente de dados de processo"
    ],
    recommendations: [
      "Implementar gestão de portfólio básica",
      "Estabelecer framework de governança integrado",
      "Desenvolver competências em gestão de mudança",
      "Criar sistema de lições aprendidas"
    ]
  },
  {
    level: 4,
    name: "Gerenciado - Processos Controlados",
    description: "Organização com processos quantitativamente medidos e controlados.",
    characteristics: [
      "Métricas detalhadas coletadas sobre processos",
      "Qualidade e performance de processo quantificadas",
      "Processos estáveis e previsíveis",
      "Gestão baseada em dados objetivos"
    ],
    recommendations: [
      "Implementar PPM (Project Portfolio Management) robusto",
      "Desenvolver capacidades de análise preditiva",
      "Integrar sistemas de gestão de valor",
      "Estabelecer centros de excelência"
    ]
  },
  {
    level: 5,
    name: "Otimizado - Melhoria Contínua",
    description: "Organização focada na melhoria contínua de processos através de inovação.",
    characteristics: [
      "Melhoria contínua através de feedback e inovação",
      "Processos otimizados para eficiência máxima",
      "Prevenção de defeitos e problemas",
      "Tecnologia utilizada para automação"
    ],
    recommendations: [
      "Implementar automação inteligente de processos",
      "Desenvolver capacidades de transformação digital",
      "Estabelecer cultura de inovação sistemática",
      "Criar parcerias estratégicas para co-inovação"
    ]
  },
  {
    level: 6,
    name: "Integrado - Ecosistema Colaborativo",
    description: "Organização com processos totalmente integrados e colaborativos.",
    characteristics: [
      "Processos integrados end-to-end",
      "Colaboração seamless entre todas as áreas",
      "Stakeholders engajados como parceiros",
      "Gestão holística de valor organizacional"
    ],
    recommendations: [
      "Desenvolver capacidades de orquestração de ecossistema",
      "Implementar inteligência artificial para otimização",
      "Criar plataformas de co-criação com stakeholders",
      "Estabelecer governança de rede distribuída"
    ]
  },
  {
    level: 7,
    name: "Inteligente - Processos Cognitivos",
    description: "Organização com processos aumentados por inteligência artificial e machine learning.",
    characteristics: [
      "IA e ML integrados aos processos de decisão",
      "Processos auto-otimizantes",
      "Análise preditiva sistemática",
      "Automação inteligente generalizada"
    ],
    recommendations: [
      "Expandir capacidades de IA para todos os processos",
      "Desenvolver sistemas de aprendizado organizacional",
      "Criar digital twins organizacionais",
      "Implementar processos autônomos avançados"
    ]
  },
  {
    level: 8,
    name: "Autônomo - Sistemas Auto-Geridos",
    description: "Organização com sistemas largamente autônomos e auto-geridos.",
    characteristics: [
      "Sistemas auto-organizativos",
      "Tomada de decisão distribuída e inteligente",
      "Adaptação automática a mudanças",
      "Minimal human intervention requerida"
    ],
    recommendations: [
      "Desenvolver governança para sistemas autônomos",
      "Criar safeguards e controles éticos",
      "Estabelecer supervisão humana estratégica",
      "Preparar para transformação do papel humano"
    ]
  },
  {
    level: 9,
    name: "Adaptativo - Organização Viva",
    description: "Organização que evolui continuamente como um organismo vivo adaptativo.",
    characteristics: [
      "Evolução contínua e emergente",
      "Capacidade de auto-transformação",
      "Resiliência e antifragilidade sistêmica",
      "Simbiose perfeita humano-máquina"
    ],
    recommendations: [
      "Focar em propósito e valores transcendentes",
      "Desenvolver capacidades de regeneração sistêmica",
      "Criar impacto positivo no ecossistema",
      "Liderar transformação setorial e social"
    ]
  }
];

export function calculateOSRLLevel(responses: Record<string, number>): number {
  const totalScore = Object.values(responses).reduce((sum, score) => sum + score, 0);
  const averageScore = totalScore / Object.keys(responses).length;
  
  // Map average score (1-5) to O-SRL level (1-9)
  if (averageScore <= 1.5) return 1;
  if (averageScore <= 2.0) return 2;
  if (averageScore <= 2.5) return 3;
  if (averageScore <= 3.0) return 4;
  if (averageScore <= 3.5) return 5;
  if (averageScore <= 4.0) return 6;
  if (averageScore <= 4.2) return 7;
  if (averageScore <= 4.6) return 8;
  return 9;
}

export function calculatePillarScores(responses: Record<string, number>): Record<string, number> {
  const pillarScores: Record<string, number> = {};
  
  PILLARS.forEach(pillar => {
    const pillarQuestions = QUESTIONS.filter(q => q.pillarId === pillar.id);
    const pillarResponses = pillarQuestions
      .map(q => responses[q.id])
      .filter(response => response !== undefined);
    
    if (pillarResponses.length > 0) {
      const average = pillarResponses.reduce((sum, score) => sum + score, 0) / pillarResponses.length;
      pillarScores[pillar.id] = Math.round(average * 20); // Convert to 0-100 scale
    }
  });
  
  return pillarScores;
}
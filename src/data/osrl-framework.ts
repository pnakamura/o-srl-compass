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
    name: "Governança Pública e Liderança Institucional",
    description: "Processos de tomada de decisão transparentes e accountability público",
    importance: "Define como o departamento direciona recursos públicos e esforços para maximizar o impacto social e valor público"
  },
  {
    id: "delivery",
    name: "Gestão de Portfólio de Projetos e Programas Públicos",
    description: "Metodologias estruturadas para PPM no setor público e integração intersetorial",
    importance: "Determina a eficácia na transformação de políticas públicas em resultados tangíveis para cidadãos através de processos estruturados"
  },
  {
    id: "benefits",
    name: "Gestão de Benefícios e Realização de Valor Público",
    description: "Identificação e sistematização de impacto social e boas práticas",
    importance: "Garante que investimentos públicos se convertam em benefícios mensuráveis e sustentáveis para a população"
  },
  {
    id: "financial",
    name: "Gestão Orçamentária e de Recursos Públicos",
    description: "Otimização de recursos públicos e transparência nos processos de aquisição",
    importance: "Estabelece a disciplina orçamentária necessária para eficiência no gasto público e alocação otimizada entre iniciativas"
  },
  {
    id: "risk",
    name: "Gestão de Riscos Institucionais e Continuidade de Serviços",
    description: "Antecipação de riscos específicos do setor público e manutenção de serviços essenciais",
    importance: "Constrói a capacidade de manter continuidade de serviços públicos em cenários adversos e preservar credibilidade institucional"
  },
  {
    id: "stakeholders",
    name: "Comunicação Interna e Engajamento de Stakeholders",
    description: "Integração entre departamentos e comunicação transparente com cidadãos",
    importance: "Facilita a colaboração intersetorial e o engajamento necessários para execução bem-sucedida de políticas públicas"
  },
  {
    id: "people",
    name: "Pessoas, Cultura de Serviço Público e Competências",
    description: "Desenvolvimento de competências em gestão pública e cultura de servir ao cidadão",
    importance: "Desenvolve as capacidades humanas e culturais que sustentam a execução eficaz de processos maduros de gestão pública"
  }
];

export const QUESTIONS: Question[] = [
  // Governança Pública e Liderança Institucional
  {
    id: "gov1",
    pillarId: "governance",
    text: "Como o departamento toma decisões sobre priorização de obras públicas, consultorias e políticas?",
    context: "Avalia se existe processo transparente e documentado para decisões públicas com accountability.",
    options: [
      { value: 1, label: "Ad-hoc", description: "Decisões tomadas caso a caso, sem critérios ou transparência" },
      { value: 2, label: "Informal", description: "Alguns critérios existem mas não são documentados ou públicos" },
      { value: 3, label: "Básico", description: "Critérios básicos documentados com transparência limitada" },
      { value: 4, label: "Estruturado", description: "Processo transparente, documentado e com prestação de contas" },
      { value: 5, label: "Otimizado", description: "Processo maduro com participação cidadã e melhoria contínua" }
    ]
  },
  {
    id: "gov2",
    pillarId: "governance",
    text: "Qual o nível de alinhamento entre políticas públicas e execução operacional no departamento?",
    context: "Mede a capacidade de traduzir diretrizes municipais em ações concretas para cidadãos.",
    options: [
      { value: 1, label: "Desconectado", description: "Políticas públicas e operação funcionam independentemente" },
      { value: 2, label: "Ocasional", description: "Algum alinhamento existe mas é inconsistente" },
      { value: 3, label: "Parcial", description: "Alinhamento claro em algumas áreas do departamento" },
      { value: 4, label: "Integrado", description: "Forte alinhamento com mecanismos de tradução estabelecidos" },
      { value: 5, label: "Dinâmico", description: "Alinhamento contínuo com adaptação às demandas cidadãs" }
    ]
  },
  {
    id: "gov3",
    pillarId: "governance",
    text: "Como a liderança monitora e comunica o progresso de projetos para gestores e cidadãos?",
    context: "Avalia sistemas de monitoramento e comunicação transparente do progresso público.",
    options: [
      { value: 1, label: "Inexistente", description: "Sem monitoramento formal ou comunicação regular" },
      { value: 2, label: "Básico", description: "Monitoramento esporádico com comunicação limitada" },
      { value: 3, label: "Regular", description: "Relatórios periódicos e comunicação estruturada" },
      { value: 4, label: "Sistemático", description: "Portais de transparência em tempo real e comunicação proativa" },
      { value: 5, label: "Integrado", description: "Inteligência pública contínua com feedback cidadão" }
    ]
  },
  {
    id: "gov4",
    pillarId: "governance",
    text: "Qual o grau de maturidade dos processos de governança pública do departamento?",
    context: "Verifica conformidade legal, controles internos e prestação de contas.",
    options: [
      { value: 1, label: "Inicial", description: "Processos administrativos inconsistentes, conformidade mínima" },
      { value: 2, label: "Emergente", description: "Alguns processos básicos, conformidade parcial" },
      { value: 3, label: "Definido", description: "Processos documentados, conformidade adequada" },
      { value: 4, label: "Gerenciado", description: "Processos controlados com métricas e auditoria" },
      { value: 5, label: "Otimizado", description: "Governança madura com transparência exemplar" }
    ]
  },
  
  // Gestão de Portfólio de Projetos e Programas Públicos
  {
    id: "del1",
    pillarId: "delivery",
    text: "O departamento possui metodologia estruturada para gestão de portfólio de projetos públicos?",
    context: "Avalia se existe sistema formal de PPM para coordenar obras, consultorias e estudos.",
    options: [
      { value: 1, label: "Inexistente", description: "Projetos gerenciados individualmente sem coordenação entre setores" },
      { value: 2, label: "Básica", description: "Lista de projetos com priorização informal entre coordenações" },
      { value: 3, label: "Estruturada", description: "PPM básico com critérios para obras e consultorias públicas" },
      { value: 4, label: "Integrada", description: "PPM maduro integrado ao planejamento municipal" },
      { value: 5, label: "Otimizada", description: "PPM dinâmico com otimização baseada em impacto social" }
    ]
  },
  {
    id: "del2",
    pillarId: "delivery",
    text: "Como são documentadas as metodologias para execução de obras e consultorias públicas?",
    context: "Verifica se existem processos padronizados para licitações, contratos e entregas.",
    options: [
      { value: 1, label: "Inexistente", description: "Cada projeto segue abordagem própria sem metodologia" },
      { value: 2, label: "Informal", description: "Algumas práticas comuns mas não documentadas" },
      { value: 3, label: "Padronizada", description: "Metodologia básica para projetos públicos documentada" },
      { value: 4, label: "Matura", description: "Metodologia robusta com templates para diferentes tipos de projeto" },
      { value: 5, label: "Adaptativa", description: "Metodologia flexível adaptada ao contexto de cada obra/consultoria" }
    ]
  },
  {
    id: "del3",
    pillarId: "delivery",
    text: "Qual o nível de integração entre projetos de diferentes secretarias e coordenações?",
    context: "Mede a capacidade de coordenar projetos intersetoriais e maximizar sinergias públicas.",
    options: [
      { value: 1, label: "Isolado", description: "Projetos executados independentemente em silos departamentais" },
      { value: 2, label: "Ocasional", description: "Coordenação apenas quando conflitos surgem" },
      { value: 3, label: "Planejado", description: "Coordenação planejada com identificação de dependências intersetoriais" },
      { value: 4, label: "Integrado", description: "Forte integração com gestão ativa de projetos interdepartamentais" },
      { value: 5, label: "Otimizado", description: "Sinergia máxima entre secretarias com otimização contínua" }
    ]
  },
  {
    id: "del4",
    pillarId: "delivery",
    text: "Como é monitorado o progresso e impacto de obras e consultorias para cidadãos?",
    context: "Avalia acompanhamento sistemático do progresso e benefícios para população.",
    options: [
      { value: 1, label: "Inexistente", description: "Sem monitoramento formal de progresso ou impacto social" },
      { value: 2, label: "Básico", description: "Relatórios ocasionais sem métricas de benefício cidadão" },
      { value: 3, label: "Regular", description: "Monitoramento periódico com métricas básicas de impacto" },
      { value: 4, label: "Sistemático", description: "Dashboard público em tempo real com métricas sociais" },
      { value: 5, label: "Preditivo", description: "Análise preditiva de impacto e otimização contínua" }
    ]
  },

  // Gestão de Benefícios e Realização de Valor Público
  {
    id: "ben1",
    pillarId: "benefits",
    text: "Como o departamento identifica e quantifica o impacto social esperado de projetos?",
    context: "Verifica se existe processo para definir e medir benefícios sociais antes da execução.",
    options: [
      { value: 1, label: "Inexistente", description: "Impacto social não é formalmente identificado ou quantificado" },
      { value: 2, label: "Informal", description: "Benefícios estimados informalmente sem documentação" },
      { value: 3, label: "Básico", description: "Processo básico de identificação de impacto social" },
      { value: 4, label: "Estruturado", description: "Metodologia robusta com métricas sociais claras" },
      { value: 5, label: "Otimizado", description: "Sistema integrado de gestão de valor público com otimização contínua" }
    ]
  },
  {
    id: "ben2",
    pillarId: "benefits",
    text: "Como são identificadas e sistematizadas as boas práticas em projetos públicos?",
    context: "Mede se lições aprendidas são documentadas e compartilhadas entre equipes.",
    options: [
      { value: 1, label: "Inexistente", description: "Nenhuma sistematização de lições aprendidas" },
      { value: 2, label: "Esporádico", description: "Documentação ocasional e informal de algumas práticas" },
      { value: 3, label: "Periódico", description: "Sistematização regular com repositório básico" },
      { value: 4, label: "Sistemático", description: "Sistema maduro de gestão de conhecimento público" },
      { value: 5, label: "Otimizado", description: "Inteligência de boas práticas com aplicação automática" }
    ]
  },
  {
    id: "ben3",
    pillarId: "benefits",
    text: "Como são gerenciadas as dependências organizacionais para realização de benefícios?",
    context: "Avalia se mudanças necessárias nos processos administrativos são bem gerenciadas.",
    options: [
      { value: 1, label: "Ignoradas", description: "Mudanças organizacionais não são consideradas sistematicamente" },
      { value: 2, label: "Reativas", description: "Mudanças abordadas quando problemas surgem" },
      { value: 3, label: "Planejadas", description: "Mudanças organizacionais identificadas e planejadas" },
      { value: 4, label: "Gerenciadas", description: "Gestão ativa de mudanças com suporte dedicado" },
      { value: 5, label: "Integradas", description: "Mudança organizacional totalmente integrada à entrega de valor público" }
    ]
  },
  {
    id: "ben4",
    pillarId: "benefits",
    text: "Como é promovida a melhoria contínua baseada em feedback de cidadãos e beneficiários?",
    context: "Verifica se existe melhoria contínua baseada no retorno da população.",
    options: [
      { value: 1, label: "Inexistente", description: "Nenhum feedback cidadão ou melhoria nos processos" },
      { value: 2, label: "Ocasional", description: "Melhorias esporádicas quando reclamações surgem" },
      { value: 3, label: "Planejada", description: "Ciclos regulares de feedback e melhoria" },
      { value: 4, label: "Sistemática", description: "Otimização contínua baseada em satisfação cidadã" },
      { value: 5, label: "Adaptativa", description: "Sistema responsivo com melhoria contínua automática" }
    ]
  },

  // Gestão Orçamentária e de Recursos Públicos
  {
    id: "fin1",
    pillarId: "financial",
    text: "Como é realizado o planejamento orçamentário integrado com o plano de governo?",
    context: "Avalia maturidade do planejamento orçamentário alinhado com diretrizes municipais.",
    options: [
      { value: 1, label: "Inexistente", description: "Sem planejamento orçamentário formal ou alinhamento" },
      { value: 2, label: "Básico", description: "Orçamentos simples com alinhamento limitado" },
      { value: 3, label: "Estruturado", description: "Planejamento orçamentário com acompanhamento regular" },
      { value: 4, label: "Integrado", description: "Gestão orçamentária integrada com plano de governo" },
      { value: 5, label: "Otimizado", description: "Sistema orçamentário dinâmico com otimização em tempo real" }
    ]
  },
  {
    id: "fin2",
    pillarId: "financial",
    text: "Qual o nível de transparência e governança nos processos de aquisição pública?",
    context: "Mede conformidade com Lei de Licitações e transparência nos gastos públicos.",
    options: [
      { value: 1, label: "Opaco", description: "Processos licitatórios com pouca transparência ou controles" },
      { value: 2, label: "Limitado", description: "Controles básicos com transparência restrita" },
      { value: 3, label: "Adequado", description: "Controles estabelecidos com portais de transparência" },
      { value: 4, label: "Robusto", description: "Sistema de governança maduro e transparência proativa" },
      { value: 5, label: "Exemplar", description: "Governança exemplar com auditoria contínua e dados abertos" }
    ]
  },
  {
    id: "fin3",
    pillarId: "financial",
    text: "Como são mapeados, comunicados e controlados os processos de aquisição?",
    context: "Verifica se processos licitatórios são bem documentados e controlados.",
    options: [
      { value: 1, label: "Ad-hoc", description: "Processos sem mapeamento ou controle adequado" },
      { value: 2, label: "Simples", description: "Processos básicos com pouca documentação" },
      { value: 3, label: "Mapeado", description: "Processos mapeados e documentados adequadamente" },
      { value: 4, label: "Controlado", description: "Processos controlados com métricas e monitoramento" },
      { value: 5, label: "Otimizado", description: "Processos otimizados com melhoria contínua" }
    ]
  },
  {
    id: "fin4",
    pillarId: "financial",
    text: "Como é feita a otimização da alocação de recursos entre diferentes iniciativas públicas?",
    context: "Avalia se recursos públicos são alocados com base em impacto e eficiência.",
    options: [
      { value: 1, label: "Desconectado", description: "Alocação sem consideração de impacto social" },
      { value: 2, label: "Básico", description: "Alguma consideração de prioridades públicas" },
      { value: 3, label: "Criteriosa", description: "Alocação baseada em critérios de impacto social" },
      { value: 4, label: "Otimizada", description: "Otimização sistemática baseada em benefício cidadão" },
      { value: 5, label: "Dinâmica", description: "Alocação dinâmica maximizando valor público" }
    ]
  },

  // Gestão de Riscos Institucionais e Continuidade de Serviços
  {
    id: "risk1",
    pillarId: "risk",
    text: "Como o departamento identifica e avalia riscos específicos do setor público?",
    context: "Verifica se existe processo para identificar riscos políticos, legais e operacionais.",
    options: [
      { value: 1, label: "Inexistente", description: "Sem processo formal de identificação de riscos públicos" },
      { value: 2, label: "Reativo", description: "Riscos identificados apenas quando se materializam" },
      { value: 3, label: "Básico", description: "Processo básico considerando principais riscos municipais" },
      { value: 4, label: "Sistemático", description: "Framework robusto considerando mudanças políticas e regulatórias" },
      { value: 5, label: "Preditivo", description: "Sistema avançado com análise preditiva e cenários municipais" }
    ]
  },
  {
    id: "risk2",
    pillarId: "risk",
    text: "Qual o nível de preparação para manter serviços essenciais durante crises?",
    context: "Mede a capacidade de manter serviços públicos essenciais durante eventos adversos.",
    options: [
      { value: 1, label: "Inexistente", description: "Sem planos de contingência para continuidade de serviços" },
      { value: 2, label: "Básico", description: "Alguns planos básicos para serviços críticos" },
      { value: 3, label: "Estruturado", description: "Planos de continuidade documentados e testados ocasionalmente" },
      { value: 4, label: "Robusto", description: "Sistema maduro de continuidade com testes regulares" },
      { value: 5, label: "Resiliente", description: "Departamento altamente resiliente com capacidade adaptativa" }
    ]
  },
  {
    id: "risk3",
    pillarId: "risk",
    text: "Como são gerenciados os riscos de imagem e credibilidade institucional?",
    context: "Avalia gestão de riscos reputacionais junto à população e mídia.",
    options: [
      { value: 1, label: "Inexistente", description: "Sem estratégias para proteção da imagem institucional" },
      { value: 2, label: "Ad-hoc", description: "Ações reativas quando problemas de imagem surgem" },
      { value: 3, label: "Planejadas", description: "Estratégias básicas de comunicação e transparência" },
      { value: 4, label: "Sistemáticas", description: "Gestão proativa da reputação com monitoramento regular" },
      { value: 5, label: "Adaptativas", description: "Sistema dinâmico de proteção e construção de credibilidade" }
    ]
  },
  {
    id: "risk4",
    pillarId: "risk",
    text: "Como são implementadas estratégias de mitigação adaptadas ao contexto municipal?",
    context: "Verifica se estratégias de mitigação consideram especificidades públicas.",
    options: [
      { value: 1, label: "Desconectado", description: "Estratégias genéricas sem consideração do contexto público" },
      { value: 2, label: "Ocasional", description: "Mitigação considerada esporadicamente nas decisões" },
      { value: 3, label: "Incorporado", description: "Mitigação regularmente considerada no planejamento" },
      { value: 4, label: "Integrado", description: "Estratégias totalmente integradas ao contexto municipal" },
      { value: 5, label: "Otimizado", description: "Mitigação otimizada considerando impacto no serviço público" }
    ]
  },

  // Comunicação Interna e Engajamento de Stakeholders
  {
    id: "stake1",
    pillarId: "stakeholders",
    text: "Como o departamento identifica e engaja gestores governamentais críticos?",
    context: "Avalia se existe processo estruturado para mapear e engajar diferentes esferas de governo.",
    options: [
      { value: 1, label: "Inexistente", description: "Sem mapeamento de stakeholders governamentais ou estratégia de engajamento" },
      { value: 2, label: "Básico", description: "Identificação básica com engajamento esporádico" },
      { value: 3, label: "Estruturado", description: "Mapeamento sistemático com planos de engajamento intergovernamental" },
      { value: 4, label: "Estratégico", description: "Gestão sofisticada considerando diferentes níveis de governo" },
      { value: 5, label: "Dinâmico", description: "Rede de relacionamentos governamentais auto-organizativa" }
    ]
  },
  {
    id: "stake2",
    pillarId: "stakeholders",
    text: "Qual a eficácia dos canais de comunicação entre departamentos e secretarias?",
    context: "Mede se informações fluem adequadamente entre diferentes áreas do governo municipal.",
    options: [
      { value: 1, label: "Deficiente", description: "Comunicação fragmentada entre departamentos com muitos gaps" },
      { value: 2, label: "Limitada", description: "Canais básicos com comunicação ocasional entre setores" },
      { value: 3, label: "Adequada", description: "Canais estabelecidos com comunicação regular intersetorial" },
      { value: 4, label: "Eficaz", description: "Sistema de comunicação maduro e multi-direcional" },
      { value: 5, label: "Otimizada", description: "Comunicação inteligente e integrada entre todas as secretarias" }
    ]
  },
  {
    id: "stake3",
    pillarId: "stakeholders",
    text: "Como são implementados processos de feedback e controle social cidadão?",
    context: "Verifica se existe processo para capturar e responder ao feedback da população.",
    options: [
      { value: 1, label: "Inexistente", description: "Sem mecanismos formais de feedback cidadão" },
      { value: 2, label: "Reativo", description: "Feedback coletado apenas quando reclamações surgem" },
      { value: 3, label: "Periódico", description: "Coleta regular de feedback com algumas ações de resposta" },
      { value: 4, label: "Proativo", description: "Gestão ativa com ouvidoria e canais estruturados" },
      { value: 5, label: "Colaborativo", description: "Cidadãos co-criam soluções através de feedback contínuo" }
    ]
  },
  {
    id: "stake4",
    pillarId: "stakeholders",
    text: "Qual o nível de transparência ativa e comunicação acessível com órgãos de controle?",
    context: "Avalia se o departamento mantém transparência adequada e presta contas proativamente.",
    options: [
      { value: 1, label: "Opaca", description: "Pouca transparência nas operações e decisões públicas" },
      { value: 2, label: "Limitada", description: "Transparência básica apenas quando solicitada por órgãos" },
      { value: 3, label: "Regular", description: "Relatórios periódicos e portais de transparência" },
      { value: 4, label: "Proativa", description: "Transparência proativa com múltiplos canais de informação" },
      { value: 5, label: "Exemplar", description: "Transparência total com dados abertos em tempo real" }
    ]
  },

  // Pessoas, Cultura de Serviço Público e Competências
  {
    id: "people1",
    pillarId: "people",
    text: "Como o departamento desenvolve competências em gestão de projetos públicos?",
    context: "Verifica se existe programa estruturado de capacitação em gestão pública.",
    options: [
      { value: 1, label: "Ad-hoc", description: "Desenvolvimento esporádico sem foco em gestão pública" },
      { value: 2, label: "Básico", description: "Programas básicos de treinamento em administração pública" },
      { value: 3, label: "Estruturado", description: "Plano de desenvolvimento alinhado às necessidades municipais" },
      { value: 4, label: "Estratégico", description: "Desenvolvimento integrado com trilhas em gestão PPP" },
      { value: 5, label: "Adaptativo", description: "Sistema de desenvolvimento contínuo em inovação pública" }
    ]
  },
  {
    id: "people2",
    pillarId: "people",
    text: "Qual o grau de colaboração e integração entre equipes e departamentos?",
    context: "Mede se existem mecanismos efetivos para quebrar silos departamentais.",
    options: [
      { value: 1, label: "Silos", description: "Departamentos trabalham isoladamente com pouca colaboração" },
      { value: 2, label: "Ocasional", description: "Colaboração acontece esporadicamente quando necessário" },
      { value: 3, label: "Estruturada", description: "Mecanismos formais de colaboração intersetorial estabelecidos" },
      { value: 4, label: "Integrada", description: "Cultura de colaboração com estruturas de suporte maduras" },
      { value: 5, label: "Sinérgica", description: "Colaboração natural maximizando sinergia entre secretarias" }
    ]
  },
  {
    id: "people3",
    pillarId: "people",
    text: "Como é promovida a cultura de compartilhamento de conhecimento em gestão pública?",
    context: "Avalia se existem práticas para capturar, organizar e compartilhar conhecimento público.",
    options: [
      { value: 1, label: "Inexistente", description: "Conhecimento em gestão pública permanece individual" },
      { value: 2, label: "Informal", description: "Compartilhamento ocasional através de conversas informais" },
      { value: 3, label: "Estruturado", description: "Sistemas básicos de gestão do conhecimento público" },
      { value: 4, label: "Cultivado", description: "Cultura forte de compartilhamento com práticas de gestão pública" },
      { value: 5, label: "Inteligente", description: "Sistema inteligente de conhecimento com aprendizado contínuo" }
    ]
  },
  {
    id: "people4",
    pillarId: "people",
    text: "Qual o nível de adaptabilidade cultural para mudanças e inovação no serviço público?",
    context: "Mede a capacidade cultural para abraçar mudanças e fomentar inovação em serviços públicos.",
    options: [
      { value: 1, label: "Resistente", description: "Cultura resistente a mudanças com foco em manter processos" },
      { value: 2, label: "Cautelosa", description: "Mudanças aceitas com relutância e processo burocrático lento" },
      { value: 3, label: "Receptiva", description: "Cultura aberta a mudanças quando beneficiam cidadãos" },
      { value: 4, label: "Proativa", description: "Cultura que busca ativamente melhorias no serviço público" },
      { value: 5, label: "Transformadora", description: "Cultura de inovação contínua e foco no cidadão" }
    ]
  }
];

export const OSRL_LEVELS: OSRLLevel[] = [
  {
    level: 1,
    name: "Inicial (Ad-hoc & Caótico Municipal)",
    description: "Processos administrativos inconsistentes e reativos. O sucesso depende inteiramente de conhecimento individual de servidores, não de capacidades departamentais.",
    characteristics: [
      "Processos administrativos inconsistentes e mal controlados",
      "Sucesso depende de conhecimento individual de servidores",
      "Projetos públicos executados sem coordenação entre setores",
      "Ausência de metodologias para gestão de obras e contratos"
    ],
    recommendations: [
      "Documentar processos básicos de licitação e contratos",
      "Mapear fluxos de trabalho críticos entre departamentos",
      "Estabelecer controles mínimos de conformidade legal",
      "Criar estrutura básica de comunicação intersetorial"
    ]
  },
  {
    level: 2,
    name: "Consciente (Fragmentação Departamental)",
    description: "Existe consciência básica sobre gestão de projetos públicos, mas os processos são aplicados de forma inconsistente, geralmente dentro de silos departamentais.",
    characteristics: [
      "Consciência básica sobre gestão de projetos públicos",
      "Iniciativas executadas em silos departamentais",
      "Pouca integração entre secretarias e coordenações",
      "Processos de aquisição básicos mas inconsistentes"
    ],
    recommendations: [
      "Padronizar processos básicos de gestão pública",
      "Quebrar silos departamentais com projetos transversais",
      "Estabelecer vocabulário comum de gestão municipal",
      "Criar templates básicos para obras e consultorias"
    ]
  },
  {
    level: 3,
    name: "Estruturado (Processos Repetíveis)",
    description: "Processos centrais de gestão de projetos são documentados e podem ser repetidos no nível do projeto. Existe um acompanhamento básico de custo e cronograma.",
    characteristics: [
      "Processos documentados e repetíveis no nível do projeto",
      "Acompanhamento básico de custo e cronograma",
      "Sucessos podem ser repetidos em projetos similares",
      "Disciplina de processo em desenvolvimento"
    ],
    recommendations: [
      "Documentar e formalizar processos em toda organização",
      "Implementar controles básicos de qualidade",
      "Criar sistema de lições aprendidas",
      "Estabelecer métricas padrão de desempenho"
    ]
  },
  {
    level: 4,
    name: "Definido (Processos Padronizados)",
    description: "Um conjunto de processos padrão para toda a organização é definido e disponibilizado para uso em todos os projetos. A organização adota uma postura mais proativa do que reativa.",
    characteristics: [
      "Processos padrão definidos para toda organização",
      "Processos bem caracterizados e compreendidos",
      "Postura proativa em vez de reativa",
      "Treinamento formal em processos organizacionais"
    ],
    recommendations: [
      "Implementar visão básica de Gestão de Portfólio (PPM)",
      "Alinhar processos de projetos com estratégia organizacional",
      "Estabelecer governança integrada de projetos",
      "Desenvolver competências em gestão de mudança"
    ]
  },
  {
    level: 5,
    name: "Integrado (Processos Institucionalizados)",
    description: "Os processos padrão são totalmente institucionalizados e integrados com outras funções corporativas. Uma visão de portfólio começa a emergir, permitindo um alinhamento mais amplo dos projetos com a estratégia.",
    characteristics: [
      "Processos institucionalizados e integrados",
      "Integração com funções corporativas (finanças, RH)",
      "Visão de portfólio emergente",
      "Alinhamento amplo de projetos com estratégia"
    ],
    recommendations: [
      "Implementar PPM (Project Portfolio Management) robusto",
      "Integrar sistemas de gestão de valor e benefícios",
      "Criar mecanismos de compartilhamento de conhecimento",
      "Estabelecer centros de excelência em gestão"
    ]
  },
  {
    level: 6,
    name: "Gerenciado (Medido Quantitativamente)",
    description: "A organização coleta e utiliza dados quantitativos para gerenciar o desempenho e a qualidade dos projetos. As decisões são cada vez mais baseadas em dados.",
    characteristics: [
      "Coleta e uso de dados quantitativos sistemáticos",
      "Decisões baseadas em dados objetivos",
      "Objetivos quantitativos para qualidade e desempenho",
      "Gestão quantitativa de processos"
    ],
    recommendations: [
      "Desenvolver capacidades avançadas de análise de dados",
      "Implementar dashboards executivos em tempo real",
      "Criar modelos preditivos para gestão de projetos",
      "Otimizar processos baseado em análise quantitativa"
    ]
  },
  {
    level: 7,
    name: "Preditivo (Controlado Quantitativamente)",
    description: "Técnicas estatísticas e quantitativas são usadas para controlar processos e prever resultados de desempenho. A organização pode prever de forma confiável os resultados dos projetos.",
    characteristics: [
      "Uso de técnicas estatísticas para controle",
      "Previsão confiável de resultados de projetos",
      "Modelos estatísticos baseados em dados históricos",
      "Controle quantitativo sistemático de processos"
    ],
    recommendations: [
      "Implementar análise preditiva avançada",
      "Desenvolver modelos de machine learning para otimização",
      "Criar simulações e cenários para tomada de decisão",
      "Estabelecer controles estatísticos de processo"
    ]
  },
  {
    level: 8,
    name: "Otimizado (Melhoria Contínua)",
    description: "A organização está focada na melhoria contínua dos processos, identificando e abordando as causas comuns de variação e desvio de desempenho. A inovação em processos é incentivada e gerenciada.",
    characteristics: [
      "Foco sistemático em melhoria contínua",
      "Identificação de causas de variação e desvios",
      "Inovação em processos incentivada e gerenciada",
      "Prevenção proativa de problemas"
    ],
    recommendations: [
      "Implementar automação inteligente de processos",
      "Desenvolver cultura de inovação sistemática",
      "Criar laboratórios de experimentação organizacional",
      "Estabelecer redes de colaboração externa"
    ]
  },
  {
    level: 9,
    name: "Adaptativo (Agilidade Estratégica)",
    description: "Os processos estáveis e otimizados da organização fornecem uma plataforma para agilidade e inovação estratégica. A organização pode pivotar e responder a oportunidades e ameaças de forma eficaz, integrando perfeitamente a estratégia e a execução.",
    characteristics: [
      "Plataforma estável para agilidade estratégica",
      "Capacidade de pivotar rapidamente",
      "Resposta eficaz a oportunidades e ameaças",
      "Integração perfeita entre estratégia e execução"
    ],
    recommendations: [
      "Liderar transformação setorial e ecossistêmica",
      "Desenvolver capacidades de antecipação estratégica",
      "Criar valor através de inovação disruptiva",
      "Estabelecer parcerias estratégicas para co-evolução"
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
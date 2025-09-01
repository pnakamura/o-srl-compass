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
    description: "Processos de tomada de decisão estratégica, priorização e alinhamento organizacional",
    importance: "Define como a organização direciona recursos e esforços para maximizar o valor e atingir objetivos estratégicos"
  },
  {
    id: "portfolio",
    name: "Gestão de Portfólio, Programas e Projetos",
    description: "Metodologias estruturadas para gestão de projetos, programas e portfólio organizacional",
    importance: "Determina a eficácia na transformação de estratégias em resultados tangíveis através de processos estruturados"
  },
  {
    id: "benefits",
    name: "Gestão de Benefícios e Realização de Valor",
    description: "Identificação, mensuração e realização sistemática de benefícios e valor organizacional",
    importance: "Garante que investimentos e esforços se convertam em benefícios mensuráveis e sustentáveis"
  },
  {
    id: "financial",
    name: "Gestão Financeira e de Recursos",
    description: "Planejamento, controle financeiro e otimização de recursos organizacionais",
    importance: "Estabelece a disciplina financeira necessária para eficiência e alocação otimizada de recursos"
  },
  {
    id: "risk",
    name: "Gestão de Riscos e Resiliência",
    description: "Identificação, análise e mitigação de riscos, construção de resiliência organizacional",
    importance: "Constrói a capacidade de manter operações em cenários adversos e preservar continuidade dos negócios"
  },
  {
    id: "stakeholders",
    name: "Engajamento de Stakeholders e Comunicações",
    description: "Gestão efetiva de relacionamentos e comunicações com todas as partes interessadas",
    importance: "Facilita a colaboração e o engajamento necessários para execução bem-sucedida de iniciativas"
  },
  {
    id: "people",
    name: "Pessoas, Cultura e Competência",
    description: "Desenvolvimento de competências, cultura organizacional e gestão de talentos",
    importance: "Desenvolve as capacidades humanas e culturais que sustentam a execução eficaz de processos maduros"
  }
];

export const QUESTIONS: Question[] = [
  // PILAR 1: GOVERNANÇA ESTRATÉGICA E LIDERANÇA
  {
    id: "gov1",
    pillarId: "governance",
    text: "Como a organização toma decisões sobre a priorização de projetos e iniciativas?",
    context: "Avalia se existe processo transparente e documentado para priorização com base em critérios estratégicos.",
    options: [
      { value: 1, label: "Ad-hoc", description: "As decisões são tomadas caso a caso, sem critérios claros, geralmente baseadas na intuição ou na influência de indivíduos." },
      { value: 2, label: "Informal", description: "Existem alguns critérios, mas não são documentados ou aplicados de forma consistente. A priorização é reativa a pressões de curto prazo." },
      { value: 3, label: "Básico", description: "Existem critérios básicos de priorização documentados, mas o processo não é totalmente transparente ou rigorosamente seguido." },
      { value: 4, label: "Estruturado", description: "Existe um processo de governança transparente e documentado para priorização, com base em critérios estratégicos claros e com prestação de contas." },
      { value: 5, label: "Otimizado", description: "O processo de priorização é maduro, dinâmico, com participação das partes interessadas e revisado continuamente para se adaptar às mudanças do ambiente." }
    ]
  },
  {
    id: "gov2",
    pillarId: "governance",
    text: "Qual o nível de alinhamento entre os objetivos estratégicos da organização e a execução dos projetos?",
    context: "Mede a capacidade de traduzir estratégia em execução operacional efetiva.",
    options: [
      { value: 1, label: "Desconectado", description: "A estratégia e a execução dos projetos funcionam de forma independente. Os projetos raramente são justificados com base em objetivos estratégicos." },
      { value: 2, label: "Ocasional", description: "O alinhamento existe, mas é inconsistente e depende do esforço de gerentes de projeto individuais." },
      { value: 3, label: "Parcial", description: "O alinhamento é claro em algumas áreas ou para alguns projetos de alta visibilidade, mas não é uma prática sistêmica." },
      { value: 4, label: "Integrado", description: "Existe um forte alinhamento, com mecanismos formais para garantir que todos os projetos contribuam para os objetivos estratégicos." },
      { value: 5, label: "Dinâmico", description: "O alinhamento é contínuo e adaptativo. A estratégia informa a execução, e os resultados da execução informam a evolução da estratégia em tempo real." }
    ]
  },
  {
    id: "gov3",
    pillarId: "governance",
    text: "Como a liderança monitora e comunica o progresso e o valor dos projetos para a organização?",
    context: "Avalia sistemas de monitoramento e comunicação do progresso e valor gerado.",
    options: [
      { value: 1, label: "Inexistente", description: "Não há monitoramento formal ou comunicação regular sobre o status ou o valor dos projetos." },
      { value: 2, label: "Básico", description: "O monitoramento é esporádico e focado em métricas de curto prazo (custo e prazo). A comunicação é limitada e reativa." },
      { value: 3, label: "Regular", description: "Existem relatórios periódicos de status e uma comunicação estruturada, mas o foco ainda é mais em entregas do que em valor." },
      { value: 4, label: "Sistemático", description: "Existem dashboards e portais de transparência em tempo real, com comunicação proativa sobre o progresso e o valor gerado pelos projetos." },
      { value: 5, label: "Integrado", description: "A liderança utiliza inteligência de portfólio contínua para tomar decisões estratégicas, com comunicação transparente e baseada em dados para todas as partes interessadas." }
    ]
  },
  {
    id: "gov4",
    pillarId: "governance",
    text: "Qual o grau de maturidade dos processos de governança de projetos (ex: comitês de direção, aprovações, etc.)?",
    context: "Verifica maturidade dos processos formais de governança organizacional.",
    options: [
      { value: 1, label: "Inicial", description: "Os processos de governança são inconsistentes, burocráticos e vistos como um obstáculo." },
      { value: 2, label: "Emergente", description: "Existem alguns processos básicos de governança, mas são aplicados de forma irregular e com pouca eficácia." },
      { value: 3, label: "Definido", description: "Os processos de governança são documentados e padronizados, com papéis e responsabilidades claros." },
      { value: 4, label: "Gerenciado", description: "Os processos de governança são controlados com métricas de desempenho e auditorias regulares para garantir a conformidade e a eficácia." },
      { value: 5, label: "Otimizado", description: "A governança é ágil, enxuta e adaptativa, focada em capacitar as equipes e acelerar a tomada de decisões, mantendo o controle estratégico." }
    ]
  },

  // PILAR 2: GESTÃO DE PORTFÓLIO, PROGRAMAS E PROJETOS
  {
    id: "port1",
    pillarId: "portfolio",
    text: "A organização possui uma metodologia estruturada para a gestão de projetos?",
    context: "Avalia se existe metodologia formal e consistente para gestão de projetos.",
    options: [
      { value: 1, label: "Inexistente", description: "Cada projeto é gerenciado de uma forma diferente, sem metodologia ou padrões." },
      { value: 2, label: "Básica", description: "Existe uma metodologia básica, mas é aplicada de forma inconsistente e não é adaptada aos diferentes tipos de projeto." },
      { value: 3, label: "Estruturada", description: "Existe uma metodologia de gestão de projetos padronizada e documentada, com templates e diretrizes." },
      { value: 4, label: "Integrada", description: "A metodologia é robusta, integrada com outras áreas da organização e adaptável a diferentes tipos e complexidades de projeto (ex: ágil, cascata, híbrido)." },
      { value: 5, label: "Otimizada", description: "A metodologia é dinâmica, continuamente aprimorada com base em lições aprendidas e dados de desempenho, e fomenta a inovação na entrega de projetos." }
    ]
  },
  {
    id: "port2",
    pillarId: "portfolio",
    text: "Como são documentadas e compartilhadas as lições aprendidas dos projetos?",
    context: "Verifica se existe gestão do conhecimento para capturar e compartilhar aprendizados.",
    options: [
      { value: 1, label: "Inexistente", description: "As lições aprendidas não são sistematicamente capturadas ou compartilhadas." },
      { value: 2, label: "Informal", description: "As lições são compartilhadas informalmente entre os membros da equipe, mas não são documentadas." },
      { value: 3, label: "Básico", description: "As lições aprendidas são documentadas ao final dos projetos, mas raramente são consultadas ou utilizadas em novos projetos." },
      { value: 4, label: "Estruturado", description: "Existe um processo formal e um repositório central para capturar, analisar e compartilhar lições aprendidas." },
      { value: 5, label: "Otimizado", description: "Existe um sistema de gestão do conhecimento maduro, onde as lições aprendidas são proativamente disseminadas e integradas à metodologia e aos processos de planejamento de novos projetos." }
    ]
  },
  {
    id: "port3",
    pillarId: "portfolio",
    text: "Qual o nível de integração e gestão de dependências entre os projetos?",
    context: "Mede a capacidade de coordenar projetos interdependentes e maximizar sinergias.",
    options: [
      { value: 1, label: "Isolado", description: "Os projetos são executados de forma independente, em silos, com pouca ou nenhuma consciência das dependências." },
      { value: 2, label: "Ocasional", description: "A coordenação ocorre apenas quando surgem conflitos ou problemas de dependência." },
      { value: 3, label: "Planejado", description: "As dependências entre projetos são identificadas e planejadas, mas a gestão ainda é reativa." },
      { value: 4, label: "Integrado", description: "Existe uma gestão de portfólio ativa que gerencia proativamente as dependências, recursos e prioridades entre os projetos." },
      { value: 5, label: "Otimizado", description: "A gestão de portfólio é dinâmica e otimizada em tempo real, maximizando a sinergia e o valor do conjunto de projetos." }
    ]
  },
  {
    id: "port4",
    pillarId: "portfolio",
    text: "Como é monitorado o progresso e o desempenho dos projetos?",
    context: "Avalia sistemas e processos de monitoramento e controle de projetos.",
    options: [
      { value: 1, label: "Inexistente", description: "Não há monitoramento formal do progresso ou do desempenho dos projetos." },
      { value: 2, label: "Básico", description: "O monitoramento é focado apenas em custo e cronograma, com relatórios manuais e pouco frequentes." },
      { value: 3, label: "Regular", description: "O monitoramento inclui escopo e qualidade, com relatórios periódicos e padronizados." },
      { value: 4, label: "Sistemático", description: "Existe um sistema de monitoramento em tempo real (ex: PMIS, dashboards) com métricas de desempenho claras e análise de tendências." },
      { value: 5, label: "Preditivo", description: "A organização utiliza análise preditiva e dados históricos para antecipar desvios e tomar ações corretivas proativas, otimizando o desempenho dos projetos." }
    ]
  },

  // PILAR 3: GESTÃO DE BENEFÍCIOS E REALIZAÇÃO DE VALOR
  {
    id: "ben1",
    pillarId: "benefits",
    text: "Como a organização define e mede os benefícios esperados dos projetos?",
    context: "Verifica se existe processo para definir e medir benefícios antes da execução.",
    options: [
      { value: 1, label: "Inexistente", description: "Os benefícios não são claramente definidos ou medidos. O foco é apenas na entrega de produtos/serviços." },
      { value: 2, label: "Básico", description: "Os benefícios são definidos de forma genérica, mas não há métricas claras ou responsáveis pela realização." },
      { value: 3, label: "Estruturado", description: "Os benefícios são definidos com métricas específicas, mas o acompanhamento é inconsistente." },
      { value: 4, label: "Gerenciado", description: "Existe um processo formal de gestão de benefícios, com responsáveis designados e acompanhamento regular." },
      { value: 5, label: "Otimizado", description: "A gestão de benefícios é integrada ao ciclo de vida dos projetos, com otimização contínua e realização de valor demonstrável." }
    ]
  },
  {
    id: "ben2",
    pillarId: "benefits",
    text: "Qual o nível de foco da organização em resultados (outcomes) versus entregas (outputs)?",
    context: "Mede se a organização está orientada para resultados ou apenas para entregas.",
    options: [
      { value: 1, label: "Outputs", description: "O foco é exclusivamente em entregas tangíveis, sem consideração pelos resultados ou impactos." },
      { value: 2, label: "Transição", description: "Há consciência da importância dos resultados, mas a prática ainda é focada em entregas." },
      { value: 3, label: "Equilibrado", description: "Existe um equilíbrio entre o foco em entregas e resultados, mas ainda predomina a mentalidade de outputs." },
      { value: 4, label: "Outcomes", description: "O foco principal é em resultados e impactos, com entregas vistas como meios para atingir fins." },
      { value: 5, label: "Valor", description: "A organização está totalmente orientada para a criação e realização de valor, com métricas e processos alinhados a esse objetivo." }
    ]
  },
  {
    id: "ben3",
    pillarId: "benefits",
    text: "Como é realizado o acompanhamento pós-projeto para verificar a realização dos benefícios?",
    context: "Avalia se existe acompanhamento sistemático da realização de benefícios após conclusão.",
    options: [
      { value: 1, label: "Inexistente", description: "Não há acompanhamento após o encerramento do projeto." },
      { value: 2, label: "Ocasional", description: "O acompanhamento ocorre esporadicamente, dependendo da iniciativa individual." },
      { value: 3, label: "Básico", description: "Existe um processo básico de acompanhamento, mas é limitado e não sistemático." },
      { value: 4, label: "Estruturado", description: "Há um processo formal de acompanhamento pós-projeto, com responsáveis e cronogramas definidos." },
      { value: 5, label: "Integrado", description: "O acompanhamento é integrado aos processos de negócio, com feedback contínuo para melhoria de futuros projetos." }
    ]
  },
  {
    id: "ben4",
    pillarId: "benefits",
    text: "Qual o grau de envolvimento dos \"donos de benefícios\" no ciclo de vida dos projetos?",
    context: "Verifica se há responsabilização clara pela realização de benefícios.",
    options: [
      { value: 1, label: "Inexistente", description: "Não há identificação clara de donos de benefícios." },
      { value: 2, label: "Nominal", description: "Os donos de benefícios são identificados, mas têm pouco envolvimento prático." },
      { value: 3, label: "Participativo", description: "Os donos de benefícios participam de reuniões e revisões, mas com responsabilidade limitada." },
      { value: 4, label: "Responsável", description: "Os donos de benefícios têm responsabilidade clara e participação ativa na tomada de decisões." },
      { value: 5, label: "Integrado", description: "Os donos de benefícios são parceiros estratégicos, totalmente integrados ao processo de gestão do projeto." }
    ]
  },

  // PILAR 4: GESTÃO FINANCEIRA E DE RECURSOS
  {
    id: "fin1",
    pillarId: "financial",
    text: "Como é realizado o planejamento e controle financeiro dos projetos?",
    context: "Avalia maturidade do planejamento orçamentário e controle financeiro de projetos.",
    options: [
      { value: 1, label: "Inexistente", description: "Não há planejamento financeiro formal ou controle de custos dos projetos." },
      { value: 2, label: "Básico", description: "Existe um orçamento inicial, mas o controle é limitado e reativo." },
      { value: 3, label: "Estruturado", description: "O planejamento financeiro é documentado e há controle regular de custos." },
      { value: 4, label: "Integrado", description: "O controle financeiro é integrado aos sistemas corporativos, com relatórios em tempo real." },
      { value: 5, label: "Preditivo", description: "Utiliza-se análise preditiva para antecipar desvios financeiros e otimizar a alocação de recursos." }
    ]
  },
  {
    id: "fin2",
    pillarId: "financial",
    text: "Qual o nível de maturidade na gestão de recursos humanos em projetos?",
    context: "Mede a capacidade de planejar e alocar recursos humanos eficientemente.",
    options: [
      { value: 1, label: "Ad-hoc", description: "A alocação de pessoas é feita caso a caso, sem planejamento ou visão de capacidade." },
      { value: 2, label: "Reativo", description: "A gestão de recursos é reativa a demandas urgentes, com pouco planejamento antecipado." },
      { value: 3, label: "Planejado", description: "Existe planejamento de recursos, mas ainda há conflitos frequentes e sobrecarga." },
      { value: 4, label: "Otimizado", description: "A gestão de recursos é proativa, com visão de capacidade e balanceamento de carga." },
      { value: 5, label: "Estratégico", description: "A gestão de recursos é estratégica, alinhada com objetivos de desenvolvimento de competências e carreira." }
    ]
  },
  {
    id: "fin3",
    pillarId: "financial",
    text: "Como é realizada a gestão de aquisições e fornecedores nos projetos?",
    context: "Verifica se processos de aquisição são bem estruturados e gerenciados.",
    options: [
      { value: 1, label: "Inexistente", description: "Não há processo formal de gestão de aquisições ou fornecedores." },
      { value: 2, label: "Básico", description: "Existe um processo básico, mas é aplicado de forma inconsistente." },
      { value: 3, label: "Estruturado", description: "O processo de aquisições é documentado e seguido, com contratos bem definidos." },
      { value: 4, label: "Integrado", description: "A gestão de fornecedores é integrada ao ciclo de vida dos projetos, com avaliação de desempenho." },
      { value: 5, label: "Estratégico", description: "Fornecedores são tratados como parceiros estratégicos, com relacionamentos de longo prazo e inovação colaborativa." }
    ]
  },
  {
    id: "fin4",
    pillarId: "financial",
    text: "Qual o grau de integração entre o planejamento de projetos e o orçamento organizacional?",
    context: "Avalia se recursos são alocados com base em prioridades estratégicas.",
    options: [
      { value: 1, label: "Desconectado", description: "O planejamento de projetos e o orçamento organizacional funcionam independentemente." },
      { value: 2, label: "Ocasional", description: "Há alguma coordenação, mas é limitada e não sistemática." },
      { value: 3, label: "Coordenado", description: "Existe coordenação regular entre planejamento de projetos e orçamento." },
      { value: 4, label: "Integrado", description: "O planejamento de projetos é totalmente integrado ao processo orçamentário." },
      { value: 5, label: "Otimizado", description: "A integração é dinâmica, permitindo ajustes em tempo real baseados no desempenho dos projetos." }
    ]
  },

  // PILAR 5: GESTÃO DE RISCOS E RESILIÊNCIA
  {
    id: "risk1",
    pillarId: "risk",
    text: "Como é realizada a identificação e análise de riscos nos projetos?",
    context: "Verifica se existe processo formal e sistemático de gestão de riscos.",
    options: [
      { value: 1, label: "Inexistente", description: "Não há processo formal de gestão de riscos." },
      { value: 2, label: "Reativo", description: "Os riscos são tratados apenas quando se materializam em problemas." },
      { value: 3, label: "Básico", description: "Existe identificação básica de riscos, mas a análise é superficial." },
      { value: 4, label: "Estruturado", description: "Há um processo formal de identificação, análise e priorização de riscos." },
      { value: 5, label: "Avançado", description: "Utiliza-se análise quantitativa de riscos, simulações e técnicas avançadas de modelagem." }
    ]
  },
  {
    id: "risk2",
    pillarId: "risk",
    text: "Qual o nível de proatividade na resposta aos riscos identificados?",
    context: "Mede se a organização tem capacidade proativa de resposta a riscos.",
    options: [
      { value: 1, label: "Reativo", description: "A organização apenas reage aos problemas quando eles ocorrem." },
      { value: 2, label: "Consciente", description: "Há consciência dos riscos, mas as respostas são limitadas." },
      { value: 3, label: "Planejado", description: "Existem planos de resposta para os principais riscos identificados." },
      { value: 4, label: "Proativo", description: "A organização implementa ações preventivas e monitora indicadores de risco." },
      { value: 5, label: "Adaptativo", description: "A gestão de riscos é dinâmica, com capacidade de adaptação rápida a novos cenários." }
    ]
  },
  {
    id: "risk3",
    pillarId: "risk",
    text: "Como a organização lida com a incerteza e a complexidade dos projetos?",
    context: "Avalia capacidade de navegar em ambientes incertos e complexos.",
    options: [
      { value: 1, label: "Evita", description: "A organização evita projetos complexos ou incertos." },
      { value: 2, label: "Tolera", description: "Aceita a incerteza, mas sem estratégias específicas para lidar com ela." },
      { value: 3, label: "Gerencia", description: "Tem estratégias básicas para gerenciar incerteza e complexidade." },
      { value: 4, label: "Abraça", description: "Vê a incerteza como oportunidade e tem capacidades para navegar na complexidade." },
      { value: 5, label: "Prospera", description: "A organização prospera em ambientes incertos e complexos, usando-os como vantagem competitiva." }
    ]
  },
  {
    id: "risk4",
    pillarId: "risk",
    text: "Qual o grau de resiliência organizacional diante de crises ou mudanças inesperadas?",
    context: "Verifica capacidade de recuperação e adaptação em situações adversas.",
    options: [
      { value: 1, label: "Frágil", description: "A organização é facilmente impactada por mudanças e tem dificuldade de recuperação." },
      { value: 2, label: "Vulnerável", description: "Consegue lidar com pequenas mudanças, mas é vulnerável a crises maiores." },
      { value: 3, label: "Estável", description: "Tem capacidade básica de absorver impactos e se recuperar." },
      { value: 4, label: "Resiliente", description: "Consegue se adaptar rapidamente a mudanças e se recuperar de crises." },
      { value: 5, label: "Antifrágil", description: "A organização se fortalece com crises e mudanças, usando-as para evoluir." }
    ]
  },

  // PILAR 6: ENGAJAMENTO DE STAKEHOLDERS E COMUNICAÇÕES
  {
    id: "stake1",
    pillarId: "stakeholders",
    text: "Como é realizada a identificação e análise de stakeholders nos projetos?",
    context: "Verifica se existe processo sistemático para mapear e analisar partes interessadas.",
    options: [
      { value: 1, label: "Inexistente", description: "Não há processo formal de identificação de stakeholders." },
      { value: 2, label: "Básico", description: "Stakeholders óbvios são identificados, mas sem análise aprofundada." },
      { value: 3, label: "Estruturado", description: "Existe um processo de identificação e análise básica de stakeholders." },
      { value: 4, label: "Abrangente", description: "A identificação é abrangente e inclui análise de poder, interesse e influência." },
      { value: 5, label: "Dinâmico", description: "O mapeamento de stakeholders é dinâmico e continuamente atualizado." }
    ]
  },
  {
    id: "stake2",
    pillarId: "stakeholders",
    text: "Qual o nível de efetividade da comunicação nos projetos?",
    context: "Mede a qualidade e efetividade dos processos de comunicação.",
    options: [
      { value: 1, label: "Deficiente", description: "A comunicação é irregular, confusa e gera mal-entendidos frequentes." },
      { value: 2, label: "Básica", description: "Existe comunicação, mas é limitada e nem sempre efetiva." },
      { value: 3, label: "Estruturada", description: "Há um plano de comunicação básico e canais definidos." },
      { value: 4, label: "Efetiva", description: "A comunicação é clara, oportuna e adequada ao público-alvo." },
      { value: 5, label: "Excelente", description: "A comunicação é estratégica, inspiradora e cria engajamento genuíno." }
    ]
  },
  {
    id: "stake3",
    pillarId: "stakeholders",
    text: "Como é gerenciado o engajamento e a satisfação dos stakeholders?",
    context: "Avalia se existe gestão proativa do relacionamento com partes interessadas.",
    options: [
      { value: 1, label: "Inexistente", description: "Não há gestão formal do engajamento de stakeholders." },
      { value: 2, label: "Ocasional", description: "O engajamento ocorre esporadicamente, quando necessário." },
      { value: 3, label: "Planejado", description: "Existe um plano básico de engajamento de stakeholders." },
      { value: 4, label: "Ativo", description: "O engajamento é proativo, com monitoramento regular da satisfação." },
      { value: 5, label: "Estratégico", description: "Stakeholders são parceiros estratégicos, co-criando valor nos projetos." }
    ]
  },
  {
    id: "stake4",
    pillarId: "stakeholders",
    text: "Qual o grau de transparência e prestação de contas nos projetos?",
    context: "Verifica se há transparência adequada sobre progresso e decisões de projetos.",
    options: [
      { value: 1, label: "Opaco", description: "Há pouca ou nenhuma transparência sobre o andamento dos projetos." },
      { value: 2, label: "Limitado", description: "Informações são compartilhadas apenas quando solicitadas." },
      { value: 3, label: "Regular", description: "Existe comunicação regular, mas nem sempre completa." },
      { value: 4, label: "Transparente", description: "Há transparência proativa sobre progresso, problemas e decisões." },
      { value: 5, label: "Exemplar", description: "A transparência é total, com prestação de contas em tempo real e acesso aberto às informações." }
    ]
  },

  // PILAR 7: PESSOAS, CULTURA E COMPETÊNCIA
  {
    id: "people1",
    pillarId: "people",
    text: "Qual o nível de competência em gestão de projetos na organização?",
    context: "Avalia se a organização possui competências adequadas em gestão de projetos.",
    options: [
      { value: 1, label: "Inexistente", description: "Não há competências formais em gestão de projetos." },
      { value: 2, label: "Básico", description: "Algumas pessoas têm conhecimento básico, mas não há desenvolvimento sistemático." },
      { value: 3, label: "Estruturado", description: "Existe um programa de desenvolvimento de competências em gestão de projetos." },
      { value: 4, label: "Avançado", description: "A organização tem profissionais certificados e competências bem desenvolvidas." },
      { value: 5, label: "Excelência", description: "A organização é reconhecida pela excelência em gestão de projetos e desenvolve talentos continuamente." }
    ]
  },
  {
    id: "people2",
    pillarId: "people",
    text: "Como é a cultura organizacional em relação a projetos e mudanças?",
    context: "Mede se a cultura organizacional favorece projetos e transformações.",
    options: [
      { value: 1, label: "Resistente", description: "A cultura é resistente a mudanças e projetos são vistos como perturbação." },
      { value: 2, label: "Tolerante", description: "A organização tolera projetos, mas não os abraça ativamente." },
      { value: 3, label: "Receptiva", description: "Há receptividade a projetos e mudanças, mas ainda com reservas." },
      { value: 4, label: "Favorável", description: "A cultura favorece projetos e mudanças como oportunidades de melhoria." },
      { value: 5, label: "Transformadora", description: "A cultura é orientada para transformação contínua e inovação através de projetos." }
    ]
  },
  {
    id: "people3",
    pillarId: "people",
    text: "Qual o grau de colaboração e trabalho em equipe nos projetos?",
    context: "Avalia se existe colaboração efetiva entre áreas e pessoas nos projetos.",
    options: [
      { value: 1, label: "Silos", description: "Predominam silos funcionais com pouca colaboração." },
      { value: 2, label: "Limitada", description: "Há alguma colaboração, mas ainda predominam os silos." },
      { value: 3, label: "Coordenada", description: "Existe coordenação entre áreas, mas a colaboração é formal." },
      { value: 4, label: "Colaborativa", description: "Há colaboração genuína e trabalho em equipe efetivo." },
      { value: 5, label: "Integrada", description: "A colaboração é natural e integrada, com equipes multidisciplinares de alto desempenho." }
    ]
  },
  {
    id: "people4",
    pillarId: "people",
    text: "Como é realizado o desenvolvimento e retenção de talentos em gestão de projetos?",
    context: "Verifica se há estratégia para desenvolver e manter talentos em projetos.",
    options: [
      { value: 1, label: "Inexistente", description: "Não há foco no desenvolvimento de talentos em gestão de projetos." },
      { value: 2, label: "Ocasional", description: "O desenvolvimento ocorre esporadicamente, sem planejamento." },
      { value: 3, label: "Planejado", description: "Existe um plano básico de desenvolvimento de talentos." },
      { value: 4, label: "Estruturado", description: "Há um programa estruturado de desenvolvimento e carreira em gestão de projetos." },
      { value: 5, label: "Estratégico", description: "O desenvolvimento de talentos é estratégico, com foco em retenção e sucessão." }
    ]
  }
];

export const OSRL_LEVELS: OSRLLevel[] = [
  {
    level: 1,
    name: "Inicial (Ad-hoc & Caótico)",
    description: "Os processos são imprevisíveis, mal controlados e reativos. O sucesso depende inteiramente de esforços individuais heróicos, não de capacidades organizacionais. A organização não consegue repetir sucessos de forma consistente.",
    characteristics: [
      "Processos imprevisíveis e mal controlados",
      "Sucesso baseado em esforços individuais heróicos",
      "Falta de capacidades organizacionais estruturadas",
      "Incapacidade de repetir sucessos consistentemente",
      "Abordagem reativa aos problemas e desafios"
    ],
    recommendations: [
      "Estabelecer processos básicos de gestão de projetos",
      "Documentar procedimentos mínimos essenciais",
      "Definir responsabilidades e papéis básicos",
      "Criar comunicação estruturada inicial",
      "Investir em treinamento fundamental"
    ]
  },
  {
    level: 2,
    name: "Consciente (Processos Fragmentados)",
    description: "Existe uma consciência básica sobre a gestão de projetos, mas os processos são aplicados de forma inconsistente, geralmente dentro de silos funcionais. Não há um padrão organizacional, e as iniciativas são executadas de maneira reativa.",
    characteristics: [
      "Consciência básica sobre gestão de projetos",
      "Processos aplicados inconsistentemente",
      "Trabalho em silos funcionais",
      "Ausência de padrão organizacional",
      "Execução reativa de iniciativas"
    ],
    recommendations: [
      "Desenvolver metodologia básica padronizada",
      "Quebrar silos através de comunicação integrada",
      "Estabelecer padrões organizacionais mínimos",
      "Implementar planejamento proativo básico",
      "Criar visibilidade entre áreas funcionais"
    ]
  },
  {
    level: 3,
    name: "Estruturado (Processos Repetíveis)",
    description: "Poucos processos centrais de gestão de projetos são documentados e podem ser repetidos no nível do projeto. Existe um acompanhamento básico de custo e cronograma. O sucesso em projetos semelhantes pode ser repetido, mas é incerto.",
    characteristics: [
      "Processos centrais documentados e repetíveis",
      "Acompanhamento básico de custo e cronograma",
      "Capacidade de repetir sucessos em projetos similares",
      "Resultados ainda incertos e variáveis",
      "Controles básicos implementados"
    ],
    recommendations: [
      "Expandir processos para toda organização",
      "Incluir gestão de escopo e qualidade",
      "Desenvolver metodologias mais robustas",
      "Implementar métricas de desempenho",
      "Estabelecer gestão de riscos básica"
    ]
  },
  {
    level: 4,
    name: "Definido (Processos Padronizados)",
    description: "Um conjunto de processos padrão para toda a organização é definido e disponibilizado para uso em todos os projetos. A organização adota uma postura mais proativa do que reativa, com processos bem caracterizados e compreendidos.",
    characteristics: [
      "Processos padrão organizacionais definidos",
      "Disponibilidade para uso em todos os projetos",
      "Postura proativa predominante",
      "Processos bem caracterizados e compreendidos",
      "Metodologia unificada implementada"
    ],
    recommendations: [
      "Integrar com outras funções corporativas",
      "Desenvolver visão de portfólio",
      "Implementar gestão de benefícios",
      "Estabelecer métricas avançadas",
      "Criar centros de excelência"
    ]
  },
  {
    level: 5,
    name: "Integrado (Processos Institucionalizados)",
    description: "Os processos padrão são totalmente institucionalizados e integrados com outras funções corporativas (ex: finanças, RH). Uma visão de portfólio começa a emergir, permitindo um alinhamento mais amplo dos projetos com a estratégia.",
    characteristics: [
      "Processos completamente institucionalizados",
      "Integração com funções corporativas (finanças, RH)",
      "Visão de portfólio emergente",
      "Alinhamento amplo com estratégia organizacional",
      "Governança integrada estabelecida"
    ],
    recommendations: [
      "Implementar coleta de dados quantitativos",
      "Desenvolver análise de desempenho avançada",
      "Estabelecer decisões baseadas em dados",
      "Criar objetivos quantitativos de qualidade",
      "Implementar gestão de valor sistemática"
    ]
  },
  {
    level: 6,
    name: "Gerenciado (Medido Quantitativamente)",
    description: "A organização coleta e utiliza dados quantitativos para gerenciar o desempenho e a qualidade dos projetos. As decisões são cada vez mais baseadas em dados, e há objetivos quantitativos para a qualidade e o desempenho dos processos.",
    characteristics: [
      "Coleta e uso de dados quantitativos",
      "Gestão baseada em métricas de desempenho",
      "Decisões fundamentadas em dados",
      "Objetivos quantitativos de qualidade",
      "Controle estatístico de processos"
    ],
    recommendations: [
      "Implementar técnicas estatísticas avançadas",
      "Desenvolver capacidades preditivas",
      "Estabelecer modelos de previsão",
      "Criar análise de tendências",
      "Implementar controle quantitativo robusto"
    ]
  },
  {
    level: 7,
    name: "Preditivo (Controlado Quantitativamente)",
    description: "Técnicas estatísticas e quantitativas são usadas para controlar processos e prever resultados de desempenho. A organização pode prever de forma confiável os resultados dos projetos com base em dados históricos e modelos estatísticos.",
    characteristics: [
      "Uso de técnicas estatísticas e quantitativas",
      "Controle preditivo de processos",
      "Previsão confiável de resultados",
      "Modelos estatísticos estabelecidos",
      "Análise preditiva sistemática"
    ],
    recommendations: [
      "Focar em melhoria contínua de processos",
      "Identificar causas de variação",
      "Implementar inovação em processos",
      "Estabelecer cultura de excelência",
      "Desenvolver capacidades de otimização"
    ]
  },
  {
    level: 8,
    name: "Otimizado (Melhoria Contínua)",
    description: "A organização está focada na melhoria contínua dos processos, identificando e abordando as causas comuns de variação e desvio de desempenho. A inovação em processos é incentivada e gerenciada.",
    characteristics: [
      "Foco na melhoria contínua sistemática",
      "Identificação de causas de variação",
      "Abordagem proativa aos desvios",
      "Inovação em processos incentivada",
      "Gestão ativa da melhoria"
    ],
    recommendations: [
      "Desenvolver agilidade estratégica",
      "Implementar capacidade de adaptação rápida",
      "Estabelecer integração estratégia-execução",
      "Criar plataforma para inovação",
      "Desenvolver resposta eficaz a mudanças"
    ]
  },
  {
    level: 9,
    name: "Adaptativo (Agilidade Estratégica)",
    description: "Os processos estáveis e otimizados da organização fornecem uma plataforma para agilidade e inovação estratégica. A organização pode pivotar e responder a oportunidades e ameaças de forma eficaz, integrando perfeitamente a estratégia e a execução.",
    characteristics: [
      "Processos estáveis como plataforma de agilidade",
      "Inovação estratégica sistemática",
      "Capacidade de pivot eficaz",
      "Resposta ágil a oportunidades e ameaças",
      "Integração perfeita estratégia-execução"
    ],
    recommendations: [
      "Manter excelência e liderança no setor",
      "Compartilhar melhores práticas externamente",
      "Desenvolver ecossistema de inovação",
      "Estabelecer benchmarks para o mercado",
      "Cultivar cultura de transformação contínua"
    ]
  }
];

export function calculateOSRLLevel(responses: Record<string, number>): number {
  const scores = Object.values(responses).filter(score => score > 0);
  if (scores.length === 0) return 1;
  
  const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  
  // Map 1-5 scale to 1-9 O-SRL levels
  if (average <= 1.2) return 1;
  if (average <= 1.5) return 2;
  if (average <= 2.2) return 3;
  if (average <= 2.8) return 4;
  if (average <= 3.2) return 5;
  if (average <= 3.8) return 6;
  if (average <= 4.2) return 7;
  if (average <= 4.6) return 8;
  return 9;
}

export function calculatePillarScores(responses: Record<string, number>): Record<string, number> {
  const pillarScores: Record<string, number> = {};
  
  PILLARS.forEach(pillar => {
    const pillarQuestions = QUESTIONS.filter(q => q.pillarId === pillar.id);
    const pillarResponses = pillarQuestions
      .map(q => responses[q.id])
      .filter(score => score > 0);
    
    if (pillarResponses.length > 0) {
      const average = pillarResponses.reduce((sum, score) => sum + score, 0) / pillarResponses.length;
      pillarScores[pillar.id] = Math.round((average - 1) * 25); // Convert 1-5 to 0-100 scale
    } else {
      pillarScores[pillar.id] = 0;
    }
  });
  
  return pillarScores;
}
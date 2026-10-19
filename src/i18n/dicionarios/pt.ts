/**
 * Textos do site em português: é a referência. Os outros idiomas têm o tipo `Dicionario`
 * derivado daqui, então o TypeScript acusa qualquer texto faltando.
 * Marcadores {assim} são preenchidos com `preencher()` (i18n/formatar.ts).
 * Os títulos com destaque laranja vêm em duas partes: "A" (normal) e "B" (laranja).
 */

export type SecaoLegal = { titulo: string; paragrafos?: string[]; itens?: { rotulo?: string; texto: string }[] };

export const pt = {
  meta: {
    titulo: "VMD | Assessoria & Marketing Esportivo",
    descricao:
      "Assessoria especializada no fortalecimento da imagem, posicionamento e valorização de atletas. Conectamos atletas a técnicos e olheiros.",
    nomeSite: "VMD Assessoria & Marketing Esportivo",
    descricaoMarca: "Assessoria & Marketing Esportivo",
    idiomaContato: "Portuguese",
  },

  nav: {
    home: "Home",
    atletas: "Atletas",
    servicos: "Serviços",
    noticias: "Notícias",
    cadastro: "Cadastro",
    principal: "Principal",
    paginaInicial: "{nome} - página inicial",
    abrirMenu: "Abrir menu",
    fecharMenu: "Fechar menu",
    cta: "Quero ser VMD",
    pularConteudo: "Ir para o conteúdo",
  },

  idioma: {
    rotulo: "Idioma",
    escolher: "Escolher idioma (atual: {idioma})",
  },

  rodape: {
    texto: "Assessoria especializada no fortalecimento da imagem, posicionamento e valorização de atletas.",
    navegacao: "Navegação",
    contato: "Contato",
    direitos: "Todos os direitos reservados.",
    privacidade: "Política de Privacidade",
    mensagemWhats: "Olá! Vim pelo site da VMD e gostaria de mais informações.",
  },

  hero: {
    carrossel: "Destaques da VMD",
    slideRotulo: "slide",
    slideDe: "{n} de {total}",
    anterior: "Slide anterior",
    proximo: "Próximo slide",
    irPara: "Ir para o slide {n}: {nome}",
    rolarRotulo: "Rolar para a próxima seção",
    rolar: "Role",
    posterSobre: "Seu jogo",
    posterSelo: "Temp. 26",
    posterSob: "Em outro nível",
    /**
     * Slides da Hero, na ordem. `palavra` é a palavra gigante do pôster (quanto mais curta, maior).
     * O título tem as linhas normais e as em destaque (laranja). O primeiro slide traz o <h1> da Home.
     */
    slides: [
      {
        nome: "VMD",
        palavra: "VMD",
        eyebrow: "Assessoria & Marketing Esportivo",
        titulo: ["Transformamos", "presença digital em"],
        destaque: ["posicionamento", "profissional"],
        lead: "Assessoria especializada no fortalecimento da imagem, posicionamento e valorização de atletas.",
        ctas: [
          { texto: "Quero ser VMD", href: "/cadastro" },
          { texto: "Conhecer os atletas", href: "/atletas" },
        ],
      },
      {
        nome: "Imagem",
        palavra: "IMAGEM",
        eyebrow: "Imagem",
        titulo: ["Seu talento,"],
        destaque: ["bem", "apresentado"],
        lead: "Fotos, vídeos, identidade visual e media kit que mostram fora de campo o nível que você entrega dentro dele.",
        ctas: [
          { texto: "Ver serviços", href: "/#servicos" },
          { texto: "Quero ser VMD", href: "/cadastro" },
        ],
      },
      {
        nome: "Posicionamento",
        palavra: "FOCO",
        eyebrow: "Posicionamento",
        titulo: ["Seja visto"],
        destaque: ["por quem", "importa"],
        lead: "Estratégia de conteúdo e presença digital para chegar a técnicos, olheiros, clubes e patrocinadores.",
        ctas: [
          { texto: "Como funciona", href: "/#como-funciona" },
          { texto: "Quero ser VMD", href: "/cadastro" },
        ],
      },
      {
        nome: "Atletas",
        palavra: "ELENCO",
        eyebrow: "Para técnicos e olheiros",
        titulo: ["Talentos prontos"],
        destaque: ["para serem", "descobertos"],
        lead: "Perfis aprovados pela VMD, com números e vídeos. O contato é sempre intermediado pela VMD.",
        ctas: [
          { texto: "Buscar atletas", href: "/atletas" },
          { texto: "Ver notícias", href: "/noticias" },
        ],
      },
    ],
  },

  letreiro: {
    palavras: ["Imagem", "Posicionamento", "Valorização", "Media day", "Produção de vídeos", "Identidade visual", "Media kit", "Gestão de carreira"],
    pausar: "Pausar animação do letreiro",
    retomar: "Retomar animação do letreiro",
  },

  quemSomos: {
    fundo: "Propósito",
    eyebrow: "Sobre a VMD",
    tituloA: "Quem",
    tituloB: "somos?",
    pilares: [
      { titulo: "Imagem", texto: "Uma presença sólida e profissional fora de campo." },
      { titulo: "Posicionamento", texto: "Estratégia para ser visto por quem importa." },
      { titulo: "Valorização", texto: "Uma marca pessoal que cresce com a carreira." },
    ],
    abertura: "A VMD nasceu com o propósito de ajudar atletas a construírem uma presença digital forte, profissional e estratégica.",
    paragrafos: [
      "Acreditamos que o desempenho dentro das quadras, campos e arenas precisa ser acompanhado por uma imagem sólida fora delas.",
      "Mais do que criar artes e vídeos, buscamos fortalecer marcas pessoais, gerar reconhecimento e acompanhar de perto a trajetória de cada atleta.",
    ],
    citacao: "Mais do que clientes, construímos parcerias duradouras com os atletas que representamos.",
  },

  destaques: {
    fundo: "Elenco",
    eyebrow: "Nossos atletas",
    tituloA: "Resultados e",
    tituloB: "atletas",
    subtitulo: "Perfis aprovados e publicados pela equipe VMD.",
    vazio: "Em breve, novos atletas em destaque.",
    verTodos: "Ver todos os atletas",
    carrossel: "Atletas em destaque",
    anterior: "Atleta anterior",
    proximo: "Próximo atleta",
    verPerfil: "Ver perfil",
  },

  comoFunciona: {
    fundo: "Método",
    eyebrow: "Passo a passo",
    tituloA: "Como",
    tituloB: "funciona",
    passos: [
      { titulo: "Cadastro", texto: "Preencha seus dados e envie as informações do atleta (com autorização do responsável, se menor de 18 anos)." },
      { titulo: "Orçamento personalizado", texto: "Conversamos sobre sua modalidade e suas necessidades e enviamos uma proposta sob medida." },
      { titulo: "Perfil publicado", texto: "Nossa equipe revisa e aprova o perfil. Depois disso, ele fica visível para técnicos e olheiros." },
    ],
  },

  servicos: {
    fundo: "Serviços",
    eyebrow: "O que fazemos",
    tituloA: "Nossos",
    tituloB: "serviços",
    subtitulo: "Muito além de artes: comunicação completa para quem vive o esporte.",
    publicoRotulo: "Para quem trabalhamos",
    publico: ["Atletas", "Técnicos", "Profissionais do esporte", "Clubes e equipes", "Organizações esportivas"],
    preco: "Sem preço fixo: o valor é definido conforme a sua necessidade.",
    cta: "Solicitar orçamento",
    mensagem: "Olá! Vim pelo site da VMD e gostaria de solicitar um orçamento.",
    // Mesma ordem dos ícones em constants/servicos.ts
    grupos: [
      {
        titulo: "Artes e conteúdo",
        itens: ["Artes e materiais para partidas e competições", "Artes para patrocinadores e campanhas", "Produção de vídeos", "Media day"],
      },
      {
        titulo: "Divulgação e imprensa",
        itens: [
          "Conteúdos para divulgação de atletas e equipes",
          "Conteúdo para matérias e notícias esportivas",
          "Materiais de divulgação e comunicação para clubes, equipes e organizações esportivas",
          "Posicionamento digital",
        ],
      },
      {
        titulo: "Imagem e carreira",
        itens: [
          "Currículos e materiais de apresentação para atletas, técnicos e profissionais do esporte",
          "Identidade visual exclusiva",
          "Media kit profissional",
          "Preparação para entrevistas",
        ],
      },
    ],
  },

  tecnicos: {
    fundo: "Olheiros",
    eyebrow: "Busca de talentos",
    tituloA: "É técnico ou",
    tituloB: "olheiro?",
    texto:
      "Encontre atletas por esporte, posição, categoria e clube. O contato com o atleta é feito por meio da VMD, que intermedia a conversa e protege os dados de cada perfil.",
    cta: "Buscar atletas",
  },

  diferenciais: {
    fundo: "Diferencial",
    eyebrow: "Por que a VMD",
    tituloA: "Diferenciais",
    tituloB: "VMD",
    // Mesma ordem dos ícones em components/home/Diferenciais.tsx
    itens: [
      "Atendimento próximo e humanizado",
      "Estratégias personalizadas",
      "Gestão de imagem esportiva",
      "Produção de conteúdo profissional",
      "Organização de perfil",
      "Desenvolvimento de identidade visual",
      "Planejamento estratégico de conteúdo",
      "Equipe comprometida com a evolução do atleta",
    ],
  },

  ctaFinal: {
    eyebrow: "Próximo passo",
    tituloA: "Seu desempenho dentro de campo merece uma",
    tituloB: "presença forte fora dele.",
    cadastro: "Cadastre-se agora",
    whatsapp: "Falar no WhatsApp",
    mensagem: "Olá! Vim pelo site da VMD e quero saber como fortalecer minha imagem como atleta.",
  },

  atletas: {
    metaTitulo: "Atletas",
    metaDescricao: "Conheça os atletas representados pela VMD. Busque por esporte, posição, categoria e clube.",
    eyebrow: "Para técnicos e olheiros",
    tituloA: "Nossos",
    tituloB: "atletas",
    subtitulo: "Encontre atletas por esporte, posição, categoria e clube. O contato é sempre intermediado pela VMD.",
    busca: "Buscar atletas",
    nome: "Nome",
    buscarNome: "Buscar pelo nome",
    esporte: "Esporte",
    posicao: "Posição",
    categoria: "Categoria",
    clube: "Clube",
    todas: "Todas",
    limpar: "Limpar filtros",
    umEncontrado: "1 atleta encontrado",
    variosEncontrados: "{n} atletas encontrados",
    vazio: "Nenhum atleta com esses filtros. Tente outra combinação.",
    cardRotulo: "{nome}, {posicao}, {categoria}, {clube}. Ver perfil",
  },

  perfil: {
    naoEncontrado: "Atleta não encontrado",
    metaDescricao: "{nome}, {posicao} {categoria} do {clube}. Perfil, números e vídeos.",
    voltar: "Todos os atletas",
    ficha: {
      posicao: "Posição",
      categoria: "Categoria",
      camisa: "Camisa",
      altura: "Altura",
      peso: "Peso",
      pe: "Pé dominante",
      nacionalidade: "Nacionalidade",
      clube: "Clube",
    },
    camisa: "Camisa {n}",
    conquistas: "Conquistas",
    interesse: "Tenho interesse",
    verVideos: "Ver vídeos",
    aviso: "O contato é intermediado pela VMD, que protege os dados do atleta.",
    mensagem: "Olá! Sou técnico/olheiro e tenho interesse no atleta {nome} ({posicao}, {categoria}). Vi o perfil no site da VMD.",
    temporada: "Temporada {ano}",
    numerosA: "Números do",
    numerosB: "atleta",
    videosEyebrow: "Gols e lances",
    videosA: "Vídeos do",
    videosB: "atleta",
    imagemAlt: "Perfil do atleta na VMD",
    atletaPadrao: "Atleta VMD",
    atleta: "Atleta",
  },

  videos: {
    vazioAtleta: "Em breve, novos vídeos deste atleta.",
    filtrarTipo: "Filtrar vídeos por tipo",
    filtrarPorTipo: "Filtrar por tipo",
    todos: "Todos",
    tipos: { gol: "Gol", lance: "Lance", "melhores-momentos": "Melhores momentos" },
    tiposPlural: { gol: "Gols", lance: "Lances", "melhores-momentos": "Melhores momentos" },
    filtrarAtleta: "Filtrar por atleta",
    atleta: "Atleta",
    filtrarCompeticao: "Filtrar por competição",
    competicao: "Competição",
    nenhum: "Nenhum vídeo encontrado com esses filtros.",
    carregarMais: "Carregar mais",
    janela: "Vídeo: {titulo}",
    video: "Vídeo",
    fechar: "Fechar vídeo",
    emBreve: "O vídeo será publicado em breve.",
  },

  noticias: {
    metaTitulo: "Notícias",
    metaDescricao: "Gols, lances e melhores momentos dos atletas VMD, além das últimas notícias da assessoria.",
    eyebrow: "Gols e destaques",
    tituloA: "Os melhores momentos dos",
    tituloB: "nossos atletas.",
    assistir: "Assistir: {titulo}",
    destaqueSemana: "Destaque da semana",
    assistirAgora: "Assistir agora",
    ultimasEyebrow: "Notícias",
    ultimasA: "Últimas",
    ultimasB: "notícias.",
    vazio: "Em breve, novas notícias.",
    ctaA: "Seu talento merece",
    ctaB: "ser visto.",
    ctaBotao: "Fale com a VMD",
    ctaMensagem: "Olá! Vim pelo site da VMD e quero saber mais sobre a assessoria.",
    carrossel: "Últimas notícias, da mais recente para a mais antiga",
    pausar: "Pausar rolagem automática",
    retomar: "Retomar rolagem automática",
    recentes: "Notícias mais recentes",
    antigas: "Notícias mais antigas",
    lerMais: "Ler mais",
    imagem: "Foto · Imagem da notícia",
    voltar: "Todas as notícias",
    naoEncontrada: "Notícia não encontrada",
    corpoProvisorio: "Este é um texto provisório. O conteúdo completo da notícia será publicado pela equipe VMD pelo painel administrativo.",
    compartilhar: "Compartilhar no WhatsApp",
    outrasA: "Outras",
    outrasB: "notícias",
  },

  cadastro: {
    metaTitulo: "Cadastro de atleta",
    metaDescricao: "Quero ser VMD: cadastre o atleta e receba um orçamento personalizado de assessoria e marketing esportivo.",
    eyebrow: "Quero ser VMD",
    tituloA: "Cadastre o",
    tituloB: "atleta",
    subtitulo: "Conte quem é o atleta e o que ele procura. A partir daqui, a VMD monta um orçamento sob medida.",
    passos: [
      { titulo: "Preencha o cadastro", texto: "Leva cerca de 2 minutos." },
      { titulo: "Envie pelo WhatsApp", texto: "Seus dados chegam direto na equipe VMD." },
      { titulo: "Receba o orçamento", texto: "Uma proposta sob medida para o seu momento." },
    ],
    opcional: "(opcional)",
    umErro: "Há 1 campo para corrigir.",
    variosErros: "Há {n} campos para corrigir.",
    dadosAtleta: "Dados do atleta",
    nome: "Nome completo",
    nascimento: "Data de nascimento",
    nascimentoDica: "Usada para definir a categoria.",
    altura: "Altura (cm)",
    cidade: "Cidade",
    estado: "Estado",
    selecione: "Selecione",
    esporte: "Esporte",
    modalidade: "Modalidade",
    posicao: "Posição",
    posicaoExemplo: "Ex.: atacante",
    clube: "Clube ou equipe atual",
    midia: "Mídia e mensagem",
    instagram: "Instagram",
    instagramExemplo: "@seuperfil",
    video: "Link de um vídeo seu",
    videoDica: "YouTube, Instagram, Drive...",
    mensagem: "Conte um pouco sobre você e o que procura",
    responsavel: "Responsável legal",
    responsavelAviso: "Atletas menores de 18 anos precisam da autorização de um responsável.",
    responsavelNome: "Nome do responsável",
    responsavelAutoriza: "Sou o responsável legal e autorizo o cadastro do atleta.",
    consentimentoA: "Li e concordo com a",
    consentimentoLink: "Política de Privacidade",
    consentimentoB: ". Meus dados serão usados só para a VMD avaliar o perfil e entrar em contato.",
    enviar: "Enviar pelo WhatsApp",
    enviarDica: "O envio abre o WhatsApp com seus dados preenchidos. Nada fica salvo no site.",
    sucessoTitulo: "Quase lá!",
    sucessoA: "Abrimos o WhatsApp da VMD com os seus dados já preenchidos. É só",
    sucessoDestaque: "enviar a mensagem",
    sucessoB: "por lá para concluir o cadastro.",
    abrirDeNovo: "Abrir o WhatsApp de novo",
    editar: "Editar dados",
    /** Mensagens de erro: as chaves são os códigos usados em validations/atleta.schema.ts */
    erros: {
      nomeObrigatorio: "Informe o nome completo.",
      nomeLongo: "Nome muito longo.",
      textoLongo: "Texto muito longo.",
      nascimentoObrigatorio: "Informe a data de nascimento.",
      nascimentoInvalido: "Confira a data de nascimento.",
      cidadeObrigatoria: "Informe a cidade.",
      estadoObrigatorio: "Selecione o estado.",
      modalidadeObrigatoria: "Selecione a modalidade.",
      alturaInvalida: "Altura em centímetros, ex.: 178.",
      instagramInvalido: "Use só o @ do perfil, ex.: @atleta.",
      videoInvalido: "Cole um link começando com https://",
      responsavelObrigatorio: "Informe o nome do responsável.",
      autorizacaoObrigatoria: "O responsável precisa autorizar o cadastro.",
      consentimentoObrigatorio: "É preciso concordar com a Política de Privacidade.",
    },
  },

  privacidade: {
    metaTitulo: "Política de Privacidade",
    metaDescricao: "Como a VMD trata os dados pessoais de atletas, responsáveis e visitantes, conforme a LGPD.",
    eyebrow: "LGPD",
    tituloA: "Política de",
    tituloB: "Privacidade",
    atualizado: "Última atualização: {data}",
    // Só nas traduções: a versão em português é a que vale
    avisoTraducao: "",
    intro:
      'Esta política explica como a VMD Assessoria & Marketing Esportivo ("VMD") trata os dados pessoais de atletas, responsáveis e visitantes deste site, de acordo com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).',
    secoes: [
      {
        titulo: "1. Quais dados tratamos",
        itens: [
          {
            rotulo: "Cadastro de atleta:",
            texto:
              "nome, data de nascimento, cidade e estado, modalidade, posição, clube, altura, perfil no Instagram, link de vídeo e a mensagem que você escrever. Para menores de 18 anos, também o nome do responsável legal.",
          },
          {
            rotulo: "Perfil público do atleta:",
            texto:
              "somente com autorização, nome, posição, categoria, clube, dados físicos e esportivos, fotos e vídeos. Nunca publicamos data de nascimento, documentos, endereço ou contato.",
          },
          {
            rotulo: "Navegação:",
            texto: "o servidor registra dados técnicos mínimos (como endereço IP e data do acesso) para segurança e funcionamento do site.",
          },
        ],
      },
      {
        titulo: "2. Como o cadastro funciona",
        paragrafos: [
          "O formulário de cadastro não grava seus dados no site. Ao enviar, ele abre o seu WhatsApp com uma mensagem já preenchida para a VMD, e você decide se envia. A partir daí, a conversa segue as regras do WhatsApp (Meta).",
        ],
      },
      {
        titulo: "3. Para que usamos os dados",
        itens: [
          { texto: "Avaliar o perfil do atleta e preparar um orçamento personalizado;" },
          { texto: "Prestar os serviços contratados de assessoria, comunicação e marketing esportivo;" },
          { texto: "Publicar o perfil do atleta e intermediar o contato com técnicos e olheiros, quando autorizado." },
        ],
      },
      {
        titulo: "4. Bases legais",
        paragrafos: [
          "Tratamos os dados com base no consentimento do titular, na execução de contrato e no legítimo interesse para a segurança do site. Dados de crianças e adolescentes são tratados no seu melhor interesse e com o consentimento específico de pelo menos um dos pais ou responsável legal (art. 14 da LGPD).",
        ],
      },
      {
        titulo: "5. Compartilhamento",
        paragrafos: [
          "Não vendemos dados pessoais. O contato de técnicos e olheiros com o atleta é sempre intermediado pela VMD. Vídeos exibidos no site vêm do YouTube (modo de privacidade aprimorada) ou do Vimeo e só são carregados quando você clica para assistir.",
        ],
      },
      {
        titulo: "6. Cookies",
        paragrafos: [
          "O site não usa cookies de publicidade nem de rastreamento. O único cookie guarda o idioma que você escolheu. As fontes são servidas pelo próprio site, sem chamadas a terceiros.",
        ],
      },
      {
        titulo: "7. Por quanto tempo guardamos",
        paragrafos: [
          "Pelo tempo necessário para as finalidades acima ou enquanto durar a relação com o atleta. Depois disso, os dados são eliminados, salvo quando a lei exigir a guarda.",
        ],
      },
      {
        titulo: "8. Seus direitos",
        paragrafos: [
          "Você pode, a qualquer momento, pedir confirmação do tratamento, acesso, correção, anonimização ou eliminação dos dados, informações sobre compartilhamento e a revogação do consentimento, inclusive para retirar um perfil publicado.",
        ],
      },
    ] as SecaoLegal[],
    contatoTitulo: "9. Contato",
    contatoTexto: "Para exercer seus direitos ou tirar dúvidas sobre esta política, fale com a VMD pelo WhatsApp",
    voltar: "Voltar para o cadastro",
  },

  erro404: {
    eyebrow: "Erro 404",
    tituloA: "Página não",
    tituloB: "encontrada",
    texto: "O endereço que você acessou não existe ou foi removido.",
    home: "Voltar para a Home",
    atletas: "Ver atletas",
  },

  erro: {
    eyebrow: "Algo deu errado",
    tituloA: "Tivemos um",
    tituloB: "problema",
    texto: "Tente novamente em instantes.",
    tentar: "Tentar novamente",
    home: "Ir para a Home",
  },

  /** Imagem de prévia ao compartilhar o link do site. */
  og: {
    linhaA: "Transformamos presença digital em",
    linhaB: "posicionamento profissional.",
  },

  /**
   * Valores que vêm dos dados (cadastro/admin, sempre em português) e são traduzidos na exibição.
   * Valor sem tradução aparece como está.
   */
  valores: {
    posicoes: {
      Atacante: "Atacante",
      "Meio-campo": "Meio-campo",
      Zagueiro: "Zagueiro",
      Goleiro: "Goleiro",
      Lateral: "Lateral",
      Volante: "Volante",
    } as Record<string, string>,
    siglas: { Atacante: "ATA", "Meio-campo": "MEI", Zagueiro: "ZAG", Goleiro: "GOL", Lateral: "LAT", Volante: "VOL" } as Record<string, string>,
    modalidades: {
      Futebol: "Futebol",
      Futsal: "Futsal",
      Vôlei: "Vôlei",
      Basquete: "Basquete",
      Handebol: "Handebol",
      Outra: "Outra",
    } as Record<string, string>,
    pe: { Direito: "Direito", Esquerdo: "Esquerdo", Ambidestro: "Ambidestro" } as Record<string, string>,
    nacionalidades: { Brasileira: "Brasileira" } as Record<string, string>,
    /** "Sub-17" → texto do idioma; {n} é a idade. */
    sub: "Sub-{n}",
    categorias: { Profissional: "Profissional" } as Record<string, string>,
    estatisticas: {
      Jogos: "Jogos",
      Gols: "Gols",
      Assistências: "Assistências",
      Minutos: "Minutos",
      Desarmes: "Desarmes",
      Defesas: "Defesas",
      "Jogos sem sofrer gol": "Jogos sem sofrer gol",
    } as Record<string, string>,
  },
};

export type Dicionario = typeof pt;

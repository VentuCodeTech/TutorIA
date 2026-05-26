import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const AREA_MAP: Record<string, string[]> = {
  'Matematica': ['Matematica', 'Matematica Financeira'],
  'Portugues': ['Portugues'],
  'Historia': ['Historia'],
  'Ciencias': ['Biologia', 'Quimica', 'Fisica'],
  'Fisica': ['Fisica'],
  'Quimica': ['Quimica'],
  'Biologia': ['Biologia'],
  'Redacao': ['Redacao'],
  'Direito Constitucional': ['Direito Constitucional'],
  'Direito Civil': ['Direito Civil'],
  'Direito Penal': ['Direito Penal'],
  'Direito Trabalhista': ['Direito Trabalhista'],
  'Financas Pessoais': ['Financas Pessoais', 'Investimentos', 'Matematica Financeira'],
  'Investimentos': ['Investimentos', 'Matematica Financeira'],
  'CPA-20': ['Investimentos', 'Matematica Financeira', 'Financas Pessoais'],
  'Geografia': ['Geografia'],
  'Ingles': ['Ingles'],
  'Espanhol': ['Espanhol'],
};

function normalizeStr(s: string): string {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

function matchesArea(questionSubject: string, selectedArea: string): boolean {
  if (selectedArea === 'Todas') return true;
  const normArea = normalizeStr(selectedArea);
  const normSubj = normalizeStr(questionSubject);
  if (normSubj === normArea || normSubj.includes(normArea) || normArea.includes(normSubj)) return true;
  const mappedSubjects = AREA_MAP[selectedArea] || [];
  return mappedSubjects.some(ms => normalizeStr(ms) === normSubj || normSubj.includes(normalizeStr(ms)));
}

const questionBank = [
  { subject: 'Matematica', difficulty: 'Facil', text: '(ENEM 2024) Um comerciante comprou uma mercadoria por R$ 120,00 e a vendeu com 25% de lucro. Por quanto ele vendeu?', options: ['R$ 145,00', 'R$ 150,00', 'R$ 155,00', 'R$ 160,00'], correctAnswer: 1, explanation: 'Lucro de 25%: 120 x 1,25 = R$ 150,00' },
  { subject: 'Matematica', difficulty: 'Facil', text: '(ENEM 2023) Qual e o valor de 2^10?', options: ['512', '1000', '1024', '2048'], correctAnswer: 2, explanation: '2^10 = 1024' },
  { subject: 'Matematica', difficulty: 'Facil', text: '(ENEM 2022) A media aritmetica de 5, 8, 11 e 16 e:', options: ['9', '10', '11', '12'], correctAnswer: 1, explanation: '(5+8+11+16)/4 = 40/4 = 10' },
  { subject: 'Matematica', difficulty: 'Medio', text: '(FUVEST 2024) Uma PA tem primeiro termo 3 e razao 4. Qual e o 10 termo?', options: ['35', '39', '40', '43'], correctAnswer: 1, explanation: 'an = 3 + (10-1)x4 = 3+36 = 39' },
  { subject: 'Matematica', difficulty: 'Medio', text: '(ENEM 2024) Em um triangulo retangulo, os catetos medem 3cm e 4cm. Qual e a hipotenusa?', options: ['5 cm', '6 cm', '7 cm', '8 cm'], correctAnswer: 0, explanation: 'h^2 = 9+16 = 25, h = 5 cm' },
  { subject: 'Matematica', difficulty: 'Medio', text: '(ENEM 2023) Se log2 = 0,301 e log3 = 0,477, qual e o valor de log6?', options: ['0,602', '0,778', '0,903', '1,204'], correctAnswer: 1, explanation: 'log6 = log(2x3) = log2 + log3 = 0,301 + 0,477 = 0,778' },
  { subject: 'Matematica', difficulty: 'Dificil', text: '(UNICAMP 2024) Calcule o limite de (x^2-4)/(x-2) quando x->2.', options: ['0', '2', '4', 'Indefinido'], correctAnswer: 2, explanation: 'Fatorando: (x-2)(x+2)/(x-2) = x+2. Quando x->2: 4' },
  { subject: 'Matematica', difficulty: 'Dificil', text: "(FUVEST 2025) A derivada de f(x) = x^3 - 3x^2 + 2x - 1 e:", options: ['3x^2 - 6x', '3x^2 - 6x + 2', 'x^2 - 6x + 2', '3x^2 + 2'], correctAnswer: 1, explanation: "f'(x) = 3x^2 - 6x + 2" },
  { subject: 'Matematica', difficulty: 'Facil', text: '(ENEM 2025) Quanto e 30% de 250?', options: ['65', '70', '75', '80'], correctAnswer: 2, explanation: '250 x 0,30 = 75' },
  { subject: 'Matematica', difficulty: 'Medio', text: '(ENEM 2023) A equacao x^2 - 5x + 6 = 0 tem como raizes:', options: ['x=1 e x=6', 'x=2 e x=3', 'x=-2 e x=-3', 'x=2 e x=-3'], correctAnswer: 1, explanation: 'Delta = 25-24=1; x = (5+-1)/2, logo x=3 ou x=2' },
  { subject: 'Portugues', difficulty: 'Facil', text: '(ENEM 2024) Qual alternativa apresenta um exemplo de metafora?', options: ['"Ela canta como um passaro."', '"A vida e um sonho."', '"Sorriso de crianca e alegria."', '"O estudante, cansado, dormiu."'], correctAnswer: 1, explanation: 'Metafora: comparacao implicita sem conectivos. "A vida e um sonho".' },
  { subject: 'Portugues', difficulty: 'Facil', text: '(ENEM 2023) Qual a classe gramatical da palavra "belo" em "Que belo dia!"?', options: ['Substantivo', 'Adjetivo', 'Adverbio', 'Artigo'], correctAnswer: 1, explanation: '"belo" e adjetivo pois qualifica o substantivo "dia".' },
  { subject: 'Portugues', difficulty: 'Medio', text: '(FUVEST 2024) A oracao subordinada adverbial causal em "Como chegou cedo, pode organizar tudo" e:', options: ['pode organizar tudo', 'Como chegou cedo', 'organizar tudo', 'Chegou cedo'], correctAnswer: 1, explanation: '"Como chegou cedo" exprime causa da acao principal.' },
  { subject: 'Portugues', difficulty: 'Medio', text: '(ENEM 2024) A palavra "saudade" e considerada intraduzivel por expressar:', options: ['Alegria intensa', 'Melancolica lembranca de algo amado e ausente', 'Desejo de conquista', 'Medo do desconhecido'], correctAnswer: 1, explanation: 'Saudade expressa nostalgia melancolica por algo/alguem ausente.' },
  { subject: 'Portugues', difficulty: 'Dificil', text: '(UNICAMP 2025) Identifique o periodo composto por subordinacao no trecho: "Ele disse que viria."', options: ['Periodo simples', 'Coordenacao', 'Subordinacao', 'Justaposicao'], correctAnswer: 2, explanation: '"que viria" e oracao subordinada substantiva objetiva direta.' },
  { subject: 'Portugues', difficulty: 'Facil', text: '(ENEM 2025) Em qual alternativa ha crase obrigatoria?', options: ['Ela foi a escola.', 'Vou a Paris.', 'Refiro-me a ela.', 'Voou a 300km/h.'], correctAnswer: 0, explanation: 'Crase ocorre antes de feminino: "a escola" (Artigo+preposicao). Paris nao tem artigo.' },
  { subject: 'Portugues', difficulty: 'Medio', text: '(ENEM 2023) O uso das aspas em "Os politicos sempre cumprem suas promessas" indica:', options: ['Citacao direta', 'Ironia', 'Destaque grafico', 'Neologismo'], correctAnswer: 1, explanation: 'Aspas para marcar ironia ou sentido diferente do literal.' },
  { subject: 'Historia', difficulty: 'Facil', text: '(ENEM 2024) A independencia do Brasil em 1822 foi proclamada por:', options: ['Dom Joao VI', 'Dom Pedro I', 'Jose Bonifacio', 'Tiradentes'], correctAnswer: 1, explanation: 'Dom Pedro I proclamou a Independencia em 7 de setembro de 1822.' },
  { subject: 'Historia', difficulty: 'Facil', text: '(ENEM 2023) O lema da Revolucao Francesa (1789) foi:', options: ['Paz, Terra e Pao', 'Liberdade, Igualdade, Fraternidade', 'Ordem e Progresso', 'Todos pelo povo'], correctAnswer: 1, explanation: '"Liberte, Egalite, Fraternite" representava os ideais iluministas.' },
  { subject: 'Historia', difficulty: 'Medio', text: '(ENEM 2024) O Plano Marshall (1947) visava principalmente:', options: ['Reconstruir a Europa e conter o comunismo', 'Criar a OTAN', 'Fundar o Banco Mundial', 'Descolonizar a Africa'], correctAnswer: 0, explanation: 'Plano Marshall: ajuda economica dos EUA para reconstrucao da Europa Ocidental pos-2a Guerra.' },
  { subject: 'Historia', difficulty: 'Medio', text: '(ENEM 2025) A Proclamacao da Republica no Brasil (1889) foi liderada principalmente por:', options: ['Rui Barbosa', 'Deodoro da Fonseca', 'Floriano Peixoto', 'Benjamin Constant'], correctAnswer: 1, explanation: 'Marechal Deodoro da Fonseca liderou o movimento que derrubou a monarquia.' },
  { subject: 'Historia', difficulty: 'Dificil', text: '(FUVEST 2025) O Estado Novo (1937-1945) de Getulio Vargas caracterizou-se por:', options: ['Democracia liberal e multipartidarismo', 'Ditadura com censura, nacionalismo e industrializacao', 'Federalismo e descentralizacao', 'Privatizacoes e abertura economica'], correctAnswer: 1, explanation: 'O Estado Novo foi um regime autoritario com censura, trabalhismo e industrializacao.' },
  { subject: 'Historia', difficulty: 'Facil', text: '(ENEM 2022) A Segunda Guerra Mundial terminou em:', options: ['1943', '1944', '1945', '1946'], correctAnswer: 2, explanation: 'A 2a Guerra Mundial terminou em 1945 com a rendição da Alemanha (maio) e do Japao (setembro).' },
  { subject: 'Geografia', difficulty: 'Facil', text: '(ENEM 2024) O fenomeno El Nino e caracterizado pelo aquecimento anormal das aguas do:', options: ['Oceano Atlantico Norte', 'Oceano Indico', 'Oceano Pacifico Tropical', 'Mar do Caribe'], correctAnswer: 2, explanation: 'El Nino: aquecimento anormal do Pacifico Tropical entre Australia e America do Sul.' },
  { subject: 'Geografia', difficulty: 'Medio', text: '(ENEM 2024) A urbanizacao no Brasil intensificou-se principalmente a partir de:', options: ['1822', '1889', '1950', '1985'], correctAnswer: 2, explanation: 'Exodo rural e urbanizacao acelerada a partir dos anos 1950, com industrializacao.' },
  { subject: 'Geografia', difficulty: 'Medio', text: '(ENEM 2023) O bioma brasileiro que ocupa maior area do territorio nacional e:', options: ['Cerrado', 'Mata Atlantica', 'Amazonia', 'Caatinga'], correctAnswer: 2, explanation: 'A Amazonia ocupa cerca de 49% do territorio brasileiro, sendo o maior bioma.' },
  { subject: 'Geografia', difficulty: 'Dificil', text: '(FUVEST 2025) O processo de desertificacao no Nordeste brasileiro associa-se principalmente a:', options: ['Excesso de chuvas', 'Uso inadequado do solo e desmatamento', 'Industrializacao acelerada', 'Expansao da soja'], correctAnswer: 1, explanation: 'Desertificacao no Semiarido: uso inadequado do solo, desmatamento e pressao sobre recursos hidricos.' },
  { subject: 'Geografia', difficulty: 'Facil', text: '(ENEM 2025) Qual e a capital federal do Brasil?', options: ['Sao Paulo', 'Rio de Janeiro', 'Brasilia', 'Salvador'], correctAnswer: 2, explanation: 'Brasilia e a capital federal do Brasil desde 1960.' },
  { subject: 'Biologia', difficulty: 'Facil', text: '(ENEM 2024) Qual processo permite as plantas produzir alimento usando luz solar?', options: ['Respiracao celular', 'Fotossintese', 'Fermentacao', 'Digestao'], correctAnswer: 1, explanation: 'Fotossintese: conversao de luz solar, CO2 e agua em glicose e oxigenio.' },
  { subject: 'Biologia', difficulty: 'Medio', text: '(ENEM 2024) O DNA e composto por nucleotideos formados por:', options: ['Aminoacido, fosfato e ribose', 'Base nitrogenada, fosfato e desoxirribose', 'Base nitrogenada, sulfato e glicose', 'Adenina, timina e glicose'], correctAnswer: 1, explanation: 'Nucleotideo do DNA = base nitrogenada + fosfato + desoxirribose.' },
  { subject: 'Biologia', difficulty: 'Medio', text: '(ENEM 2023) O processo de divisao celular que gera gametas e denominado:', options: ['Mitose', 'Meiose', 'Amitose', 'Cariocinese'], correctAnswer: 1, explanation: 'Meiose: divisao que gera celulas haploides (gametas), com reducao do numero cromossomico.' },
  { subject: 'Biologia', difficulty: 'Dificil', text: '(UNICAMP 2025) A teoria sintetica da evolucao combina a selecao natural de Darwin com:', options: ['Lamarckismo', 'Genetica Mendeliana e Mutacoes', 'Epigenetica', 'Transformismo'], correctAnswer: 1, explanation: 'Teoria sintetica (neodarwinismo) une selecao natural com genetica mendeliana e mutacoes.' },
  { subject: 'Biologia', difficulty: 'Facil', text: '(ENEM 2025) A malaria e transmitida pelo mosquito:', options: ['Aedes aegypti', 'Anopheles', 'Culex', 'Mansonia'], correctAnswer: 1, explanation: 'A malaria e transmitida pelo mosquito Anopheles (femea infectada com Plasmodium).' },
  { subject: 'Fisica', difficulty: 'Facil', text: '(ENEM 2024) Um corpo parte do repouso com aceleracao de 4 m/s2. Velocidade apos 5s:', options: ['10 m/s', '15 m/s', '20 m/s', '25 m/s'], correctAnswer: 2, explanation: 'v = v0 + at = 0 + 4x5 = 20 m/s' },
  { subject: 'Fisica', difficulty: 'Medio', text: '(ENEM 2023) A velocidade da luz no vacuo e aproximadamente:', options: ['3x10^6 m/s', '3x10^8 m/s', '3x10^10 m/s', '3x10^12 m/s'], correctAnswer: 1, explanation: 'c = 3x10^8 m/s (300.000 km/s).' },
  { subject: 'Fisica', difficulty: 'Medio', text: '(ENEM 2024) A Lei de Ohm relaciona tensao (V), corrente (I) e resistencia (R) como:', options: ['V = R/I', 'V = I + R', 'V = I x R', 'I = V x R'], correctAnswer: 2, explanation: 'Lei de Ohm: V = R x I (tensao = resistencia x corrente).' },
  { subject: 'Fisica', difficulty: 'Dificil', text: '(FUVEST 2025) A energia cinetica de um corpo de massa m e velocidade v e dada por:', options: ['E = mv', 'E = m/v^2', 'E = mv^2/2', 'E = 2mv'], correctAnswer: 2, explanation: 'Ec = (1/2)mv^2 (Joules, com m em kg e v em m/s).' },
  { subject: 'Fisica', difficulty: 'Facil', text: '(ENEM 2025) Um objeto de massa 10kg em queda livre (g=10m/s2). Seu peso e:', options: ['1 N', '10 N', '100 N', '1000 N'], correctAnswer: 2, explanation: 'P = m x g = 10 x 10 = 100 N.' },
  { subject: 'Quimica', difficulty: 'Facil', text: '(ENEM 2024) O pH de uma solucao neutra e:', options: ['0', '7', '14', '1'], correctAnswer: 1, explanation: 'pH = 7 indica neutralidade. pH < 7 acido; pH > 7 basico.' },
  { subject: 'Quimica', difficulty: 'Medio', text: '(ENEM 2023) A reacao de neutralizacao ocorre entre:', options: ['Acido e sal', 'Acido e base', 'Base e oxido', 'Sal e metal'], correctAnswer: 1, explanation: 'Neutralizacao: acido + base -> sal + agua.' },
  { subject: 'Quimica', difficulty: 'Medio', text: '(ENEM 2024) O gas carbono (CO2) e classificado como um oxido:', options: ['Basico', 'Anfotero', 'Acido', 'Neutro'], correctAnswer: 2, explanation: 'CO2 reage com agua formando acido carbonico (H2CO3), sendo oxido acido.' },
  { subject: 'Quimica', difficulty: 'Dificil', text: '(UNICAMP 2025) A entalpia de formacao do H2O liquida e -286 kJ/mol. O que significa o sinal negativo?', options: ['Reacao endotermica', 'Reacao exotermica', 'Reacao em equilibrio', 'Reacao reversivel'], correctAnswer: 1, explanation: 'Delta H negativo indica reacao exotermica (libera energia para o ambiente).' },
  { subject: 'Quimica', difficulty: 'Facil', text: '(ENEM 2025) O numero atomico do carbono e 6. Quantos protons tem seu nucleo?', options: ['3', '6', '12', '14'], correctAnswer: 1, explanation: 'Numero atomico = numero de protons. Carbono (C) tem 6 protons.' },
  { subject: 'Direito Constitucional', difficulty: 'Facil', text: '(OAB 2024) De acordo com a CF/88, o prazo do mandato do Presidente da Republica e:', options: ['4 anos, com 1 reeleicao', '4 anos, sem reeleicao', '5 anos, com 1 reeleicao', '6 anos, sem reeleicao'], correctAnswer: 0, explanation: 'Art. 82 CF/88: mandato de 4 anos, permitida uma reeleicao.' },
  { subject: 'Direito Constitucional', difficulty: 'Medio', text: '(OAB 2024) A acao que protege direito liquido e certo nao amparado por habeas corpus ou habeas data e:', options: ['Acao Popular', 'Mandado de Seguranca', 'Mandado de Injuncao', 'Habeas Data'], correctAnswer: 1, explanation: 'Mandado de Seguranca (art. 5, LXIX CF/88) protege direito liquido e certo.' },
  { subject: 'Direito Constitucional', difficulty: 'Medio', text: '(OAB 2025) Os direitos fundamentais previstos na CF/88 tem aplicacao:', options: ['Imediata apenas para cidadaos natos', 'Imediata (art. 5, par.1)', 'Mediata, dependendo de lei', 'Restrita a situacoes de paz'], correctAnswer: 1, explanation: 'Art. 5, paragrafo 1 CF/88: normas definidoras de direitos fundamentais tem aplicabilidade imediata.' },
  { subject: 'Direito Constitucional', difficulty: 'Dificil', text: '(OAB 2025) O principio da proporcionalidade no direito constitucional e composto por:', options: ['Adequacao, necessidade e proporcionalidade em sentido estrito', 'Razoabilidade, igualdade e legalidade', 'Dignidade, liberdade e igualdade', 'Moralidade, eficiencia e publicidade'], correctAnswer: 0, explanation: 'Proporcionalidade: subprincipios da adequacao (aptidao), necessidade (menor sacrificio) e proporcionalidade em sentido estrito (ponderacao).' },
  { subject: 'Direito Constitucional', difficulty: 'Facil', text: '(OAB 2023) O principio que veda a retroatividade da lei penal mais severa e:', options: ['Legalidade', 'Anterioridade', 'Irretroatividade', 'Insignificancia'], correctAnswer: 2, explanation: 'Irretroatividade: a lei penal mais grave nao retroage. A lei mais benigna retroage (art. 5, XL CF/88).' },
  { subject: 'Direito Civil', difficulty: 'Facil', text: '(OAB 2024) Segundo o Codigo Civil, a capacidade civil plena e adquirida aos:', options: ['16 anos', '18 anos', '21 anos', '14 anos'], correctAnswer: 1, explanation: 'Art. 5 CC/2002: menoridade cessa aos 18 anos.' },
  { subject: 'Direito Civil', difficulty: 'Medio', text: '(OAB 2025) O prazo de prescricao para cobranca de dividas em geral, segundo o CC/2002, e:', options: ['1 ano', '3 anos', '5 anos', '10 anos'], correctAnswer: 3, explanation: 'Art. 205 CC: prescricao geral de 10 anos.' },
  { subject: 'Direito Civil', difficulty: 'Dificil', text: '(OAB 2025) Na responsabilidade civil objetiva, dispensa-se a prova de:', options: ['Nexo causal', 'Dano', 'Culpa', 'Conduta'], correctAnswer: 2, explanation: 'Responsabilidade objetiva: prescinde de culpa (art. 927, paragrafo unico CC). Exige-se dano, conduta e nexo causal.' },
  { subject: 'Direito Penal', difficulty: 'Medio', text: '(OAB 2024) O principio da insignificancia (bagatela) afasta:', options: ['Tipicidade formal', 'Tipicidade material', 'Culpabilidade', 'Antijuridicidade'], correctAnswer: 1, explanation: 'Principio da insignificancia afasta a tipicidade material por ausencia de lesao significativa.' },
  { subject: 'Direito Penal', difficulty: 'Dificil', text: '(OAB 2025) O elemento subjetivo do crime doloso e:', options: ['Negligencia', 'Imprudencia', 'Imperitia', 'Dolo (vontade e consciencia)'], correctAnswer: 3, explanation: 'Dolo direto: vontade livre e consciente de praticar o tipo penal.' },
  { subject: 'Direito Trabalhista', difficulty: 'Facil', text: '(OAB 2024) O prazo minimo de ferias anuais do trabalhador com CLT e:', options: ['15 dias', '20 dias', '30 dias', '45 dias'], correctAnswer: 2, explanation: 'Art. 130 CLT: ferias de 30 dias corridos para ate 5 faltas injustificadas no periodo.' },
  { subject: 'Direito Trabalhista', difficulty: 'Medio', text: '(OAB 2025) O aviso previo trabalhado corresponde a quantos dias para contratos de ate 1 ano?', options: ['15 dias', '30 dias', '45 dias', '60 dias'], correctAnswer: 1, explanation: 'Art. 487 CLT: aviso previo minimo de 30 dias. Acrescenta-se 3 dias por ano alem de 1, ate 90 dias.' },
  { subject: 'Investimentos', difficulty: 'Facil', text: '(CPA-20 2024) O Tesouro Selic e uma aplicacao em:', options: ['Renda variavel com alto risco', 'Renda fixa indexada a taxa Selic', 'Fundos de acoes da bolsa', 'Derivativos financeiros'], correctAnswer: 1, explanation: 'Tesouro Selic (LFT) e titulo publico de renda fixa indexado a taxa Selic.' },
  { subject: 'Investimentos', difficulty: 'Medio', text: '(CPA-20 2024) Um capital de R$10.000 a juros compostos de 10%a.a. por 2 anos rende:', options: ['R$2.000', 'R$2.100', 'R$2.500', 'R$12.100'], correctAnswer: 1, explanation: 'M = 10000(1,1)^2 = 12.100. Rendimento = R$2.100.' },
  { subject: 'Investimentos', difficulty: 'Dificil', text: '(CPA-20 2025) O VaR (Value at Risk) de uma carteira representa:', options: ['Retorno esperado maximo', 'Perda maxima esperada em dado nivel de confianca e horizonte', 'Volatilidade historica media', 'Correlacao entre ativos'], correctAnswer: 1, explanation: 'VaR: medida de risco que estima a perda maxima provavel dado um nivel de confianca (ex: 95%) e horizonte temporal.' },
  { subject: 'Investimentos', difficulty: 'Facil', text: '(CPA-20 2025) O Fundo Garantidor de Creditos (FGC) garante depositos ate:', options: ['R$100.000', 'R$250.000', 'R$500.000', 'R$1.000.000'], correctAnswer: 1, explanation: 'FGC garante ate R$250.000 por CPF/CNPJ por instituicao financeira.' },
  { subject: 'Matematica Financeira', difficulty: 'Medio', text: '(CPA-20 2024) A taxa equivalente anual de uma taxa mensal de 1% ao mes e:', options: ['12%', '12,68%', '13,2%', '15%'], correctAnswer: 1, explanation: '(1+0,01)^12 - 1 = 1,12683... - 1 = 12,68%a.a. (juros compostos)' },
  { subject: 'Redacao', difficulty: 'Medio', text: '(ENEM 2024) Na redacao dissertativo-argumentativa do ENEM, a competencia V avalia:', options: ['Dominio da norma padrao', 'Mecanismos linguisticos', 'Proposta de intervencao detalhada e articulada', 'Coesao e coerencia'], correctAnswer: 2, explanation: 'Competencia V: proposta de intervencao com agente, acao, modo, efeito e destinatario.' },
  { subject: 'Redacao', difficulty: 'Facil', text: '(ENEM 2023) O genero textual da redacao do ENEM e:', options: ['Narrativo', 'Lirico', 'Dissertativo-argumentativo', 'Descritivo'], correctAnswer: 2, explanation: 'A redacao do ENEM deve ser dissertativo-argumentativa com proposta de intervencao.' },
  { subject: 'Ingles', difficulty: 'Facil', text: '(ENEM 2024) Which sentence is in the Simple Past tense?', options: ['She is walking.', 'She walked home.', 'She will walk.', 'She has walked.'], correctAnswer: 1, explanation: '"walked" is the regular past form of "walk" in Simple Past tense.' },
  { subject: 'Ingles', difficulty: 'Medio', text: '(ENEM 2023) The phrasal verb "give up" means:', options: ['to donate', 'to quit or stop doing something', 'to give a present', 'to look up'], correctAnswer: 1, explanation: '"Give up" = desistir, parar de fazer algo.' },
  { subject: 'Espanhol', difficulty: 'Facil', text: '(ENEM 2024) En espanol, como se dice "yo como"?', options: ['Yo coma', 'Yo como', 'Yo comia', 'Yo come'], correctAnswer: 1, explanation: '"Yo como" e a forma correta do presente do indicativo para "comer" na 1a pessoa.' },
  { subject: 'Espanhol', difficulty: 'Medio', text: '(ENEM 2023) Cual es el sinonimo de "feliz" en espanol?', options: ['Triste', 'Dichoso', 'Asustado', 'Enfadado'], correctAnswer: 1, explanation: '"Dichoso" e sinonimo de "feliz" em espanhol.' },
  { subject: 'Financas Pessoais', difficulty: 'Facil', text: '(Concurso 2024) O orcamento pessoal equilibrado recomenda que a poupanca corresponda a pelo menos:', options: ['1% da renda', '5% da renda', '10% da renda', '50% da renda'], correctAnswer: 2, explanation: 'Regra dos especialistas: poupar ao menos 10% da renda bruta mensal.' },
  { subject: 'Financas Pessoais', difficulty: 'Medio', text: '(Concurso 2025) O conceito de juros compostos e fundamental pois:', options: ['O juro e calculado apenas sobre o capital inicial', 'O juro e calculado sobre o montante crescente (juro sobre juro)', 'A taxa e fixa independente do prazo', 'Nao existe variacao ao longo do tempo'], correctAnswer: 1, explanation: 'Juros compostos: juros incidem sobre o montante acumulado (capital + juros anteriores).' },
];

export async function POST(request: NextRequest) {
  try {
    const { area, difficulty, excludeTexts, vestibular, context } = await request.json();
    const excluded: string[] = excludeTexts || [];

    // Try Gemini AI first
    try {
      const areaText = area === 'Todas' ? 'qualquer area do ENEM, FUVEST, UNICAMP, OAB ou CPA-20' : area;
      const diffText = difficulty === 'Todas' ? 'aleatoria' : difficulty;
      const excludeHint = excluded.length > 0 ? ` NAO repita: ${excluded.slice(-3).join(' | ')}` : '';
      const vestibularCtx = vestibular ? ` Estilo: ${vestibular}.` : '';
      const contextHint = context ? ` ${context}.` : '';
      const randomSeed = Math.floor(Math.random() * 10000);

      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const prompt = `Gere UMA questao NOVA e ORIGINAL de multipla escolha sobre ${areaText} com dificuldade ${diffText} para estudantes brasileiros.${excludeHint}${vestibularCtx}${contextHint}
Baseie-se em questoes de vestibulares reais (ENEM 2024-2025, FUVEST, UNICAMP, OAB, CPA-20, CESPE). Randomizador: ${randomSeed}.
IMPORTANTE: A questao deve ser EXCLUSIVAMENTE sobre a area "${area === 'Todas' ? 'qualquer materia' : area}". NAO gere questoes de outras areas.
Retorne APENAS JSON valido sem markdown:
{"text":"enunciado?","options":["A","B","C","D"],"correctAnswer":0,"explanation":"explicacao","subject":"${area === 'Todas' ? 'defina a materia' : area}","difficulty":"${difficulty === 'Todas' ? 'Medio' : difficulty}","source":"ENEM 2025 (adaptada)"}`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const question = JSON.parse(jsonMatch[0]);
        // FIX: Validate that AI question subject matches the requested area
        const subjectMatchesArea = area === 'Todas' || matchesArea(question.subject || area, area);
        if (question.text && question.options && question.options.length === 4 && !excluded.includes(question.text) && subjectMatchesArea) {
          // Ensure subject is set correctly
          if (area !== 'Todas') question.subject = area;
          question.id = `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          return NextResponse.json({ question });
        }
      }
    } catch (aiError) {
      console.log('AI unavailable, using question bank:', aiError);
    }

    // Fallback: local question bank
    let filtered = questionBank.filter(q => !excluded.includes(q.text));
    if (filtered.length === 0) filtered = [...questionBank];

    // Filter by area
    if (area && area !== 'Todas') {
      const byArea = filtered.filter(q => matchesArea(q.subject, area));
      if (byArea.length > 0) filtered = byArea;
    }

    // Filter by difficulty
    if (difficulty && difficulty !== 'Todas') {
      const normDiff = normalizeStr(difficulty);
      const byDiff = filtered.filter(q => normalizeStr(q.difficulty) === normDiff);
      if (byDiff.length > 0) filtered = byDiff;
    }

    const randomQ = filtered[Math.floor(Math.random() * filtered.length)];
    const question = {
      ...randomQ,
      id: `bank_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    return NextResponse.json({ question });
  } catch (error) {
    console.error('Error generating question:', error);
    return NextResponse.json({ error: 'Failed to generate question' }, { status: 500 });
  }
    }

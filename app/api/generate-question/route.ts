import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

const questionBank = [
  { subject: 'Matematica', difficulty: 'Facil', text: 'Qual e o resultado de 15% de 200?', options: ['25', '30', '35', '40'], correctAnswer: 1, explanation: '15% de 200 = 0,15 x 200 = 30' },
  { subject: 'Matematica', difficulty: 'Medio', text: 'Se x2 - 5x + 6 = 0, quais sao os valores de x?', options: ['x=1 e x=6', 'x=2 e x=3', 'x=-2 e x=-3', 'x=0 e x=5'], correctAnswer: 1, explanation: 'Fatorando: (x-2)(x-3) = 0, entao x=2 ou x=3' },
  { subject: 'Matematica', difficulty: 'Facil', text: 'Quanto e 25% de 80?', options: ['15', '20', '25', '30'], correctAnswer: 1, explanation: '25% de 80 = 0,25 x 80 = 20' },
  { subject: 'Matematica', difficulty: 'Medio', text: 'Qual o valor de log base 10 de 1000?', options: ['2', '3', '4', '10'], correctAnswer: 1, explanation: 'log10(1000) = 3, pois 10^3 = 1000' },
  { subject: 'Matematica', difficulty: 'Dificil', text: 'Qual e a integral de 2x com relacao a x?', options: ['x^2', 'x^2 + C', '2', 'x + C'], correctAnswer: 1, explanation: 'Integral de 2x dx = x^2 + C' },
  { subject: 'Portugues', difficulty: 'Facil', text: 'Qual e o sujeito da frase: O aluno estudou muito para a prova?', options: ['a prova', 'muito', 'O aluno', 'estudou'], correctAnswer: 2, explanation: 'O sujeito e O aluno pois e o ser que pratica a acao' },
  { subject: 'Portugues', difficulty: 'Medio', text: 'Qual figura de linguagem esta em: A vida e uma viagem?', options: ['Metonimia', 'Metafora', 'Sinestesia', 'Eufemismo'], correctAnswer: 1, explanation: 'Metafora e a comparacao implicita entre vida e viagem' },
  { subject: 'Historia', difficulty: 'Facil', text: 'Em que ano foi proclamada a Republica no Brasil?', options: ['1822', '1888', '1889', '1891'], correctAnswer: 2, explanation: 'A Republica foi proclamada em 15 de novembro de 1889' },
  { subject: 'Historia', difficulty: 'Medio', text: 'Quem foi o lider da Inconfidencia Mineira?', options: ['Dom Pedro I', 'Tiradentes', 'Jose Bonifacio', 'Marques de Pombal'], correctAnswer: 1, explanation: 'Tiradentes (Joaquim Jose da Silva Xavier) liderou a Inconfidencia Mineira' },
  { subject: 'Ciencias', difficulty: 'Facil', text: 'Qual e o principal gas da fotossintese que as plantas absorvem?', options: ['Oxigenio', 'Nitrogenio', 'Dioxido de Carbono', 'Hidrogenio'], correctAnswer: 2, explanation: 'Na fotossintese, as plantas absorvem CO2 e liberam O2' },
  { subject: 'Fisica', difficulty: 'Medio', text: 'Um objeto percorre 60m em 3s com velocidade constante. Qual e sua velocidade?', options: ['10 m/s', '15 m/s', '20 m/s', '25 m/s'], correctAnswer: 2, explanation: 'v = d/t = 60/3 = 20 m/s' },
  { subject: 'Fisica', difficulty: 'Facil', text: 'Qual e a unidade de medida da forca no SI?', options: ['Joule', 'Newton', 'Pascal', 'Watt'], correctAnswer: 1, explanation: 'A forca e medida em Newtons (N) no Sistema Internacional' },
  { subject: 'Fisica', difficulty: 'Dificil', text: 'Qual e a formula da energia cinetica?', options: ['E=mc^2', 'Ec=mv^2/2', 'F=ma', 'P=mv'], correctAnswer: 1, explanation: 'Energia cinetica Ec = mv^2/2, onde m e massa e v e velocidade' },
  { subject: 'Quimica', difficulty: 'Facil', text: 'Qual e o simbolo quimico do ouro?', options: ['Go', 'Or', 'Au', 'Ag'], correctAnswer: 2, explanation: 'O ouro tem simbolo Au, do latim aurum' },
  { subject: 'Quimica', difficulty: 'Medio', text: 'Qual e o numero atomico do carbono?', options: ['4', '6', '8', '12'], correctAnswer: 1, explanation: 'O carbono tem numero atomico 6 (6 protons no nucleo)' },
  { subject: 'Biologia', difficulty: 'Facil', text: 'Qual organela celular e responsavel pela producao de energia?', options: ['Nucleo', 'Ribossomo', 'Mitocondria', 'Vacuolo'], correctAnswer: 2, explanation: 'A mitocondria realiza a respiracao celular produzindo ATP' },
  { subject: 'Biologia', difficulty: 'Medio', text: 'O que e a meiose?', options: ['Divisao celular que duplica', 'Divisao celular que reduz o numero de cromossomos', 'Sintese de proteinas', 'Replicacao do DNA'], correctAnswer: 1, explanation: 'Meiose e a divisao celular que reduz o numero cromossomico pela metade' },
  { subject: 'Direito Constitucional', difficulty: 'Medio', text: 'Qual e o prazo para a interposicao de Recurso Extraordinario?', options: ['5 dias', '10 dias', '15 dias', '30 dias'], correctAnswer: 2, explanation: 'O prazo para RE e de 15 dias uteis conforme o CPC/2015' },
  { subject: 'Direito Civil', difficulty: 'Medio', text: 'Qual e a capacidade civil plena no Brasil?', options: ['16 anos', '18 anos', '21 anos', '25 anos'], correctAnswer: 1, explanation: 'No Brasil, a capacidade civil plena e adquirida aos 18 anos (Art. 5 CC)' },
  { subject: 'Fiancas Pessoais', difficulty: 'Facil', text: 'O que significa a sigla CDI?', options: ['Certificado de Deposito Imobiliario', 'Certificado de Deposito Interbancario', 'Credito Direto ao Investidor', 'Capital de Desenvolvimento Individual'], correctAnswer: 1, explanation: 'CDI = Certificado de Deposito Interbancario, taxa de referencia para investimentos' },
  { subject: 'Investimentos', difficulty: 'Medio', text: 'O que e diversificacao de carteira?', options: ['Concentrar em uma unica acao', 'Distribuir investimentos em diferentes ativos', 'Investir apenas em renda fixa', 'Comprar ativos do mesmo setor'], correctAnswer: 1, explanation: 'Diversificar reduz o risco ao distribuir investimentos em diferentes classes de ativos' },
  { subject: 'CPA-20', difficulty: 'Medio', text: 'O que e o IPCA?', options: ['Indice de Precos ao Consumidor Amplo', 'Indice de Pagamento de Credito Amplo', 'Indice de Producao de Capital Ativo', 'Indicador de Preco por Cambio Autonomo'], correctAnswer: 0, explanation: 'IPCA = Indice de Precos ao Consumidor Amplo, principal medida de inflacao do Brasil' },
  { subject: 'Geografia', difficulty: 'Facil', text: 'Qual e o maior pais do mundo em extensao territorial?', options: ['China', 'Brasil', 'Canada', 'Russia'], correctAnswer: 3, explanation: 'A Russia e o maior pais do mundo com aproximadamente 17 milhoes de km2' },
  { subject: 'Redacao', difficulty: 'Medio', text: 'Qual e a estrutura basica de uma dissertacao argumentativa?', options: ['Introducao, narracao, conclusao', 'Introducao, desenvolvimento, conclusao', 'Tema, hipotese, prova', 'Titulo, corpo, referencias'], correctAnswer: 1, explanation: 'A dissertacao argumentativa tem Introducao (tese), Desenvolvimento (argumentos) e Conclusao (proposta)' },
  { subject: 'Ingles', difficulty: 'Facil', text: 'What is the plural of child in English?', options: ['childs', 'childrens', 'children', 'child'], correctAnswer: 2, explanation: 'The plural of child is children (irregular plural)' },
  { subject: 'Ingles', difficulty: 'Medio', text: 'What does the idiom to bite the bullet mean?', options: ['To eat something hard', 'To endure a painful situation', 'To shoot a gun', 'To chew food slowly'], correctAnswer: 1, explanation: 'To bite the bullet means to endure a painful or difficult situation' },
  { subject: 'Espanhol', difficulty: 'Facil', text: 'Como se dice obrigado en espanol?', options: ['Perdon', 'Gracias', 'Por favor', 'De nada'], correctAnswer: 1, explanation: 'Obrigado en espanol es Gracias' },
  { subject: 'Espanhol', difficulty: 'Medio', text: 'Cual es el genero de la palabra problema en espanol?', options: ['Femenino', 'Masculino', 'Neutro', 'Variable'], correctAnswer: 1, explanation: 'Problema es masculino en espanol: el problema' },
  { subject: 'Matematica', difficulty: 'Medio', text: 'Um trem parte de A para B a 80 km/h e leva 3 horas. Qual e a distancia?', options: ['200 km', '240 km', '260 km', '280 km'], correctAnswer: 1, explanation: 'd = v x t = 80 x 3 = 240 km' },
  { subject: 'Fisica', difficulty: 'Medio', text: 'Qual e a velocidade da luz no vacuo aproximadamente?', options: ['3x10^6 m/s', '3x10^8 m/s', '3x10^10 m/s', '3x10^4 m/s'], correctAnswer: 1, explanation: 'A velocidade da luz no vacuo e aproximadamente 3x10^8 m/s' },
  ];

export async function POST(request: NextRequest) {
    try {
          const { area, difficulty, excludeTexts } = await request.json();
          const excluded: string[] = excludeTexts || [];

      try {
              const areaText = area === 'Todas' ? 'qualquer area de estudo brasileira (Matematica, Portugues, Historia, Fisica, Quimica, Biologia, Direito, Financas, etc.)' : area;
              const diffText = difficulty === 'Todas' ? 'aleatoria (Facil, Medio ou Dificil)' : difficulty;
              const excludeHint = excluded.length > 0 ? ` IMPORTANTE: Nao repita estas questoes: ${excluded.slice(-5).join(' | ')}` : '';

            const response = await client.messages.create({
                      model: 'claude-3-haiku-20240307',
                      max_tokens: 600,
                      messages: [{
                                  role: 'user',
                                  content: `Gere UMA questao NOVA e DIFERENTE de multipla escolha sobre ${areaText} com dificuldade ${diffText} para estudantes brasileiros preparando para vestibulares ou concursos. ${excludeHint}
                                  Retorne APENAS JSON valido sem markdown:
                                  {"text":"pergunta?","options":["A","B","C","D"],"correctAnswer":0,"explanation":"explicacao","subject":"Materia","difficulty":"Facil"}`
                      }]
            });

            const content = response.content[0];
              if (content.type === 'text') {
                        const jsonMatch = content.text.match(/\{[\s\S]*\}/);
                        if (jsonMatch) {
                                    const question = JSON.parse(jsonMatch[0]);
                                    if (!excluded.includes(question.text)) {
                                                  question.id = `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                                                  return NextResponse.json({ question });
                                    }
                        }
              }
      } catch (aiError) {
              console.log('AI unavailable, using question bank');
      }

      let filtered = questionBank.filter(q => !excluded.includes(q.text));
          if (filtered.length === 0) filtered = questionBank;

      if (area !== 'Todas') {
              const byArea = filtered.filter(q => {
                        const norm = area.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                        const subj = q.subject.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                        return subj.toLowerCase().includes(norm.toLowerCase()) || norm.toLowerCase().includes(subj.toLowerCase());
              });
              if (byArea.length > 0) filtered = byArea;
      }

      if (difficulty !== 'Todas') {
              const normDiff = difficulty.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
              const byDiff = filtered.filter(q => {
                        const qDiff = q.difficulty.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                        return qDiff.toLowerCase() === normDiff.toLowerCase();
              });
              if (byDiff.length > 0) filtered = byDiff;
      }

      const randomQ = filtered[Math.floor(Math.random() * filtered.length)];
          const question = {
                  ...randomQ,
                  subject: area !== 'Todas' ? area : randomQ.subject,
                  difficulty: difficulty !== 'Todas' ? difficulty : randomQ.difficulty,
                  id: `bank_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          };

      return NextResponse.json({ question });
    } catch (error) {
          console.error('Error generating question:', error);
          return NextResponse.json({ error: 'Failed to generate question' }, { status: 500 });
    }
}

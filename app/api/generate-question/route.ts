import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Fallback question bank for when API is unavailable
const questionBank = [
  { subject: 'Matemática', difficulty: 'Fácil', text: 'Qual é o resultado de 15% de 200?', options: ['25', '30', '35', '40'], correctAnswer: 1, explanation: '15% de 200 = 0,15 × 200 = 30' },
  { subject: 'Matemática', difficulty: 'Médio', text: 'Se x² - 5x + 6 = 0, quais são os valores de x?', options: ['x=1 e x=6', 'x=2 e x=3', 'x=-2 e x=-3', 'x=0 e x=5'], correctAnswer: 1, explanation: 'Fatorando: (x-2)(x-3) = 0, então x=2 ou x=3' },
  { subject: 'Português', difficulty: 'Fácil', text: 'Qual é o sujeito da frase: "O aluno estudou muito para a prova"?', options: ['a prova', 'muito', 'O aluno', 'estudou'], correctAnswer: 2, explanation: 'O sujeito é "O aluno" pois é o ser que pratica a ação de estudar' },
  { subject: 'História', difficulty: 'Fácil', text: 'Em que ano foi proclamada a República no Brasil?', options: ['1822', '1888', '1889', '1891'], correctAnswer: 2, explanation: 'A República foi proclamada em 15 de novembro de 1889 pelo Marechal Deodoro da Fonseca' },
  { subject: 'Ciências', difficulty: 'Fácil', text: 'Qual é o principal gás da fotossíntese que as plantas absorvem?', options: ['Oxigênio', 'Nitrogênio', 'Dióxido de Carbono', 'Hidrogênio'], correctAnswer: 2, explanation: 'Na fotossíntese, as plantas absorvem CO₂ e liberam O₂' },
  { subject: 'Física', difficulty: 'Médio', text: 'Um objeto percorre 60m em 3s com velocidade constante. Qual é sua velocidade?', options: ['10 m/s', '15 m/s', '20 m/s', '25 m/s'], correctAnswer: 2, explanation: 'v = d/t = 60/3 = 20 m/s' },
  { subject: 'Química', difficulty: 'Fácil', text: 'Qual é o símbolo químico do ouro?', options: ['Go', 'Or', 'Au', 'Ag'], correctAnswer: 2, explanation: 'O ouro tem símbolo Au, do latim "aurum"' },
  { subject: 'Biologia', difficulty: 'Fácil', text: 'Qual organela celular é responsável pela produção de energia?', options: ['Núcleo', 'Ribossomo', 'Mitocôndria', 'Vacúolo'], correctAnswer: 2, explanation: 'A mitocôndria realiza a respiração celular produzindo ATP (energia)' },
  { subject: 'Direito Constitucional', difficulty: 'Médio', text: 'Qual é o prazo para a interposição de Recurso Extraordinário?', options: ['5 dias', '10 dias', '15 dias', '30 dias'], correctAnswer: 2, explanation: 'O prazo para RE é de 15 dias úteis conforme o CPC/2015' },
  { subject: 'Finanças Pessoais', difficulty: 'Fácil', text: 'O que significa a sigla CDI?', options: ['Certificado de Depósito Imobiliário', 'Certificado de Depósito Interbancário', 'Crédito Direto ao Investidor', 'Capital de Desenvolvimento Individual'], correctAnswer: 1, explanation: 'CDI = Certificado de Depósito Interbancário, taxa de referência para investimentos' },
  { subject: 'Geografia', difficulty: 'Fácil', text: 'Qual é o maior país do mundo em extensão territorial?', options: ['China', 'Brasil', 'Canadá', 'Rússia'], correctAnswer: 3, explanation: 'A Rússia é o maior país do mundo com aproximadamente 17 milhões de km²' },
  { subject: 'Inglês', difficulty: 'Fácil', text: 'What is the plural of "child" in English?', options: ['childs', 'childrens', 'children', 'child'], correctAnswer: 2, explanation: 'The plural of "child" is "children" (irregular plural)' },
  { subject: 'Espanhol', difficulty: 'Fácil', text: '¿Cómo se dice "obrigado" en español?', options: ['Perdón', 'Gracias', 'Por favor', 'De nada'], correctAnswer: 1, explanation: '"Obrigado" en español es "Gracias"' },
  { subject: 'Matemática', difficulty: 'Difícil', text: 'Qual é a integral de 2x com relação a x?', options: ['x²', 'x² + C', '2', 'x + C'], correctAnswer: 1, explanation: '∫2x dx = x² + C, onde C é a constante de integração' },
  { subject: 'Física', difficulty: 'Fácil', text: 'Qual é a unidade de medida da força no SI?', options: ['Joule', 'Newton', 'Pascal', 'Watt'], correctAnswer: 1, explanation: 'A força é medida em Newtons (N) no Sistema Internacional' },
  { subject: 'Química', difficulty: 'Médio', text: 'Qual é o número atômico do carbono?', options: ['4', '6', '8', '12'], correctAnswer: 1, explanation: 'O carbono tem número atômico 6 (6 prótons no núcleo)' },
  { subject: 'CPA-20', difficulty: 'Médio', text: 'O que é o IPCA?', options: ['Índice de Preços ao Consumidor Amplo', 'Índice de Pagamento de Crédito Amplo', 'Índice de Produção de Capital Ativo', 'Indicador de Preço por Câmbio Autônomo'], correctAnswer: 0, explanation: 'IPCA = Índice de Preços ao Consumidor Amplo, principal medida de inflação do Brasil' },
  { subject: 'Investimentos', difficulty: 'Médio', text: 'O que é diversificação de carteira?', options: ['Concentrar em uma única ação', 'Distribuir investimentos em diferentes ativos', 'Investir apenas em renda fixa', 'Comprar ativos do mesmo setor'], correctAnswer: 1, explanation: 'Diversificar reduz o risco ao distribuir investimentos em diferentes classes de ativos' },
  { subject: 'Direito Civil', difficulty: 'Médio', text: 'Qual é a capacidade civil plena no Brasil?', options: ['16 anos', '18 anos', '21 anos', '25 anos'], correctAnswer: 1, explanation: 'No Brasil, a capacidade civil plena é adquirida aos 18 anos (Art. 5º CC)' },
  { subject: 'Redação', difficulty: 'Médio', text: 'Qual é a estrutura básica de uma dissertação argumentativa?', options: ['Introdução, narração, conclusão', 'Introdução, desenvolvimento, conclusão', 'Tema, hipótese, prova', 'Título, corpo, referências'], correctAnswer: 1, explanation: 'A dissertação argumentativa tem Introdução (tese), Desenvolvimento (argumentos) e Conclusão (proposta)' },
];

export async function POST(request: NextRequest) {
  try {
    const { area, difficulty } = await request.json();
    
    // Try to use AI first
    try {
      const areaText = area === 'Todas' ? 'qualquer área de estudo brasileira (Matemática, Português, História, Física, Química, Biologia, Direito, Finanças, etc.)' : area;
      const diffText = difficulty === 'Todas' ? 'aleatória (Fácil, Médio ou Difícil)' : difficulty;
      
      const response = await client.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 512,
        messages: [{
          role: 'user',
          content: `Gere UMA questão de múltipla escolha sobre ${areaText} com dificuldade ${diffText} para estudantes brasileiros.

Retorne APENAS JSON válido sem markdown:
{"text":"pergunta?","options":["A","B","C","D"],"correctAnswer":0,"explanation":"explicação","subject":"Matéria","difficulty":"Fácil"}`
        }]
      });

      const content = response.content[0];
      if (content.type === 'text') {
        const jsonMatch = content.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const question = JSON.parse(jsonMatch[0]);
          question.id = `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          return NextResponse.json({ question });
        }
      }
    } catch (aiError) {
      console.log('AI unavailable, using question bank');
    }
    
    // Fallback to question bank
    let filtered = questionBank;
    if (area !== 'Todas') {
      filtered = questionBank.filter(q => q.subject === area || q.subject.includes(area));
      if (filtered.length === 0) filtered = questionBank;
    }
    if (difficulty !== 'Todas') {
      const byDiff = filtered.filter(q => q.difficulty === difficulty);
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

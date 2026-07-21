'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const questions = [
  {
    id: 1,
    question: 'Qual é a sua função?',
    emoji: '👤',
    options: [
      { label: 'Estudante', value: 'estudante', emoji: '🎓' },
      { label: 'Professor', value: 'professor', emoji: '👨‍🏫' },
      { label: 'Diretor de Escola/Faculdade', value: 'diretor', emoji: '🏫' },
      { label: 'Coordenador', value: 'coordenador', emoji: '📋' },
    ],
  },
  {
    id: 2,
    question: 'Qual é a sua meta?',
    emoji: '🎯',
    options: [
      { label: 'Melhorar notas nas provas', value: 'melhorar_notas', emoji: '📈' },
      { label: 'Passar em uma universidade (ENEM/Vestibular)', value: 'universidade', emoji: '🎓' },
      { label: 'Passar em um concurso público', value: 'concurso', emoji: '🏆' },
      { label: 'Aprovação na OAB', value: 'oab', emoji: '⚖️' },
      { label: 'Certificação CPA ANBIMA', value: 'cpa20', emoji: '📊' },
      { label: 'Ampliar meus conhecimentos', value: 'conhecimentos', emoji: '📚' },
    ],
  },
  {
    id: 3,
    question: 'Por onde nos conheceu?',
    emoji: '📣',
    options: [
      { label: 'Instagram', value: 'instagram', emoji: '📸' },
      { label: 'Google', value: 'google', emoji: '🔎' },
      { label: 'Amigos', value: 'amigos', emoji: '👥' },
      { label: 'Redes Sociais', value: 'redes_sociais', emoji: '🌐' },
      { label: 'Instituição de Ensino', value: 'instituicao', emoji: '🏛️' },
    ],
  },
  {
    id: 4,
    question: 'O que mais te preocupa?',
    emoji: '😟',
    options: [
      { label: 'Não passar nas provas', value: 'nao_passar_provas', emoji: '📝' },
      { label: 'Não entrar em uma faculdade', value: 'nao_faculdade', emoji: '🎓' },
      { label: 'Não passar em um concurso', value: 'nao_concurso', emoji: '🏆' },
      { label: 'Preciso melhorar minhas notas', value: 'melhorar_notas', emoji: '📊' },
    ],
  },
  {
    id: 5,
    question: 'Quanto tempo quer dedicar aos estudos por dia?',
    emoji: '⏱️',
    options: [
      { label: '45 minutos por dia', value: '45min', emoji: '⚡' },
      { label: '1 a 2 horas por dia', value: '1_2h', emoji: '🔥' },
      { label: '2 a 4 horas por dia', value: '2_4h', emoji: '💪' },
      { label: 'Manter mais foco nas atividades', value: 'foco', emoji: '🎯' },
    ],
  },
  {
    id: 6,
    question: 'Qual é o seu nível de conhecimento?',
    emoji: '📖',
    options: [
      { label: 'Ensino Fundamental', value: 'fundamental', emoji: '🏫' },
      { label: 'Ensino Médio', value: 'medio', emoji: '📓' },
      { label: 'Ensino Superior', value: 'superior', emoji: '🎓' },
      { label: 'Graduando', value: 'graduando', emoji: '📚' },
      { label: 'Pós-graduando', value: 'pos_graduando', emoji: '🏅' },
    ],
  },
  {
    id: 7,
    question: 'Qual é a sua faixa etária?',
    emoji: '🎂',
    options: [
      { label: 'Até 17 anos', value: 'ate_17', emoji: '🌱' },
      { label: '18 a 24 anos', value: '18_24', emoji: '⚡' },
      { label: '25 a 34 anos', value: '25_34', emoji: '🚀' },
      { label: '35 a 44 anos', value: '35_44', emoji: '💼' },
      { label: '45 anos ou mais', value: '45_mais', emoji: '🌟' },
    ],
  },
];

function generateProfile(answers: Record<number, string>) {
  const role = answers[1];
  const goal = answers[2];
  const time = answers[5];
  const level = answers[6];

  let profileName = 'Estudante Dedicado';
  let profileDescription = '';
  let tips: string[] = [];
  let studyAreas: string[] = [];
  let focusExam = '';

  if (goal === 'universidade') {
    profileName = 'Aspirante Universitário';
    profileDescription = 'Você está focado em ingressar no ensino superior. Nossa IA criará simulados personalizados para ENEM e vestibulares.';
    tips = ['Pratique questões do ENEM diariamente', 'Use os simulados cronometrados', 'Acompanhe seu progresso no dashboard', 'Foque em Redação, Matemática e Linguagens'];
    studyAreas = ['Matemática', 'Português', 'Redação', 'História', 'Geografia', 'Ciências', 'Física', 'Química', 'Biologia', 'Inglês'];
    focusExam = 'ENEM/Vestibular';
  } else if (goal === 'concurso') {
    profileName = 'Concurseiro Estratégico';
    profileDescription = 'Você mira em concursos públicos. Vamos focar em matérias específicas para bancas e questões comentadas.';
    tips = ['Resolva questões por banca examinadora', 'Use o plano de estudos personalizado', 'Revise seus pontos fracos com a IA', 'Foque em Português e Direito Constitucional'];
    studyAreas = ['Português', 'Matemática', 'Direito Constitucional', 'Direito Administrativo', 'Raciocínio Lógico'];
    focusExam = 'Concurso Público';
  } else if (goal === 'oab') {
    profileName = 'Futuro Advogado';
    profileDescription = 'Você está se preparando para a OAB. Vamos focar nas disciplinas jurídicas essenciais para sua aprovação.';
    tips = ['Foque em Direito Constitucional e Civil', 'Pratique questões da OAB por área', 'Use o assistente IA para tirar dúvidas jurídicas', 'Revise Ética Profissional regularmente'];
    studyAreas = ['Direito Constitucional', 'Direito Civil', 'Direito Penal', 'Direito Trabalhista', 'Direito Processual'];
    focusExam = 'OAB';
  } else if (goal === 'cpa20') {
    profileName = 'Especialista em Finanças';
    profileDescription = 'Você está se preparando para a CPA ANBIMA. Vamos focar em finanças, investimentos e regulação do mercado financeiro.';
    tips = ['Estude regulação do mercado financeiro', 'Pratique questões de produtos de investimento', 'Use simulados específicos para CPA ANBIMA', 'Revise análise de risco regularmente'];
    studyAreas = ['CPA ANBIMA', 'Finanças Pessoais', 'Investimentos', 'Matemática'];
    focusExam = 'CPA ANBIMA';
  } else if (goal === 'conhecimentos') {
    profileName = 'Aprendiz Curioso';
    profileDescription = 'Você quer ampliar seus conhecimentos. A plataforma vai adaptar o conteúdo ao seu ritmo e interesses.';
    tips = ['Explore diferentes áreas do conhecimento', 'Use o assistente IA para tirar dúvidas', 'Participe da comunidade de estudantes', 'Defina metas semanais de aprendizado'];
    studyAreas = ['Matemática', 'Português', 'História', 'Ciências', 'Inglês'];
    focusExam = 'Aprendizado Geral';
  } else if (goal === 'melhorar_notas') {
    profileName = 'Estudante em Evolução';
    profileDescription = 'Você quer melhorar suas notas. Nossa IA vai identificar seus pontos fracos e criar um plano de estudos personalizado.';
    tips = ['Identifique suas matérias mais difíceis', 'Use questões adaptativas por nível', 'Acompanhe sua evolução no dashboard', 'Pratique diariamente pelo menos 30 minutos'];
    studyAreas = ['Matemática', 'Português', 'Ciências', 'História', 'Redação'];
    focusExam = 'Melhora Escolar';
  } else if (role === 'professor' || role === 'diretor' || role === 'coordenador') {
    profileName = 'Educador Inovador';
    profileDescription = 'Como profissional da educação, você pode usar a plataforma para acompanhar tendências e metodologias de ensino.';
    tips = ['Avalie o desempenho dos conteúdos', 'Use a plataforma como referência pedagógica', 'Explore os recursos de análise de desempenho', 'Utilize o banco de questões para criar avaliações'];
    studyAreas = ['Pedagogia', 'Metodologias de Ensino', 'Avaliação Educacional'];
    focusExam = 'Educação';
  } else {
    profileDescription = 'Perfil configurado com sucesso. A IA vai personalizar sua experiência de estudos com base nas suas respostas.';
    tips = ['Acesse as questões adaptativas diariamente', 'Monitore seu progresso no dashboard', 'Use o assistente IA para tirar dúvidas'];
    studyAreas = ['Matemática', 'Português', 'Ciências'];
    focusExam = 'Geral';
  }

  if (time === '45min') tips.push('Sessões curtas e focadas são ideais para você');
  else if (time === '1_2h' || time === '2_4h') tips.push('Você tem disciplina! Alterne entre matérias para manter o foco');

  return { profileName, profileDescription, tips, studyAreas, focusExam, level: level || 'medio' };
}

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [saving, setSaving] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();
  const currentQuestion = questions[currentStep];

  // KEY FIX: Check if onboarding already completed — redirect to dashboard on subsequent logins
  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.replace('/login');
          return;
        }

        // Referral reward: if the user arrived via a /r/CODIGO link, a
        // tirei10_ref cookie was set by app/r/[code]/route.ts. Apply the
        // reward once (idempotent on the DB side) and clear the cookie.
        try {
        const refMatch = /(?:^|; )tirei10_ref=([^;]+)/.exec(document.cookie);
          if (refMatch) {
            const referralCode = decodeURIComponent(refMatch[1]);
            await supabase.rpc('apply_referral_reward', {
              p_referral_code: referralCode,
              p_referee_id: user.id,
            });
            document.cookie = 'tirei10_ref=; Max-Age=0; path=/;';
          }
        } catch (referralError) {
          console.error('Error applying referral reward:', referralError);
        }
        const { data: profile } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', user.id)
          .single();

        if (profile?.onboarding_completed === true) {
          // Onboarding already done — go directly to dashboard
          router.replace('/dashboard');
          return;
        }
      } catch (err) {
        console.error('Error checking onboarding:', err);
      } finally {
        setLoading(false);
      }
    };
    checkOnboarding();
  }, []);

  const handleNext = async () => {
    if (!selectedOption) return;
    const newAnswers = { ...answers, [currentQuestion.id]: selectedOption };
    setAnswers(newAnswers);
    setAnimating(true);
    await new Promise(r => setTimeout(r, 300));
    setAnimating(false);
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
      setSelectedOption(null);
    } else {
      setSaving(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const profile = generateProfile(newAnswers);
          await supabase.from('profiles').upsert({
            id: user.id,
            onboarding_completed: true,
            onboarding_answers: newAnswers,
            student_profile: profile.profileName,
            study_areas: profile.studyAreas,
            focus_exam: profile.focusExam,
            study_level: profile.level,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'id' });
        }
      } catch (err) { console.error('Error saving profile:', err); }
      finally { setSaving(false); }
      setShowProfile(true);
    }
  };

  const profile = generateProfile(answers);  const buttonLabel = saving ? '⏳ Salvando...' : currentStep < questions.length - 1 ? 'Próximo →' : '🎉 Finalizar e Ver Meu Perfil'; // NOSONAR

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 50%, #ddd6fe 100%)' }}>
        <div className="text-center">
          <div className="text-4xl mb-4 animate-spin">⏳</div>
          <p className="text-purple-700 font-semibold">Carregando...</p>
        </div>
      </div>
    );
  }

  if (showProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-8" style={{ background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 50%, #ddd6fe 100%)' }}>
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center" style={{ border: '2px solid #ede9fe' }}>
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-extrabold mb-2" style={{ color: '#5b21b6' }}>Perfil Gerado com Sucesso!</h1>
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full mb-4 font-bold text-lg" style={{ background: 'linear-gradient(135deg, #6d28d9, #9333ea)', color: 'white' }}>
              🏅 {profile.profileName}
            </div>
            {profile.focusExam && (
              <div className="mb-4">
                <span className="inline-flex items-center gap-1 px-4 py-1 rounded-full text-sm font-semibold" style={{ background: '#ede9fe', color: '#6d28d9' }}>
                  🎯 Foco: {profile.focusExam}
                </span>
              </div>
            )}
            <p className="text-gray-600 mb-6 leading-relaxed text-lg">{profile.profileDescription}</p>
            {profile.studyAreas && profile.studyAreas.length > 0 && (
              <div className="rounded-2xl p-4 mb-6 text-left" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                <h3 className="font-bold mb-2 text-sm" style={{ color: '#166534' }}>📚 Suas Áreas de Estudo Personalizadas:</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.studyAreas.map((area) => (
                    <span key={area} className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: '#dcfce7', color: '#166534' }}>
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="rounded-2xl p-6 mb-8 text-left" style={{ background: '#f5f3ff', border: '1px solid #ddd6fe' }}>
              <h3 className="font-bold mb-4 text-lg" style={{ color: '#5b21b6' }}>💡 Suas Dicas Personalizadas:</h3>
              <ul className="space-y-3">
                {profile.tips.map((tip) => (
                  <li key={tip} className="flex items-start gap-3">
                    <span className="text-green-500 font-bold mt-0.5">✅</span>
                    <span className="text-gray-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-8 text-sm">
              {[{ emoji: '🎯', label: 'Meta Definida' }, { emoji: '📊', label: 'Perfil Mapeado' }, { emoji: '🤖', label: 'IA Personalizada' }].map((item) => (
                <div key={item.label} className="rounded-xl p-3 text-center" style={{ background: '#f5f3ff' }}>
                  <div className="text-2xl mb-1">{item.emoji}</div>
                  <div className="font-semibold text-xs" style={{ color: '#5b21b6' }}>{item.label}</div>
                </div>
              ))}
            </div>
            <button onClick={() => router.push('/dashboard')} className="w-full py-4 rounded-2xl text-white font-bold text-lg transition-all duration-300 shadow-lg hover:-translate-y-1" style={{ background: 'linear-gradient(135deg, #6d28d9, #9333ea)' }}>
              🚀 Começar Minha Jornada de Estudos
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8" style={{ background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 50%, #ddd6fe 100%)' }}>
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-4" style={{ background: 'rgba(109,40,217,0.1)', color: '#6d28d9' }}>
            ✨ Configurando sua experiência personalizada
          </div>
          <h1 className="text-2xl font-extrabold" style={{ color: '#1e1b4b' }}>Vamos conhecer você melhor!</h1>
        </div>
        <div className="mb-8">
          <div className="flex justify-between text-sm mb-2" style={{ color: '#6d28d9' }}>
            <span className="font-semibold">Pergunta {currentStep + 1} de {questions.length}</span>
            <span className="font-bold">{Math.round(((currentStep + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="w-full h-3 rounded-full" style={{ background: '#ddd6fe' }}>
            <div className="h-3 rounded-full transition-all duration-500 ease-out" style={{ width: ((currentStep + 1) / questions.length * 100) + '%', background: 'linear-gradient(90deg, #6d28d9, #9333ea)' }} />
          </div>
        </div>
        <div className={'bg-white rounded-3xl shadow-2xl p-8 md:p-10 transition-all duration-300 ' + (animating ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0')} style={{ border: '2px solid #ede9fe' }}>
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">{currentQuestion.emoji}</div>
            <h2 className="text-2xl font-extrabold" style={{ color: '#1e1b4b' }}>{currentQuestion.question}</h2>
          </div>
          <div className="grid grid-cols-1 gap-3 mb-8">
            {currentQuestion.options.map((option) => (
              <button key={option.value} onClick={() => setSelectedOption(option.value)}
                className={'flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-200 hover:-translate-y-0.5 ' + (selectedOption === option.value ? 'border-purple-500 shadow-md' : 'border-gray-100 hover:border-purple-200')}
                style={{ background: selectedOption === option.value ? '#f5f3ff' : 'white' }}>
                <span className="text-2xl flex-shrink-0">{option.emoji}</span>
                <span className="font-semibold" style={{ color: selectedOption === option.value ? '#6d28d9' : '#374151' }}>{option.label}</span>
                {selectedOption === option.value && <span className="ml-auto font-bold" style={{ color: '#6d28d9' }}>✓</span>}
              </button>
            ))}
          </div>
          <button onClick={handleNext} disabled={!selectedOption || saving}
            className={'w-full py-4 rounded-2xl text-white font-bold text-lg transition-all duration-300 ' + (selectedOption ? 'shadow-lg hover:-translate-y-1' : 'opacity-50 cursor-not-allowed')}
            style={{ background: selectedOption ? 'linear-gradient(135deg, #6d28d9, #9333ea)' : '#d1d5db' }}>
            {buttonLabel}
          </button>
        </div>
        <div className="text-center mt-6">
          <button onClick={async () => {
            try {
              const { data: { user } } = await supabase.auth.getUser();
              if (user) await supabase.from('profiles').upsert({ id: user.id, onboarding_completed: true, updated_at: new Date().toISOString() }, { onConflict: 'id' });
            } catch { /* silently ignore profile update failure */ }
            router.push('/dashboard');
          }} className="text-sm transition-colors hover:underline" style={{ color: '#9ca3af' }}>
            Pular por agora →
          </button>
        </div>
      </div>
    </div>
  );
}

import Sidebar from '@/components/Sidebar';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

const examLabels: Record<string, string> = {
  enem: 'ENEM',
  oab: 'OAB',
  cpa: 'CPA (ANBIMA)',
  concurso: 'Concurso Publico',
};

const examColors: Record<string, string> = {
  enem: 'bg-blue-100 text-blue-700',
  oab: 'bg-purple-100 text-purple-700',
  cpa: 'bg-green-100 text-green-700',
  concurso: 'bg-yellow-100 text-yellow-700',
};

const eventTypeLabels: Record<string, string> = {
  inscricao_inicio: 'Inicio das inscricoes',
  inscricao_fim: 'Fim das inscricoes',
  prova: 'Prova',
  edital: 'Edital',
  resultado: 'Resultado',
};

type ExamDateRow = {
  id: string;
  exam: string;
  title: string;
  description: string | null;
  event_type: string;
  event_date: string;
  source_url: string | null;
  official_source: string;
  year: number;
};

export default async function ConcursosPage() {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from('exam_dates')
    .select('*')
    .gte('event_date', today)
    .order('event_date', { ascending: true });

  const upcoming = (data ?? []) as ExamDateRow[];

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Datas de Concursos e Editais</h1>
            <p className="text-gray-600 mt-1">
              Calendario oficial de provas, inscricoes e editais para ENEM, OAB, certificacoes ANBIMA e concursos publicos.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 rounded-2xl p-6 mb-8">
              Nao foi possivel carregar as datas agora. Tente novamente em instantes.
            </div>
          )}

          {!error && upcoming.length === 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-gray-600">
              Ainda nao ha datas cadastradas. A equipe Tirei10 atualiza este calendario assim que os editais oficiais sao publicados.
            </div>
          )}

          <div className="grid gap-4">
            {upcoming.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${examColors[item.exam] ?? 'bg-gray-100 text-gray-700'}`}>
                    {examLabels[item.exam] ?? item.exam}
                  </span>
                  <span className="text-xs text-gray-400">{eventTypeLabels[item.event_type] ?? item.event_type}</span>
                  <span className="text-xs text-gray-400">-</span>
                  <span className="text-xs text-gray-400">
                    {new Date(item.event_date + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h3>
                {item.description && (
                  <p className="text-gray-600 text-sm leading-relaxed mb-2">{item.description}</p>
                )}
                <p className="text-xs text-gray-400">
                  Fonte oficial:{' '}
                  {item.source_url ? (
                    <a href={item.source_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                      {item.official_source}
                    </a>
                  ) : (
                    item.official_source
                  )}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-indigo-50 rounded-2xl p-6 text-sm text-indigo-700">
            As datas exibidas aqui vem diretamente das fontes oficiais de cada exame (INEP para o ENEM, Coordenacao Nacional do Exame de Ordem/FGV para a OAB e ANBIMA para as certificacoes). Concursos publicos gerais sao adicionados manualmente pela equipe Tirei10 conforme os editais sao publicados, ja que nao existe uma API unificada do governo para isso.
          </div>
        </div>
      </div>
    </div>
  );
}

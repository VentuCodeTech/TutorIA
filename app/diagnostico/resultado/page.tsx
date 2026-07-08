'use client';

import { useEffect, useState } from 'react';
import type { AreaResult, ExamKind } from '@/lib/growth/scoring';
import { getAreaLabel, EXAM_LABELS } from '@/lib/growth/areas';
import RadarChart from '@/components/growth/RadarChart';
import GapCard from '@/components/growth/GapCard';
import LeadCaptureForm from '@/components/growth/LeadCaptureForm';
import ShareButton from '@/components/growth/ShareButton';

interface StoredResult {
  exam: ExamKind;
  results: Record<string, AreaResult>;
}

export default function DiagnosticoResultadoPage() {
  const [stored, setStored] = useState<StoredResult | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('diagnostico_result');
      if (raw) setStored(JSON.parse(raw));
    } catch {
      /* sessionStorage unavailable or corrupted */
    }
    setLoaded(true);
  }, []);

  if (loaded && !stored) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 text-center">
        <div>
          <p className="text-gray-600 mb-4">Nao encontramos um resultado recente.</p>
          <a href="/diagnostico" className="text-purple-700 underline font-medium">Fazer o diagnostico</a>
        </div>
      </div>
    );
  }

  if (!stored) {
    return <div className="min-h-screen" />;
  }

  const areaEntries = Object.entries(stored.results);
  const radarData = areaEntries.map(([area, r]) => ({ label: getAreaLabel(stored.exam, area), score: r.score }));
  const sortedByPriority = [...areaEntries].sort((a, b) => a[1].score - b[1].score);
  const shareUrl = typeof window !== 'undefined' ? window.location.origin + '/diagnostico' : 'https://diagnostico.tirei10.com.br';

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 50%, #ddd6fe 100%)' }}>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold mb-2" style={{ color: '#1e1b4b' }}>Seu diagnostico - {EXAM_LABELS[stored.exam]}</h1>
          <p className="text-gray-600">Veja abaixo onde estao suas maiores oportunidades de melhoria.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 mb-6 flex flex-col items-center" style={{ border: '2px solid #ede9fe' }}>
          <RadarChart data={radarData} />
          <div className="mt-4">
            <ShareButton url={shareUrl} />
          </div>
        </div>

        <div className="grid gap-4 mb-8">
          {sortedByPriority.map(([area, result]) => (
            <GapCard key={area} areaLabel={getAreaLabel(stored.exam, area)} result={result} />
          ))}
        </div>

        <LeadCaptureForm exam={stored.exam} source="diagnostico" gapData={stored.results} />

        <p className="text-center text-xs text-gray-400 mt-8">
          Quer um plano de estudos completo baseado nesse resultado? Conheca o <a href="https://www.tirei10.com.br" className="underline">Tirei10</a>.
        </p>
      </div>
    </div>
  );
}

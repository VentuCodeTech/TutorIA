import type { AreaResult } from '@/lib/growth/scoring';

const PRIORITY_STYLE: Record<AreaResult['priority'], { badge: string; bar: string; label: string }> = {
  critical: { badge: 'bg-red-100 text-red-700', bar: 'bg-red-500', label: 'Prioridade critica' },
  moderate: { badge: 'bg-yellow-100 text-yellow-700', bar: 'bg-yellow-500', label: 'Prioridade moderada' },
  good: { badge: 'bg-green-100 text-green-700', bar: 'bg-green-500', label: 'Ponto forte' },
};

interface GapCardProps {
  areaLabel: string;
  result: AreaResult;
}

export default function GapCard({ areaLabel, result }: GapCardProps) {
  const style = PRIORITY_STYLE[result.priority];
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-900">{areaLabel}</h3>
        <span className={'text-xs px-3 py-1 rounded-full font-medium ' + style.badge}>{style.label}</span>
      </div>
      <div className="w-full h-2.5 rounded-full bg-gray-100 mb-2">
        <div className={'h-2.5 rounded-full ' + style.bar} style={{ width: result.score + '%' }} />
      </div>
      <p className="text-sm text-gray-500">
        {result.score}/100 pontos - {result.correctCount} de {result.totalCount} questoes corretas
      </p>
    </div>
  );
}

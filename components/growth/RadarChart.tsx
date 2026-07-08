'use client';

// Lightweight, dependency-free SVG radar chart used to visualise the
// Diagnostico de Lacunas result (one axis per knowledge area, 0-100 score).
interface RadarChartProps {
  data: { label: string; score: number }[];
  size?: number;
}

export default function RadarChart({ data, size = 280 }: RadarChartProps) {
  const center = size / 2;
  const radius = size / 2 - 40;
  const angleStep = (Math.PI * 2) / data.length;

  const pointFor = (index: number, value: number) => {
    const angle = angleStep * index - Math.PI / 2;
    const r = (value / 100) * radius;
    return [center + r * Math.cos(angle), center + r * Math.sin(angle)];
  };

  const polygonPoints = data
    .map((d, i) => pointFor(i, d.score).join(','))
    .join(' ');

  const gridLevels = [25, 50, 75, 100];

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Grafico radar de desempenho por area">
      {gridLevels.map((level) => (
        <polygon
          key={level}
          points={data.map((_, i) => pointFor(i, level).join(',')).join(' ')}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={1}
        />
      ))}
      {data.map((_, i) => {
        const [x, y] = pointFor(i, 100);
        return <line key={i} x1={center} y1={center} x2={x} y2={y} stroke="#e5e7eb" strokeWidth={1} />;
      })}
      <polygon points={polygonPoints} fill="rgba(109,40,217,0.25)" stroke="#6d28d9" strokeWidth={2} />
      {data.map((d, i) => {
        const [x, y] = pointFor(i, d.score);
        return <circle key={d.label} cx={x} cy={y} r={4} fill="#6d28d9" />;
      })}
      {data.map((d, i) => {
        const angle = angleStep * i - Math.PI / 2;
        const labelR = radius + 26;
        const x = center + labelR * Math.cos(angle);
        const y = center + labelR * Math.sin(angle);
        return (
          <text
            key={d.label}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={11}
            fontWeight={600}
            fill="#4b5563"
          >
            {d.label}
          </text>
        );
      })}
    </svg>
  );
}

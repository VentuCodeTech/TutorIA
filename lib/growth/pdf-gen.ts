import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { ScheduleWeek } from './schedule-algo';

function formatBlocks(blocks: { area: string; minutes: number }[]): string {
  if (!blocks.length) return '-';
  return blocks.map((b) => b.area + ' (' + b.minutes + 'min)').join('\n');
}

export function exportSchedulePDF(weeks: ScheduleWeek[], examLabel: string): void {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  weeks.forEach((week, index) => {
    if (index > 0) doc.addPage();

    doc.setFillColor(91, 45, 144);
    doc.rect(0, 0, 297, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Tirei10 - Cronograma de Estudos (' + examLabel + ')', 14, 13);
    doc.setFontSize(9);
    doc.text('Semana ' + week.weekNumber + (week.isRevisionWeek ? ' - Revisao final' : ''), 14, 18);

    autoTable(doc, {
      startY: 26,
      head: [['Dia', 'Atividades planejadas']],
      body: week.days.map((day) => [day.dayLabel, formatBlocks(day.blocks)]),
      headStyles: { fillColor: [91, 45, 144], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [243, 238, 255] },
      styles: { cellPadding: 3, fontSize: 9, valign: 'top' },
    });

    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.text('Gerado por Tirei10 - tirei10.com.br - Plataforma de estudos com IA adaptativa', 14, 200);
  });

  doc.save('cronograma-' + examLabel.toLowerCase().replace(/\s+/g, '-') + '-tirei10.pdf');
}

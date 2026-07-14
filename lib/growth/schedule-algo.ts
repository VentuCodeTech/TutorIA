// Cronograma generator: distributes available study hours across weak
// and strong areas, spread over the days the user picked to study, up to
// the exam date. Runs 100% client-side (no backend/database needed).

export interface ScheduleParams {
  examLabel: string;
  examDate: Date;
  hoursPerDay: number;
  weakAreas: string[];
  strongAreas: string[];
  studyDays: number[];
}

export interface ScheduleBlock {
  area: string;
  minutes: number;
  kind: 'fraqueza' | 'forca' | 'simulado' | 'revisao';
}

export interface ScheduleDay {
  dayIndex: number;
  dayLabel: string;
  blocks: ScheduleBlock[];
}

export interface ScheduleWeek {
  weekNumber: number;
  isRevisionWeek: boolean;
  days: ScheduleDay[];
}

const DAY_LABELS = ['Domingo', 'Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado'];

function daysUntil(examDate: Date): number {
  const now = new Date();
  const diff = examDate.getTime() - now.getTime();
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function distributeMinutes(totalMinutes: number, areas: string[], kind: ScheduleBlock['kind']): ScheduleBlock[] {
  if (areas.length === 0) return [];
  const perArea = Math.floor(totalMinutes / areas.length);
  if (perArea <= 0) return [];
  return areas.map((area) => ({ area, minutes: perArea, kind }));
}

export function generateSchedule(params: ScheduleParams): ScheduleWeek[] {
  const { examDate, hoursPerDay, weakAreas, strongAreas, studyDays } = params;
  const totalDaysLeft = daysUntil(examDate);
  const totalWeeks = Math.max(1, Math.min(4, Math.ceil(totalDaysLeft / 7)));
  const dailyMinutes = Math.max(30, hoursPerDay * 60);

  const weeks: ScheduleWeek[] = [];

  for (let w = 0; w < totalWeeks; w++) {
    const isRevisionWeek = w === totalWeeks - 1 && totalDaysLeft <= 14;
    const weakShare = isRevisionWeek ? 0.5 : 0.6;
    const strongShare = isRevisionWeek ? 0.2 : 0.3;
    const simuladoShare = 1 - weakShare - strongShare;

    const days: ScheduleDay[] = (studyDays.length ? studyDays : [1, 2, 3, 4, 5]).map((dayIndex) => {
      const weakMinutes = Math.round(dailyMinutes * weakShare);
      const strongMinutes = Math.round(dailyMinutes * strongShare);
      const simuladoMinutes = Math.round(dailyMinutes * simuladoShare);

      const blocks: ScheduleBlock[] = [
        ...distributeMinutes(weakMinutes, weakAreas.length ? weakAreas : ['Revisao geral'], 'fraqueza'),
        ...distributeMinutes(strongMinutes, strongAreas.length ? strongAreas : ['Pratica geral'], 'forca'),
      ];
      if (simuladoMinutes > 0) {
        blocks.push({ area: 'Simulado rapido', minutes: simuladoMinutes, kind: isRevisionWeek ? 'revisao' : 'simulado' });
      }

      return { dayIndex, dayLabel: DAY_LABELS[dayIndex] ?? 'Dia', blocks };
    });

    weeks.push({ weekNumber: w + 1, isRevisionWeek, days });
  }

  return weeks;
}

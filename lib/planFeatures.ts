// lib/planFeatures.ts
// Feature flags system - controls which features are available per subscription plan

export type PlanId = 'free' | 'standard' | 'student' | 'advanced_pro';

export interface PlanFeatures {
  // Questões
  dailyQuestionLimit: number | null; // null = unlimited
  allSubjects: boolean;
  unlimitedSimulados: boolean;

  // Assistente IA
  aiAssistantEnabled: boolean;
  aiDailyMessageLimit: number | null; // null = unlimited

  // Análise
  basicDashboard: boolean;
  advancedPerformanceAnalysis: boolean;
  weeklyEmailReports: boolean;
  detailedEvolutionReports: boolean;

  // Planos de estudos
  customStudyPlan: boolean;
  adaptiveStudyPlan: boolean;

  // Redação
  aiEssayCorrection: boolean;
  unlimitedEssayCorrections: boolean;

  // Simulados
  aiPersonalizedSimulados: boolean;

  // Comunidade e suporte
  community: boolean;
  chatSupport: boolean;
  support247: boolean;
  prioritySupport: boolean;

  // Integrações
  syncedNotes: boolean;
  googleCalendarIntegration: boolean;
  earlyAccessToFeatures: boolean;

  // Elite
  eliteBadge: boolean;
}

export const PLAN_FEATURES: Record<PlanId, PlanFeatures> = {
  free: {
    dailyQuestionLimit: 20,
    allSubjects: false,
    unlimitedSimulados: false,
    aiAssistantEnabled: false,
    aiDailyMessageLimit: 0,
    basicDashboard: true,
    advancedPerformanceAnalysis: false,
    weeklyEmailReports: false,
    detailedEvolutionReports: false,
    customStudyPlan: false,
    adaptiveStudyPlan: false,
    aiEssayCorrection: false,
    unlimitedEssayCorrections: false,
    aiPersonalizedSimulados: false,
    community: true,
    chatSupport: false,
    support247: false,
    prioritySupport: false,
    syncedNotes: false,
    googleCalendarIntegration: false,
    earlyAccessToFeatures: false,
    eliteBadge: false,
  },
  standard: {
    dailyQuestionLimit: null,
    allSubjects: true,
    unlimitedSimulados: false,
    aiAssistantEnabled: true,
    aiDailyMessageLimit: 50,
    basicDashboard: true,
    advancedPerformanceAnalysis: true,
    weeklyEmailReports: false,
    detailedEvolutionReports: false,
    customStudyPlan: false,
    adaptiveStudyPlan: false,
    aiEssayCorrection: false,
    unlimitedEssayCorrections: false,
    aiPersonalizedSimulados: false,
    community: true,
    chatSupport: false,
    support247: false,
    prioritySupport: false,
    syncedNotes: true,
    googleCalendarIntegration: false,
    earlyAccessToFeatures: false,
    eliteBadge: false,
  },
  student: {
    dailyQuestionLimit: null,
    allSubjects: true,
    unlimitedSimulados: true,
    aiAssistantEnabled: true,
    aiDailyMessageLimit: null,
    basicDashboard: true,
    advancedPerformanceAnalysis: true,
    weeklyEmailReports: true,
    detailedEvolutionReports: false,
    customStudyPlan: true,
    adaptiveStudyPlan: false,
    aiEssayCorrection: true,
    unlimitedEssayCorrections: false,
    aiPersonalizedSimulados: false,
    community: true,
    chatSupport: true,
    support247: false,
    prioritySupport: false,
    syncedNotes: true,
    googleCalendarIntegration: true,
    earlyAccessToFeatures: true,
    eliteBadge: false,
  },
  advanced_pro: {
    dailyQuestionLimit: null,
    allSubjects: true,
    unlimitedSimulados: true,
    aiAssistantEnabled: true,
    aiDailyMessageLimit: null,
    basicDashboard: true,
    advancedPerformanceAnalysis: true,
    weeklyEmailReports: true,
    detailedEvolutionReports: true,
    customStudyPlan: true,
    adaptiveStudyPlan: true,
    aiEssayCorrection: true,
    unlimitedEssayCorrections: true,
    aiPersonalizedSimulados: true,
    community: true,
    chatSupport: true,
    support247: false,
    prioritySupport: true,
    syncedNotes: true,
    googleCalendarIntegration: true,
    earlyAccessToFeatures: true,
    eliteBadge: true,
  },
};

/**
 * Maps a Stripe price ID to a plan ID.
 * Keep in sync with PLAN_TO_PRICE in /app/api/stripe/checkout/route.ts
 */
const PRICE_TO_PLAN: Record<string, PlanId> = {
  price_1TUZ11FPyDxwG3POShBnmqB0: 'standard',
  price_1TUZ1rFPyDxwG3POwi0qzpJb: 'student',
  price_1TUZ2GFPyDxwG3PORJBla5oC: 'advanced_pro',
};

/**
 * Maps a Stripe subscription status to whether the plan is active.
 */
function isSubscriptionActive(status: string): boolean {
  return ['active', 'trialing'].includes(status);
}

/**
 * Returns the plan ID for a given Stripe price ID and subscription status.
 * Falls back to 'free' if the subscription is not active or the price ID is unknown.
 */
export function getPlanIdFromSubscription(
  stripePriceId: string | null | undefined,
  status: string | null | undefined
): PlanId {
  if (!stripePriceId || !status || !isSubscriptionActive(status)) {
    return 'free';
  }
  return PRICE_TO_PLAN[stripePriceId] ?? 'free';
}

/**
 * Returns the feature flags for a given plan ID.
 */
export function getFeatures(planId: PlanId): PlanFeatures {
  return PLAN_FEATURES[planId] ?? PLAN_FEATURES.free;
}

/**
 * Checks if a user has access to a specific feature.
 */
export function hasFeature<K extends keyof PlanFeatures>(
  planId: PlanId,
  feature: K
): PlanFeatures[K] {
  return PLAN_FEATURES[planId]?.[feature] ?? PLAN_FEATURES.free[feature];
}

/**
 * Returns a human-readable plan name.
 */
export function getPlanName(planId: PlanId): string {
  const names: Record<PlanId, string> = {
    free: 'Gratuito',
    standard: 'Standard',
    student: 'Student',
    advanced_pro: 'Advanced Pro',
  };
  return names[planId];
}


export const BASIC_SUBJECTS: string[] = [
  'Matemática',
  'Português',
  'História',
  'Física',
  'Química',
  'Biologia',
  'Geografia',
  ];

/**
* Checks if a subject/area is allowed for a given plan.
* Plans without allSubjects are restricted to BASIC_SUBJECTS.
*/
export function isSubjectAllowed(planId: PlanId, subject: string): boolean {
  if (getFeatures(planId).allSubjects) return true;
  return BASIC_SUBJECTS.includes(subject);
}

/**
* Maps the plan/status fields stored in the subscriptions table to a PlanId.
* Used by server-side code (API routes) to authoritatively resolve the user's
* plan, instead of trusting a plan value sent by the client.
*/
export function getPlanIdFromDbPlan(
  plan: string | null | undefined,
  status: string | null | undefined
  ): PlanId {
  if (!plan || !status || !isSubscriptionActive(status)) {
    return 'free';
  }
  const planMap: Record<string, PlanId> = {
    gratuito: 'free',
    free: 'free',
    standard: 'standard',
    student: 'student',
    advanced_pro: 'advanced_pro',
    'advanced pro': 'advanced_pro',
  };
  return planMap[plan.toLowerCase()] ?? 'free';
}

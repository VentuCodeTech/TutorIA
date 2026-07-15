// lib/useUserPlan.ts
// React hook to fetch the current user's subscription plan and feature flags

'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  type PlanId,
  type PlanFeatures,
  getFeatures,
  getPlanName,
} from '@/lib/planFeatures';

interface UserPlanState {
  planId: PlanId;
  planName: string;
  features: PlanFeatures;
  loading: boolean;
  error: string | null;
}

// Maps the 'plan' field from Supabase to PlanId
function getPlanIdFromPlanField(plan: string | null | undefined, status: string | null | undefined): PlanId {
  if (!plan || !status) return 'free';
  const activeStatuses = ['active', 'trialing'];
  if (!activeStatuses.includes(status)) return 'free';
  const planMap: Record<string, PlanId> = {
    'gratuito': 'free',
    'free': 'free',
    'standard': 'standard',
    'student': 'student',
    'advanced_pro': 'advanced_pro',
    'advanced pro': 'advanced_pro',
  };
  return planMap[plan.toLowerCase()] ?? 'free';
}

export function useUserPlan(): UserPlanState {
  const [state, setState] = useState<UserPlanState>({
    planId: 'free',
    planName: 'Gratuito',
    features: getFeatures('free'),
    loading: true,
    error: null,
  });

  useEffect(() => {
    const supabase = createClient();

    async function fetchPlan() {
            try {
                      // Retry a few times: right after a fresh OAuth login the session
                      // may not be immediately available to getUser(), which previously
                      // caused the plan to incorrectly fall back to 'free'.
                      let user = null;
                      for (let i = 0; i < 3; i++) {
                                  const { data } = await supabase.auth.getUser();
                                  user = data.user;
                                  if (user) break;
                                  await new Promise(resolve => setTimeout(resolve, 300));
                      }

                      if (!user) {
                                  setState(prev => ({ ...prev, loading: false }));
                                  return;
                      }
              
        const { data: subscription, error: subError } = await supabase
          .from('subscriptions')
          .select('plan, status')
          .eq('user_id', user.id)
          .maybeSingle();

        if (subError) {
          console.error('Error fetching subscription:', subError);
          setState(prev => ({ ...prev, loading: false, error: subError.message }));
          return;
        }

        const planId = getPlanIdFromPlanField(
          subscription?.plan,
          subscription?.status
        );
        const features = getFeatures(planId);
        const planName = getPlanName(planId);

        setState({
          planId,
          planName,
          features,
          loading: false,
          error: null,
        });
      } catch (err) {
        console.error('Unexpected error in useUserPlan:', err);
        setState(prev => ({ ...prev, loading: false, error: 'Erro ao carregar plano' }));
      }
    }

    fetchPlan();
  }, []);

  return state;
}

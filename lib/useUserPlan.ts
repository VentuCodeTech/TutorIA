// lib/useUserPlan.ts
// React hook to fetch the current user's subscription plan and feature flags

'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  type PlanId,
  type PlanFeatures,
  getPlanIdFromSubscription,
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
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
          setState(prev => ({ ...prev, loading: false }));
          return;
        }

        const { data: subscription, error: subError } = await supabase
          .from('subscriptions')
          .select('stripe_price_id, status')
          .eq('user_id', user.id)
          .maybeSingle();

        if (subError) {
          console.error('Error fetching subscription:', subError);
          setState(prev => ({ ...prev, loading: false, error: subError.message }));
          return;
        }

        const planId = getPlanIdFromSubscription(
          subscription?.stripe_price_id,
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

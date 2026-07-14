import { NextRequest, NextResponse } from 'next/server';

// Referral entry point: /r/CODIGO. Stores the referral code in a cookie
// (read later by the onboarding flow, right after the referee creates an
// account) and redirects to signup. Reward is only granted once the
// referee finishes onboarding, via apply_referral_reward (see migration
// 002_growth_tools.sql).
export async function GET(request: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const url = request.nextUrl.clone();
  url.pathname = '/login';
  url.searchParams.set('ref', code);

  const response = NextResponse.redirect(url);
  response.cookies.set('tirei10_ref', code, {
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
    sameSite: 'lax',
  });
  return response;
}

/**
 * Supabase OAuth 콜백을 처리하는 서버 라우트 코드입니다.
 * 
 * 이 코드는 Next.js App Router 패턴을 따르며, 
 * 현재 프로젝트(Vite + Express)에서는 server.ts의 /auth/callback 라우트가 
 * 동일한 역할을 수행합니다.
 */

import { createClient } from '@supabase/supabase-js';

// 이 함수는 Express나 Next.js 서버에서 호출될 수 있는 공통 로직입니다.
export async function handleAuthCallback(code: string, next: string = '/') {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';
  
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  if (code) {
    // 코드를 세션으로 교환합니다.
    // 클라이언트 사이드 SDK가 보통 이 작업을 수행하지만, 
    // 서버 사이드에서 직접 처리해야 할 경우 아래 메서드를 사용합니다.
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error('Auth callback error:', error.message);
      return { success: false, redirect: '/login?error=auth_callback_failed' };
    }
  }

  return { success: true, redirect: next };
}

// Next.js App Router 스타일의 GET 핸들러 (참고용)
/*
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const result = await handleAuthCallback(code, next);
    return NextResponse.redirect(`${origin}${result.redirect}`);
  }

  return NextResponse.redirect(`${origin}/`);
}
*/

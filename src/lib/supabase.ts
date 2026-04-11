/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Supabase 환경 변수가 설정되지 않았습니다. Vercel 설정에서 VITE_SUPABASE_URL과 VITE_SUPABASE_ANON_KEY를 확인해주세요.");
}

// Supabase 클라이언트 초기화
const createSupabaseClient = (adminPassword?: string) => {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  
  const cleanUrl = supabaseUrl.replace(/[“”"']/g, '').trim().replace(/\/$/, '');
  const cleanKey = supabaseAnonKey.replace(/[“”"']/g, '').trim();
  
  try {
    if (!cleanUrl.startsWith('http')) return null;
    
    const options: any = {
      global: {
        headers: {}
      }
    };

    // 관리자 비밀번호가 있으면 헤더에 추가
    if (adminPassword) {
      options.global.headers['x-admin-password'] = adminPassword;
    }

    return createClient(cleanUrl, cleanKey, options);
  } catch (error) {
    console.error("Supabase 클라이언트 생성 실패:", error);
    return null;
  }
};

// 초기 클라이언트 (비밀번호 없음)
let currentSupabase = createSupabaseClient(localStorage.getItem('admin_password') || undefined);

/**
 * 현재 Supabase 클라이언트를 반환합니다.
 */
export const getSupabase = () => currentSupabase;

/**
 * 관리자 비밀번호를 설정하고 클라이언트를 재생성합니다.
 */
export const setAdminPassword = (password: string | null) => {
  if (password) {
    localStorage.setItem('admin_password', password);
  } else {
    localStorage.removeItem('admin_password');
  }
  currentSupabase = createSupabaseClient(password || undefined);
  console.log("Supabase 클라이언트가 관리자 권한으로 재설정되었습니다.");
};

/**
 * 이메일/비밀번호로 회원가입
 */
export const signUp = async (email: string, pass: string) => {
  if (!currentSupabase) return { data: null, error: new Error("Supabase not initialized") };
  return await currentSupabase.auth.signUp({ email, password: pass });
};

/**
 * 이메일/비밀번호로 로그인
 */
export const signIn = async (email: string, pass: string) => {
  if (!currentSupabase) return { data: null, error: new Error("Supabase not initialized") };
  return await currentSupabase.auth.signInWithPassword({ email, password: pass });
};

/**
 * 로그아웃
 */
export const signOut = async () => {
  if (!currentSupabase) return;
  return await currentSupabase.auth.signOut();
};

/**
 * 이미지를 Supabase Storage에 업로드하고 공개 URL을 반환합니다.
 */
export const uploadImage = async (bucket: 'avatars' | 'evidence', file: File) => {
  const client = getSupabase();
  if (!client) return null;

  // 관리자 비밀번호 확인 (클라이언트 측 1차 방어)
  const adminPassword = localStorage.getItem('admin_password');
  if (!adminPassword) {
    alert("관리자 인증이 필요합니다.");
    return null;
  }

  console.log(`이미지 업로드 시도: bucket=${bucket}, file=${file.name}, size=${file.size}`);

  // 파일 크기 제한 (5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert("파일 크기가 너무 큽니다. (최대 5MB)");
    return null;
  }

  // 파일 확장자 추출 및 고유 파일명 생성
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;
  const filePath = `${fileName}`;

  try {
    const { error: uploadError } = await client.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error("업로드 실패 상세:", uploadError);
      if (uploadError.message.includes('violates row-level security policy')) {
        alert("업로드 권한이 없습니다. 관리자 로그인을 다시 확인하거나 Supabase Storage RLS 정책을 설정해주세요.\n\n(참고: 관리자 비밀번호가 헤더에 정상적으로 포함되었는지 확인이 필요합니다.)");
      } else {
        alert(`이미지 업로드 실패: ${uploadError.message}`);
      }
      return null;
    }

    const { data } = client.storage.from(bucket).getPublicUrl(filePath);
    console.log("업로드 성공, URL:", data.publicUrl);
    return data.publicUrl;
  } catch (error) {
    console.error("Storage 작업 중 예외 발생:", error);
    return null;
  }
};

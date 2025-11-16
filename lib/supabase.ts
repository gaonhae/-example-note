import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 데이터베이스 타입 정의
export interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  password: string;
  created_at: string;
  updated_at?: string;
}

export interface PostInput {
  title: string;
  content: string;
  author: string;
  password: string;
}

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // 이번 주의 시작일 계산 (월요일 기준)
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0(일) ~ 6(토)
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // 일요일이면 6, 아니면 dayOfWeek - 1

    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - daysToMonday);
    weekStart.setHours(0, 0, 0, 0);

    // 이번 주에 작성된 게시글 조회
    const { data: posts, error } = await supabase
      .from('posts')
      .select('title, content, created_at')
      .gte('created_at', weekStart.toISOString());

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: '데이터를 가져오는데 실패했습니다.' },
        { status: 500 }
      );
    }

    // 통계 계산
    const totalPosts = posts?.length || 0;
    const totalCharacters = posts?.reduce((sum, post) => {
      // 제목과 내용의 글자 수 합산
      return sum + (post.title?.length || 0) + (post.content?.length || 0);
    }, 0) || 0;

    // 일별 게시글 수 계산
    const postsByDay = posts?.reduce((acc, post) => {
      const date = new Date(post.created_at).toLocaleDateString('ko-KR');
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    return NextResponse.json({
      weekStart: weekStart.toISOString(),
      totalPosts,
      totalCharacters,
      averageCharactersPerPost: totalPosts > 0 ? Math.round(totalCharacters / totalPosts) : 0,
      postsByDay,
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

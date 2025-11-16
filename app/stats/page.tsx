'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface StatsData {
  weekStart: string;
  totalPosts: number;
  totalCharacters: number;
  averageCharactersPerPost: number;
  postsByDay: Record<string, number>;
}

export default function StatsPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');

      if (!response.ok) {
        throw new Error('데이터를 불러오는데 실패했습니다.');
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-gray-600">통계를 불러오는 중...</div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-red-600 mb-4">{error || '데이터를 불러올 수 없습니다.'}</div>
        <button
          onClick={fetchStats}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          다시 시도
        </button>
      </div>
    );
  }

  const weekStartDate = new Date(stats.weekStart);
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">이번 주 통계</h2>
        <Link
          href="/"
          className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
        >
          목록으로
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-4">
        <p className="text-sm text-gray-500 mb-6">
          기준: {formatDate(weekStartDate)} (월요일) ~ 현재
        </p>

        {/* 주요 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <div className="text-sm text-blue-600 font-medium mb-2">총 게시글 수</div>
            <div className="text-4xl font-bold text-blue-900">{stats.totalPosts.toLocaleString()}</div>
            <div className="text-xs text-blue-500 mt-2">개</div>
          </div>

          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            <div className="text-sm text-green-600 font-medium mb-2">총 글자 수</div>
            <div className="text-4xl font-bold text-green-900">{stats.totalCharacters.toLocaleString()}</div>
            <div className="text-xs text-green-500 mt-2">자 (제목 + 내용)</div>
          </div>

          <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
            <div className="text-sm text-purple-600 font-medium mb-2">평균 글자 수</div>
            <div className="text-4xl font-bold text-purple-900">
              {stats.averageCharactersPerPost.toLocaleString()}
            </div>
            <div className="text-xs text-purple-500 mt-2">자 / 게시글</div>
          </div>
        </div>

        {/* 일별 게시글 수 */}
        {Object.keys(stats.postsByDay).length > 0 && (
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">일별 게시글 수</h3>
            <div className="space-y-3">
              {Object.entries(stats.postsByDay)
                .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
                .map(([date, count]) => (
                  <div key={date} className="flex items-center justify-between">
                    <span className="text-gray-700">{date}</span>
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-200 rounded-full h-2 w-32">
                        <div
                          className="bg-blue-500 rounded-full h-2"
                          style={{
                            width: `${(count / Math.max(...Object.values(stats.postsByDay))) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-gray-900 font-medium w-12 text-right">
                        {count}개
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {stats.totalPosts === 0 && (
          <div className="text-center py-8 text-gray-500">
            이번 주에 작성된 게시글이 없습니다.
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="text-blue-500 text-xl">ℹ️</div>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">통계 정보</p>
            <ul className="list-disc list-inside space-y-1 text-blue-700">
              <li>이번 주는 월요일 0시부터 현재까지를 기준으로 합니다.</li>
              <li>글자 수는 게시글의 제목과 내용을 모두 포함합니다.</li>
              <li>실시간으로 업데이트되는 통계입니다.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

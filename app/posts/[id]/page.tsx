'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase, Post } from '@/lib/supabase';

export default function PostDetail() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [password, setPassword] = useState('');
  const [editData, setEditData] = useState({
    title: '',
    content: '',
  });

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setPost(data);
      setEditData({
        title: data.title,
        content: data.content,
      });
    } catch (error) {
      console.error('게시글을 불러오는데 실패했습니다:', error);
      alert('게시글을 찾을 수 없습니다.');
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!password) {
      alert('비밀번호를 입력해주세요.');
      return;
    }

    if (!confirm('정말로 삭제하시겠습니까?')) {
      return;
    }

    try {
      // 비밀번호 확인
      const { data: postData } = await supabase
        .from('posts')
        .select('password')
        .eq('id', id)
        .single();

      if (postData?.password !== password) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
      }

      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      alert('게시글이 삭제되었습니다.');
      router.push('/');
    } catch (error) {
      console.error('게시글 삭제 실패:', error);
      alert('게시글 삭제에 실패했습니다.');
    }
  };

  const handleUpdate = async () => {
    if (!password) {
      alert('비밀번호를 입력해주세요.');
      return;
    }

    if (!editData.title || !editData.content) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    try {
      // 비밀번호 확인
      const { data: postData } = await supabase
        .from('posts')
        .select('password')
        .eq('id', id)
        .single();

      if (postData?.password !== password) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
      }

      const { error } = await supabase
        .from('posts')
        .update({
          title: editData.title,
          content: editData.content,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      alert('게시글이 수정되었습니다.');
      setIsEditing(false);
      setPassword('');
      fetchPost();
    } catch (error) {
      console.error('게시글 수정 실패:', error);
      alert('게시글 수정에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-gray-600">로딩 중...</div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                제목
              </label>
              <input
                type="text"
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                내용
              </label>
              <textarea
                value={editData.content}
                onChange={(e) => setEditData({ ...editData, content: e.target.value })}
                rows={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                비밀번호
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="비밀번호를 입력하세요"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setPassword('');
                  setEditData({ title: post.title, content: post.content });
                }}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                수정 완료
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="border-b pb-4 mb-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{post.title}</h2>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>작성자: {post.author}</span>
                <span>{new Date(post.created_at).toLocaleString('ko-KR')}</span>
              </div>
            </div>

            <div className="prose max-w-none mb-6">
              <p className="whitespace-pre-wrap text-gray-800">{post.content}</p>
            </div>

            <div className="border-t pt-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  비밀번호 (수정/삭제시 필요)
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="비밀번호를 입력하세요"
                />
              </div>

              <div className="flex gap-2 justify-between">
                <button
                  onClick={() => router.push('/')}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  목록으로
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    수정
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

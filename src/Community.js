import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import { getPosts } from './postService'; // 백엔드 함수 가져오기
import './Community.css'; // 디자인 파일 (아래에서 만듦)

export default function Community() {
  const [category, setCategory] = useState('all'); // 현재 선택된 필터
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 카테고리가 바뀔 때마다 글 다시 불러오기
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getPosts(category);
      setPosts(data);
      setLoading(false);
    };
    fetchData();
  }, [category]);

  // 날짜 포맷 함수 (예: 2023.11.22)
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
  };

  return (
    <div>
      <Navbar />
      <main className="container" style={{ padding: '60px 20px', minHeight: '80vh' }}>
        
        {/* 페이지 헤더 */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#1f2937', marginBottom: '10px' }}>
            커뮤니티
          </h1>
          <p style={{ color: '#6b7280' }}>함께 공부하고 지식을 나눠보세요.</p>
        </div>

        {/* 1. 카테고리 카드 섹션 (필터 버튼 역할) */}
        <div className="community-sections" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          
          {/* 질문 카드 */}
          <div 
            className={`feature-card ${category === 'qna' ? 'active-card' : ''}`} 
            onClick={() => setCategory(category === 'qna' ? 'all' : 'qna')}
            style={{ cursor: 'pointer', border: category === 'qna' ? '2px solid #3b82f6' : '1px solid #e5e7eb' }}
          >
            <h2 style={{ color: '#1e40af' }}>💬 질문 & 답변</h2>
            <p>모르는 게 있다면 물어보세요.</p>
          </div>

          {/* 팁 카드 */}
          <div 
            className={`feature-card ${category === 'tip' ? 'active-card' : ''}`} 
            onClick={() => setCategory(category === 'tip' ? 'all' : 'tip')}
            style={{ cursor: 'pointer', border: category === 'tip' ? '2px solid #d97706' : '1px solid #e5e7eb' }}
          >
            <h2 style={{ color: '#92400e' }}>💡 학습 팁</h2>
            <p>나만의 노하우를 공유해요.</p>
          </div>

          {/* 스터디 카드 */}
          <div 
            className={`feature-card ${category === 'study' ? 'active-card' : ''}`} 
            onClick={() => setCategory(category === 'study' ? 'all' : 'study')}
            style={{ cursor: 'pointer', border: category === 'study' ? '2px solid #dc2626' : '1px solid #e5e7eb' }}
          >
            <h2 style={{ color: '#991b1b' }}>📢 스터디 모집</h2>
            <p>함께 공부할 친구를 찾아요.</p>
          </div>
        </div>

        {/* 2. 글 목록 섹션 */}
        <div className="post-list-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {category === 'all' ? '전체 글 목록' : 
                 category === 'qna' ? '질문 게시판' : 
                 category === 'tip' ? '팁 게시판' : '스터디 게시판'}
            </h2>
            <Link to="/community/write">
                <button className="hero-btn" style={{ padding: '10px 20px', fontSize: '14px' }}>
                    ✏️ 글쓰기
                </button>
            </Link>
        </div>

        {/* 실제 리스트 */}
        <div className="post-list">
            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>로딩 중...</div>
            ) : posts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#999', border: '1px solid #eee', borderRadius: '10px' }}>
                    작성된 글이 없습니다. 첫 글을 남겨보세요!
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {posts.map(post => (
                        <div key={post.id} style={{ padding: '20px', background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ 
                                    fontSize: '12px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '4px',
                                    background: post.category === 'qna' ? '#dbeafe' : post.category === 'tip' ? '#fef3c7' : '#fee2e2',
                                    color: post.category === 'qna' ? '#1e40af' : post.category === 'tip' ? '#92400e' : '#991b1b'
                                }}>
                                    {post.category.toUpperCase()}
                                </span>
                                <span style={{ fontSize: '13px', color: '#9ca3af' }}>{formatDate(post.createdAt)}</span>
                            </div>
                            <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#1f2937' }}>{post.title}</h3>
                            <p style={{ fontSize: '14px', color: '#4b5563', margin: '0 0 12px 0', lineHeight: '1.5' }}>
                                {post.content.length > 100 ? post.content.substring(0, 100) + '...' : post.content}
                            </p>
                            <div style={{ fontSize: '13px', color: '#6b7280' }}>
                                작성자: {post.authorName || '익명'}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

      </main>
    </div>
  );
}
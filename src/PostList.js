import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from './Navbar';
import { getPosts } from './postService';
import './Community.css';

export default function PostList() {
  const { category } = useParams(); 
  // const navigate = useNavigate(); // ★ 삭제됨 (이제 안 씀)
  
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const categoryNames = { qna: "질문 & 답변", tip: "학습 팁 공유", study: "공지 & 스터디 모집", all: "전체 글 목록" };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const currentCategory = category || 'all'; 
      const postData = await getPosts(currentCategory);
      setPosts(postData);
      setLoading(false);
    };
    fetchData();
  }, [category]); 

  return (
    <div>
      <Navbar />
      <main className="container" style={{ padding: '60px 20px', minHeight: '80vh' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#1f2937' }}>
                {categoryNames[category] || categoryNames.all}
            </h1>
            <Link to="/community/write">
                <button className="hero-btn" style={{ padding: '8px 16px' }}>+ 새 글 작성</button>
            </Link>
        </div>

        {/* 카테고리 탭 (필터링) */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', borderBottom: '2px solid #eee' }}>
            {/* 전체 글 보기 */}
            <Link to="/community" style={{ textDecoration: 'none' }}>
                <span style={{ padding: '8px 0', cursor: 'pointer', fontWeight: category === undefined ? 'bold' : 'normal', borderBottom: category === undefined ? '2px solid #3b82f6' : 'none', color: category === undefined ? '#3b82f6' : '#6b7280' }}>전체</span>
            </Link>
            {/* 카테고리별 보기 */}
            {Object.keys(categoryNames).filter(k => k !== 'all').map(key => (
                <Link key={key} to={`/community/list/${key}`} style={{ textDecoration: 'none' }}>
                    <span style={{ padding: '8px 0', cursor: 'pointer', fontWeight: category === key ? 'bold' : 'normal', borderBottom: category === key ? '2px solid #3b82f6' : 'none', color: category === key ? '#3b82f6' : '#6b7280' }}>{categoryNames[key]}</span>
                </Link>
            ))}
        </div>


        {/* 로딩/목록 표시 */}
        <div className="community-list">
            {loading ? (
                <div style={{ textAlign: 'center', padding: '50px' }}>게시글을 불러오는 중...</div>
            ) : posts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '50px', color: '#999' }}>아직 게시글이 없습니다. 첫 게시글을 작성해보세요!</div>
            ) : (
                <div style={{ border: '1px solid #eee', borderRadius: '10px', overflow: 'hidden' }}>
                    {posts.map(post => (
                        <Link 
                            key={post.id} 
                            to={`/community/post/${post.id}`} 
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            <div 
                                style={{ 
                                    padding: '15px 20px', 
                                    borderBottom: '1px solid #f9f9f9', 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center', 
                                    background: 'white', 
                                    cursor: 'pointer' 
                                }}
                                onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
                                onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                            >
                                <div>
                                    <span style={{ marginRight: '10px', fontSize: '12px', color: '#3b82f6', fontWeight: 'bold' }}>
                                        [{post.category.toUpperCase()}]
                                    </span>
                                    <span style={{ fontWeight: '600', color: '#111' }}>{post.title}</span>
                                </div>
                                <div style={{ fontSize: '13px', color: '#666', display: 'flex', gap: '15px', alignItems: 'center' }}>
                                    <span style={{ color: '#ef4444' }}>❤️ {post.likes || 0}</span>
                                    <span style={{ color: '#3b82f6' }}>💬 {post.commentsCount || 0}</span>
                                    <span>{post.authorName}</span>
                                    <span style={{ color: '#9ca3af' }}>{post.createdAt && new Date(post.createdAt.toDate()).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
        
      </main>
    </div>
  );
}
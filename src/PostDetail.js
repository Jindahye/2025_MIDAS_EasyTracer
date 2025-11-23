import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { getPostById, addComment, getComments, toggleLike } from './postService';
import { auth } from './firebase';
import './Community.css'; // 디자인 연결

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // 데이터 불러오기
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const postData = await getPostById(id);
      
      if (!postData) {
        alert("삭제되었거나 존재하지 않는 글입니다.");
        navigate('/community');
        return;
      }

      setPost(postData);
      setLikeCount(postData.likes || 0);
      
      // 내 좋아요 상태 확인
      if (auth.currentUser && postData.likedBy && postData.likedBy.includes(auth.currentUser.uid)) {
        setIsLiked(true);
      }

      // 댓글 불러오기
      const commentsData = await getComments(id);
      setComments(commentsData);
      
      setLoading(false);
    };
    fetchData();
  }, [id, navigate]);

  // 좋아요 버튼 클릭
  const handleLike = async () => {
    if (!auth.currentUser) return alert("로그인이 필요합니다.");
    
    // 화면 즉시 반영 (낙관적 업데이트)
    const wasLiked = isLiked;
    setIsLiked(!wasLiked);
    setLikeCount(prev => wasLiked ? prev - 1 : prev + 1);

    try {
      await toggleLike(id, auth.currentUser.uid);
    } catch (error) {
      console.error(error);
      // 실패하면 원상복구
      setIsLiked(wasLiked); 
      setLikeCount(prev => wasLiked ? prev + 1 : prev - 1);
      alert("좋아요 실패: 다시 시도해주세요.");
    }
  };

  // 댓글 작성
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) return alert("로그인이 필요합니다.");
    if (!newComment.trim()) return;

    try {
      const userName = auth.currentUser.email.split('@')[0]; // 닉네임
      await addComment(id, auth.currentUser.uid, userName, newComment);
      
      setNewComment('');
      // 댓글 목록 새로고침
      const commentsData = await getComments(id);
      setComments(commentsData);
    } catch (error) {
      alert("댓글 작성 실패");
    }
  };

  // 날짜 포맷 함수
  const formatDateTime = (timestamp) => {
    if (!timestamp) return '방금 전';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (loading || !post) return <div style={{textAlign:'center', marginTop:'50px'}}>로딩 중...</div>;

  return (
    <div>
      <Navbar />
      <main className="container" style={{ padding: '60px 20px' }}>
        
        <div className="auth-card" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'left' }}>
          
          {/* 글 본문 헤더 */}
          <div style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>
            <span className="badge" style={{ fontSize: '12px', marginBottom: '10px' }}>{post.category.toUpperCase()}</span>
            <h1 style={{ fontSize: '28px', margin: '10px 0' }}>{post.title}</h1>
            <div style={{ color: '#666', fontSize: '14px', display: 'flex', justifyContent: 'space-between' }}>
              <span>작성자: {post.authorName || '익명'}</span>
              <span>작성일: {formatDateTime(post.createdAt)}</span>
            </div>
          </div>

          {/* 글 내용 */}
          <div style={{ fontSize: '16px', lineHeight: '1.8', minHeight: '150px', marginBottom: '30px', whiteSpace: 'pre-wrap', padding: '10px 0' }}>
            {post.content}
          </div>

          {/* 좋아요 버튼 */}
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <button 
              onClick={handleLike}
              style={{ 
                padding: '12px 25px', 
                borderRadius: '25px', 
                border: `2px solid ${isLiked ? '#ef4444' : '#ddd'}`,
                background: isLiked ? '#fef2f2' : 'white',
                color: isLiked ? '#ef4444' : '#666',
                cursor: 'pointer', fontWeight: 'bold', fontSize: '18px'
              }}
            >
              {isLiked ? '❤️' : '🤍'} 좋아요 {likeCount}
            </button>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '30px 0' }} />

          {/* 댓글 섹션 */}
          <h3 style={{ fontSize: '18px', marginBottom: '15px' }}>댓글 {comments.length}개</h3>
          
          {/* 댓글 목록 */}
          <div style={{ marginBottom: '30px' }}>
            {comments.map(comment => (
              <div key={comment.id} style={{ padding: '15px', background: '#f9fafb', borderRadius: '10px', marginBottom: '10px' }}>
                <div style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '5px', color: '#374151' }}>
                  {comment.authorName}
                  <span style={{ fontWeight: 'normal', color: '#9ca3af', marginLeft: '8px' }}>
                    {formatDateTime(comment.createdAt)}
                  </span>
                </div>
                <div style={{ fontSize: '15px', color: '#4b5563' }}>{comment.content}</div>
              </div>
            ))}
          </div>

          {/* 댓글 작성 폼 */}
          <form onSubmit={handleCommentSubmit} style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="text" 
              className="auth-input" 
              placeholder="댓글을 입력하세요..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              style={{ flex: 1 }}
            />
            <button type="submit" className="hero-btn" style={{ padding: '10px 20px', fontSize: '14px' }}>등록</button>
          </form>

          <div style={{ marginTop: '20px' }}>
            <button onClick={() => navigate(-1)} className="btn-back">&larr; 목록으로 돌아가기</button>
          </div>
        </div>
      </main>
    </div>
  );
}
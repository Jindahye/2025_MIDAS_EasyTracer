import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { createPost } from './postService'; // 백엔드 글쓰기 함수
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import './Community.css'; // 임시 CSS 연결

export default function PostWrite() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('qna');
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        alert("로그인이 필요합니다.");
        navigate('/auth');
      } else {
        // 닉네임이 있으면 닉네임, 없으면 이메일 앞부분 사용
        // (DB에서 가져오는 게 정석이지만, 빠르고 간단하게 하려면 이렇게 해도 됨)
        setUserName(user.email.split('@')[0]); 
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      // ★ 백엔드에 저장 요청
      await createPost(auth.currentUser.uid, userName, title, content, category);
      alert("작성 완료!");
      navigate('/community'); // 목록으로 이동
    } catch (error) {
      alert("실패: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <main className="write-container" style={{marginTop: '60px'}}>
        <h2 style={{textAlign:'center', marginBottom:'20px'}}>글 작성하기</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>카테고리</label>
            <select 
                className="form-input"
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
            >
                <option value="qna">질문 & 답변</option>
                <option value="tip">학습 팁</option>
                <option value="study">스터디 모집</option>
            </select>
          </div>

          <div className="form-group">
            <label>제목</label>
            <input 
                type="text" 
                className="form-input"
                placeholder="제목을 입력하세요"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>내용</label>
            <textarea 
                className="form-textarea"
                placeholder="내용을 입력하세요"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "저장 중..." : "등록하기"}
          </button>
        </form>
      </main>
    </div>
  );
}
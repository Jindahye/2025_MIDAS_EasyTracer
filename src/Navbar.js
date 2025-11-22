import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from './firebase'; // 인증 상태 감지용
import { onAuthStateChanged } from 'firebase/auth';
import { logOut } from './authService'; // 로그아웃 기능

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // 1. 로그인 상태 감지 (핵심 로직)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // 유저 정보 업데이트
    });
    return () => unsubscribe(); // 정리
  }, []);

  const handleLogout = async () => {
    await logOut();
    navigate('/'); // 로그아웃 후 홈으로
  };

  return (
    <header className="site-header">
      <div className="container nav">
        {/* 로고 (홈으로 이동) */}
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="logo">
            <img
              src="assets/img/easy-tracer-icon.png"
              alt="Icon"
              className="logo-icon"
              onError={(e) => e.target.style.display = 'none'}
            />
            Easy Tracer
          </div>
        </Link>
        
        {/* 메뉴 목록 */}
        <nav>
          <Link to="/">홈</Link>
          <Link to="/problems">문제 목록</Link>
          <Link to="#">랭킹</Link>
          <Link to="#">커뮤니티</Link>
          
          {/* 2. ★ 로그인 상태에 따른 버튼 전환 ★ */}
          {user ? (
            <div style={{ display: 'inline-flex', gap: '15px', alignItems: 'center', marginLeft: '20px' }}>
              
              {/* 마이페이지 링크 */}
              <Link to="/mypage" style={{ fontWeight: 'bold', color: '#3b82f6', textDecoration: 'none' }}>
                {user.email.split('@')[0]}님
              </Link>

              {/* 로그아웃 버튼 */}
              <button 
                onClick={handleLogout} 
                className="btn-primary nav-mypage" 
                style={{ cursor: 'pointer', background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', padding: '4px 10px', fontSize: '12px' }}
              >
                로그아웃
              </button>
            </div>
          ) : (
            <Link to="/auth" className="btn-primary nav-mypage">로그인</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
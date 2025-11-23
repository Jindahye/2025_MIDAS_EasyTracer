import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { logOut } from './authService';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await logOut();
    navigate('/');
  };

  return (
    <header className="site-header">
      <div className="container nav">
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="logo">
            <img
              src="/assets/img/easy-tracer-icon.png"
              alt="Icon"
              className="logo-icon"
              onError={(e) => e.target.style.display = 'none'}
            />
            Easy Tracer
          </div>
        </Link>
        
        <nav>
          <Link to="/">홈</Link>
          <Link to="/problems">문제 목록</Link>
          {/* ★ 여기가 중요! # 대신 /ranking 으로 되어 있어야 합니다 ★ */}
          <Link to="/ranking">랭킹</Link>
          <Link to="/community">커뮤니티</Link>
          
          {user ? (
            <div style={{ display: 'inline-flex', gap: '15px', alignItems: 'center', marginLeft: '20px' }}>
              <Link to="/mypage" style={{ fontWeight: 'bold', color: '#3b82f6', textDecoration: 'none' }}>
                {user.email.split('@')[0]}님
              </Link>
              <button 
                onClick={handleLogout} 
                style={{ cursor: 'pointer', background: 'transparent', color: '#ef4444', border: 'none', fontSize: '13px', textDecoration: 'underline' }}
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
import React, { useEffect, useState } from 'react';
import { auth } from './firebase';
import { getUserData, sendPasswordReset } from './authService';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from './Navbar';
import './MyPage.css';

export default function MyPage() {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        alert("로그인이 필요한 페이지입니다.");
        navigate('/auth');
        return;
      }
      
      const data = await getUserData(user.uid);
      
      const emailPart = user.email ? user.email.split('@')[0] : '미등록 사용자';

      if (data) {
        setUserInfo(data);
      } else {
        // DB 데이터가 없을 경우에도 기본 정보는 보여주도록 처리
        setUserInfo({
          name: emailPart, // DB에 이름이 없으면 이메일 앞부분 사용
          email: user.email,
          score: 0,
          solvedProblems: []
        });
      }
      setLoading(false); 
    });
    return () => unsubscribe();
  }, [navigate]);

  const handlePasswordReset = () => {
    if (window.confirm(`${userInfo.email}로\n비밀번호 재설정 메일을 보내시겠습니까?`)) {
      sendPasswordReset(userInfo.email);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="mypage-loading" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px' }}>
          <div className="spinner"></div>
          <p>데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <main className="mypage-container">
        <div className="mypage-header">
          <h1 className="mypage-title">마이페이지</h1>
        </div>

        <div className="mypage-content">
          {/* 1. 프로필 카드 */}
          <div className="mypage-card profile-card">
            <div className="profile-avatar">
              {userInfo.name ? userInfo.name[0].toUpperCase() : 'U'}
            </div>
            <div className="profile-info">
              <h2 className="profile-name">{userInfo.name}</h2>
              <p className="profile-email">{userInfo.email}</p>
              <div className="profile-badges">
                <span className="badge-user">학생</span>
                <span className="badge-level">Lv. {Math.floor(userInfo.score / 50) + 1}</span>
              </div>
            </div>
          </div>

          {/* 2. 점수 및 통계 카드 */}
          <div className="stats-grid">
            <div className="mypage-card stat-card blue">
              <div className="stat-icon">🏆</div>
              <div className="stat-text">
                <h3>현재 점수</h3>
                <p className="stat-value">{userInfo.score}점</p>
              </div>
            </div>

            <div className="mypage-card stat-card green">
              <div className="stat-icon">📝</div>
              <div className="stat-text">
                <h3>푼 문제</h3>
                <p className="stat-value">
                  {userInfo.solvedProblems ? userInfo.solvedProblems.length : 0}개
                </p>
              </div>
            </div>

            <Link to="/ranking" className="mypage-card stat-card purple" style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>
              <div className="stat-icon">🥇</div>
              <div className="stat-text">
                <h3>내 랭킹 &rarr;</h3>
                <p className="stat-value">- 위</p>
                <span className="stat-sub">전체 보기</span>
              </div>
            </Link>
          </div>

          {/* 3. 하단 액션 버튼 */}
          <div className="mypage-actions">
            <Link to="/problems">
              <button className="action-btn primary">
                문제 풀러 가기 👉
              </button>
            </Link>
            
            <button className="action-btn secondary" onClick={handlePasswordReset}>
              비밀번호 변경
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
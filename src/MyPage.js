import React, { useEffect, useState } from 'react';
import { auth } from './firebase';
import { getUserData, sendPasswordReset } from './authService'; // ★ sendPasswordReset 추가됨
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
      
      if (data) {
        setUserInfo(data);
      } else {
        setUserInfo({
          name: user.email.split('@')[0],
          email: user.email,
          score: 0,
          solvedProblems: []
        });
      }
      setLoading(false); 
    });
    return () => unsubscribe();
  }, [navigate]);

  // ★ 비밀번호 변경 버튼 기능 (추가됨)
  const handlePasswordReset = () => {
    if (window.confirm(`${userInfo.email}로\n비밀번호 재설정 메일을 보내시겠습니까?`)) {
      sendPasswordReset(userInfo.email);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        {/* ★ 로딩 화면 가운데 정렬 수정 (flex 사용) ★ */}
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

            <div className="mypage-card stat-card purple">
              <div className="stat-icon">🥇</div>
              <div className="stat-text">
                <h3>내 랭킹</h3>
                <p className="stat-value">- 위</p>
                <span className="stat-sub">(준비 중)</span>
              </div>
            </div>
          </div>

          {/* 3. 하단 액션 버튼 */}
          <div className="mypage-actions">
            <Link to="/problems">
              <button className="action-btn primary">
                문제 풀러 가기 👉
              </button>
            </Link>
            
            {/* ★ 비밀번호 변경 버튼 연결됨 ★ */}
            <button className="action-btn secondary" onClick={handlePasswordReset}>
              비밀번호 변경
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
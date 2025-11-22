import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth } from './firebase'; // 파이어베이스 인증 도구
import { onAuthStateChanged } from 'firebase/auth'; // 로그인 상태 감지 도구
import { logOut } from './authService'; // 로그아웃 함수

export default function Home() {
  const [user, setUser] = useState(null); // 로그인한 유저 정보 (없으면 null)

  // 화면이 켜지면 로그인 상태인지 확인하는 함수 (useEffect)
  useEffect(() => {
    // 파이어베이스야, 로그인 상태 바뀌면 알려줘!
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // 로그인했으면 정보 담고, 안 했으면 null
    });
    return () => unsubscribe(); // 청소 (화면 꺼질 때 감시 중단)
  }, []);

  return (
    <div>
      {/* --- 헤더 --- */}
      <header className="site-header">
        <div className="container nav">
          <div className="logo">
            <img
              src="assets/img/easy-tracer-icon.png"
              alt="Easy Tracer 아이콘"
              className="logo-icon"
            />
            Easy Tracer
          </div>
          <nav>
            <Link to="/" className="active">홈</Link>
            <Link to="/problems">문제 목록</Link>
            <Link to="#">랭킹</Link>
            <Link to="#">커뮤니티</Link>
            
            {/* ★ 여기가 핵심! (로그인 상태에 따라 버튼이 바뀜) ★ */}
            {user ? (
              // 로그인 상태면: 이름과 로그아웃 버튼 보여주기
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginLeft: '20px' }}>
                <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#3b82f6' }}>
                  {user.email.split('@')[0]}님
                </span>
                <button 
                  onClick={logOut} 
                  className="btn-primary nav-mypage" 
                  style={{ cursor: 'pointer', background: 'transparent', color: '#3b82f6', border: '1px solid #3b82f6' }}
                >
                  로그아웃
                </button>
              </div>
            ) : (
              // 로그인 안 했으면: 로그인 버튼 보여주기
              <Link to="/auth" className="btn-primary nav-mypage">로그인</Link>
            )}

          </nav>
        </div>
      </header>

      {/* --- 메인 배너 --- */}
      <main className="container">
        <section className="hero hero-layout">
          <div className="hero-text">
            <div className="badge">MIDAS 2025 · Easy Tracer</div>
            <h1>
              라인트레이서,<br />
              <span className="highlight">Easy Tracer로 쉽고 확실하게</span>
            </h1>
            <p>
              센서값 확인부터 라인 추적 로직 연습까지,<br />
              문제를 하나씩 풀면서 라인트레이서를 감각적으로 익힐 수 있는
              학습 플랫폼입니다.
            </p>

            <div className="hero-actions">
              <Link to="/problems" className="btn-primary hero-btn">
                문제 풀기 시작하기
              </Link>
              <button className="btn-ghost">데모 살펴보기</button>
            </div>

            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">12+</span>
                <span className="stat-label">라인트레이서 문제</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">3단계</span>
                <span className="stat-label">난이도 구성</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">실습형</span>
                <span className="stat-label">센서 시나리오</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-card track-card">
              <div className="track-line"></div>
              <div className="track-bot">
                <div className="bot-sensor"></div>
              </div>
              <div className="track-label">라인 추적 상태 시뮬레이션</div>
            </div>

            <div className="visual-card small-card">
              <div className="small-title">센서값 로그</div>
              <div className="small-bars">
                <div className="bar bar-1"></div>
                <div className="bar bar-2"></div>
                <div className="bar bar-3"></div>
              </div>
            </div>

            <div className="visual-tag">Easy · Tracing · Dashboard</div>
          </div>
        </section>

        <section className="features">
          <div className="feature-card">
            <h2>문제 목록</h2>
            <p>라인트레이서와 관련된 알고리즘 문제를 난이도별로 정리해 제공해요.</p>
          </div>
          <div className="feature-card">
            <h2>정답률 & 통계</h2>
            <p>각 문제의 정답률과 나의 풀이 기록을 한 번에 확인할 수 있어요.</p>
          </div>
          <div className="feature-card">
            <h2>랭킹</h2>
            <p>다른 사용자와 점수를 비교하며 공부에 동기부여를 받을 수 있어요.</p>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container">
          © 2025 Easy Tracer. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
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
            {/* 현재 페이지(홈)는 Link 대신 그냥 span이나 a로 둬도 되지만, Link가 깔끔함 */}
            <Link to="/" className="active">홈</Link>
            <Link to="#">문제 목록</Link>
            <Link to="#">랭킹</Link>
            <Link to="#">커뮤니티</Link>
            {/* 로그인 페이지로 이동 */}
            <Link to="/auth" className="btn-primary nav-mypage">로그인</Link>
          </nav>
        </div>
      </header>

      {/* --- 메인 --- */}
      <main className="container">
        {/* Hero 영역: Easy Tracer 소개 */}
        <section className="hero hero-layout">
          {/* 왼쪽: 텍스트 */}
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
              {/* 문제 풀기 버튼 -> 로그인 페이지나 문제 목록으로 연결 */}
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

          {/* 오른쪽: 라인트레이서 UI 카드 (비주얼 요소) */}
          <div className="hero-visual">
            {/* 트랙 시뮬레이션 카드 */}
            <div className="visual-card track-card">
              <div className="track-line"></div>
              <div className="track-bot">
                <div className="bot-sensor"></div>
              </div>
              <div className="track-label">라인 추적 상태 시뮬레이션</div>
            </div>

            {/* 센서값 로그 카드 */}
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

        {/* 기능 카드 섹션 */}
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

      {/* --- 푸터 --- */}
      <footer className="site-footer">
        <div className="container">
          © 2025 Easy Tracer. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
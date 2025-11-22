import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar'; // ★ 부품 가져오기

export default function Home() {
  return (
    <div>
      {/* 복잡한 헤더 코드 싹 지우고 이거 하나면 끝! */}
      <Navbar />

      {/* --- 메인 배너 --- */}
      <main className="container">
        <section className="hero hero-layout">
          <div className="hero-text">
            <div className="badge">MIDAS 2025 · Easy Tracer</div>
            <h1>
  라인트레이서,<br />
  <span className="highlight">
    Easy Tracer로<br />
    쉽고 확실하게
  </span>
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

            {/* 통계 3개 */}
<div className="hero-stats">
  <div className="stat-item stat-item--problems">
    <div className="stat-number">12+</div>
    <div className="stat-label">라인트레이서 문제</div>
  </div>

  <div className="stat-item stat-item--levels">
    <div className="stat-number">3단계</div>
    <div className="stat-label">난이도 구성</div>
  </div>

  <div className="stat-item stat-item--practice">
    <div className="stat-number">실습형</div>
    <div className="stat-label">센서 시나리오</div>
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
            <h2>📚 문제 목록</h2>
            <p>라인트레이서와 관련된 알고리즘 문제를 난이도별로 정리해 제공해요.</p>
          </div>
          <div className="feature-card">
            <h2>📊 정답률 & 통계</h2>
            <p>각 문제의 정답률과 나의 풀이 기록을 한 번에 확인할 수 있어요.</p>
          </div>
          <div className="feature-card">
            <h2>🏆랭킹</h2>
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
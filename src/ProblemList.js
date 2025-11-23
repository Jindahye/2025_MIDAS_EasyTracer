import React from 'react';
import { Link } from 'react-router-dom';
import { problems } from './problemData';
import Navbar from './Navbar';

export default function ProblemList() {
  
  // 1. 문제별 맞춤 이모지 추천 (ID 기준)
  const getEmoji = (id) => {
    const emojis = {
      1: "📡", // 센서의 원리 -> 안테나/센서
      2: "⚙️", // 모터 제어 -> 톱니바퀴
      3: "🎛️", // 주행 알고리즘(PID) -> 조절 노브
      4: "🔌", // 회로 부품 -> 플러그
      5: "🏎️", // 구동 원리 -> 레이싱카
      6: "🔢", // 데이터 변환(ADC) -> 숫자
      7: "🔋", // 전자 회로(H-브리지) -> 배터리/회로
      8: "⚡", // 전원 공급 -> 번개
      9: "👁️", // 센서 특성 -> 눈(감지)
      10: "🚧", // 예외 처리 -> 공사중/장애물
    };
    return emojis[id] || "🧩"; // 기본값
  };

  // 2. 난이도별 스타일 (배지 색상 + 카드 그라데이션 배경)
  const getStyles = (id) => {
    // 초급 (1~3번): 파란색 테마
    if (id <= 3) return { 
      text: '초급', 
      badgeBg: '#dbeafe', 
      badgeText: '#1e40af',
      // 배경: 흰색에서 아주 연한 파란색으로 은은하게
      cardBg: 'linear-gradient(145deg, #ffffff 0%, #eff6ff 100%)',
      borderColor: '#bfdbfe'
    };
    
    // 중급 (4~7번): 노란/주황색 테마
    if (id <= 7) return { 
      text: '중급', 
      badgeBg: '#fef3c7', 
      badgeText: '#92400e',
      // 배경: 흰색에서 아주 연한 노란색으로
      cardBg: 'linear-gradient(145deg, #ffffff 0%, #fffbeb 100%)',
      borderColor: '#fde68a'
    };
    
    // 고급 (8~10번): 빨간색 테마
    return { 
      text: '고급', 
      badgeBg: '#fee2e2', 
      badgeText: '#991b1b',
      // 배경: 흰색에서 아주 연한 빨간색으로
      cardBg: 'linear-gradient(145deg, #ffffff 0%, #fef2f2 100%)',
      borderColor: '#fecaca'
    };
  };

  return (
    <div>
      <Navbar />

      <main className="container" style={{ padding: '60px 20px', minHeight: '80vh' }}>
        
        {/* 페이지 헤더 */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span className="badge" style={{ marginBottom: '15px' }}>Challenge</span>
          <h1 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '15px', color: '#1f2937' }}>
            문제 목록
          </h1>
          <p style={{ color: '#6b7280', fontSize: '18px' }}>
            라인트레이서의 핵심 논리를 단계별로 학습해보세요.
          </p>
        </div>

        {/* 문제 리스트 그리드 */}
        <div className="features" style={{ marginTop: '0' }}>
          {problems.map((problem) => {
            const styles = getStyles(problem.id);
            const emoji = getEmoji(problem.id);

            return (
              <div 
                key={problem.id} 
                className="feature-card" 
                style={{ 
                  textAlign: 'left', 
                  position: 'relative', 
                  paddingBottom: '80px',
                  // ★ 여기에 그라데이션 배경 적용 ★
                  background: styles.cardBg,
                  border: `1px solid ${styles.borderColor}`
                }}
              >
                
                {/* 상단: 번호와 난이도 배지 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <span style={{ fontWeight: 'bold', color: '#9ca3af', fontSize: '14px' }}>
                    No. {problem.id}
                  </span>
                  <span style={{ 
                    backgroundColor: styles.badgeBg, 
                    color: styles.badgeText, 
                    padding: '4px 10px', 
                    borderRadius: '6px', 
                    fontSize: '12px', 
                    fontWeight: '700' 
                  }}>
                    {styles.text}
                  </span>
                </div>
                
                {/* 문제 제목 + 이모지 */}
                <h2 style={{ fontSize: '22px', marginBottom: '12px', color: '#111827', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{emoji}</span>
                  {problem.title}
                </h2>
                
                {/* 설명 */}
                <p style={{ color: '#4b5563', fontSize: '15px', lineHeight: '1.6', marginBottom: '20px' }}>
                  {problem.description.length > 60 
                    ? problem.description.substring(0, 60) + "..." 
                    : problem.description}
                </p>
                
                {/* 하단 버튼 */}
                <div style={{ position: 'absolute', bottom: '30px', left: '30px', right: '30px' }}>
                  <Link to={`/problems/${problem.id}`} style={{ textDecoration: 'none' }}>
                    <button className="hero-btn" style={{ width: '100%', padding: '12px', fontSize: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                      도전하기
                    </button>
                  </Link>
                </div>

              </div>
            );
          })}
        </div>
      </main>

      <footer className="site-footer">
        <div className="container">
          © 2025 Easy Tracer. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
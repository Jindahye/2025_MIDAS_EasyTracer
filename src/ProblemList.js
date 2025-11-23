import React from 'react';
import { Link } from 'react-router-dom';
import { problems } from './problemData'; // 문제 데이터
import Navbar from './Navbar'; // 헤더

export default function ProblemList() {
  
  // 난이도 구별 함수
  const getLevel = (id) => {
    if (id <= 3) return { text: '초급', color: '#dbeafe', textColor: '#1e40af' }; // 파랑
    if (id <= 7) return { text: '중급', color: '#fef3c7', textColor: '#92400e' }; // 노랑
    return { text: '고급', color: '#fee2e2', textColor: '#991b1b' }; // 빨강
  };

  return (
    <div>
      <Navbar />

      <main className="container" style={{ padding: '60px 20px', minHeight: '80vh' }}>
        
        {/* 페이지 제목 */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span className="badge" style={{ marginBottom: '15px' }}>Challenge</span>
          <h1 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '15px', color: '#1f2937' }}>
            문제 목록
          </h1>
          <p style={{ color: '#6b7280', fontSize: '18px' }}>
            라인트레이서의 핵심 논리를 단계별로 학습해보세요.
          </p>
        </div>

        {/* 문제 리스트 (그리드 레이아웃) */}
        <div className="features" style={{ marginTop: '0' }}>
          {problems.map((problem) => {
            const level = getLevel(problem.id);

            return (
              <div key={problem.id} className="feature-card" style={{ textAlign: 'left', position: 'relative', paddingBottom: '80px' }}>
                
                {/* 상단: 번호와 난이도 배지 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <span style={{ fontWeight: 'bold', color: '#9ca3af', fontSize: '14px' }}>
                    No. {problem.id}
                  </span>
                  <span style={{ 
                    backgroundColor: level.color, 
                    color: level.textColor, 
                    padding: '4px 10px', 
                    borderRadius: '6px', 
                    fontSize: '12px', 
                    fontWeight: '700' 
                  }}>
                    {level.text}
                  </span>
                </div>
                
                {/* 문제 제목 */}
                <h2 style={{ fontSize: '22px', marginBottom: '12px', color: '#111827' }}>
                  {problem.title}
                </h2>
                
                {/* 설명 (너무 길면 자르기) */}
                <p style={{ color: '#4b5563', fontSize: '15px', lineHeight: '1.6', marginBottom: '20px' }}>
                  {problem.description.length > 60 
                    ? problem.description.substring(0, 60) + "..." 
                    : problem.description}
                </p>
                
                {/* 하단 버튼 (카드 바닥에 고정) */}
                <div style={{ position: 'absolute', bottom: '30px', left: '30px', right: '30px' }}>
                  <Link to={`/problems/${problem.id}`} style={{ textDecoration: 'none' }}>
                    <button className="hero-btn" style={{ width: '100%', padding: '12px', fontSize: '16px' }}>
                      도전하기
                    </button>
                  </Link>
                </div>

              </div>
            );
          })}
        </div>
      </main>

      {/* 푸터 */}
      <footer className="site-footer">
        <div className="container">
          © 2025 Easy Tracer. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
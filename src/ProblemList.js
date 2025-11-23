import React from 'react';
import { Link } from 'react-router-dom';
import { problems } from './problemData'; // 문제 데이터 가져오기
import Navbar from './Navbar';

export default function ProblemList() {
  return (
    <div>
      <Navbar />

      <main className="container" style={{ padding: '60px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="badge" style={{ marginBottom: '10px' }}>Challenge</span>
          <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '10px' }}>
            문제 목록
          </h1>
          <p style={{ color: '#666' }}>
            풀고 싶은 라인트레이서 문제를 선택하여 도전해보세요.
          </p>
        </div>

        {/* 문제 리스트 카드 그리드 */}
        <div className="features" style={{ marginTop: '0' }}>
          {problems.map((problem) => (
            <div key={problem.id} className="feature-card" style={{ textAlign: 'left', position: 'relative' }}>
              <span className="badge" style={{ marginBottom: '15px', fontSize: '12px' }}>
                Level 1
              </span>
              
              <h2 style={{ fontSize: '22px', marginTop: '5px', marginBottom: '10px' }}>{problem.title}</h2>
              <p style={{ marginBottom: '60px', color: '#666', fontSize: '15px' }}>
                {problem.description.length > 50 
                  ? problem.description.substring(0, 50) + "..." 
                  : problem.description}
              </p>
              
              {/* 하단 고정 버튼 */}
              <div style={{ position: 'absolute', bottom: '30px', left: '30px', right: '30px' }}>
                <Link to={`/problems/${problem.id}`}>
                  <button className="hero-btn" style={{ width: '100%', padding: '12px', fontSize: '16px' }}>
                    도전하기
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
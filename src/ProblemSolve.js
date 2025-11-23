import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { getProblemById, submitAnswer } from './problemService'; 
import { auth } from './firebase';
import './ProblemSolve.css'; 

export default function ProblemSolve() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const [problem, setProblem] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [result, setResult] = useState(null); 

  useEffect(() => {
    const data = getProblemById(id);
    if (!data) {
      alert("존재하지 않는 문제거나 준비 중입니다.");
      navigate('/problems');
    } else {
      setProblem(data);
    }
  }, [id, navigate]);

  const handleSubmit = async () => {
    // 1. 예외 처리 (로그인 안 했거나 답 안 골랐을 때)
    if (!auth.currentUser) {
      alert("로그인이 필요합니다!");
      navigate('/auth');
      return;
    }
    if (!selectedOption) {
      alert("정답을 선택해주세요.");
      return;
    }

    try {
      // 2. 조용히 채점 요청
      const isCorrect = await submitAnswer(auth.currentUser.uid, problem.id, selectedOption);
      
      // 3. 결과 화면에 표시 (알림창 X, 결과 박스 O)
      if (isCorrect) {
        setResult({ success: true, msg: "정답입니다! 🎉 (10점 획득)" });
      } else {
        setResult({ success: false, msg: "틀렸습니다. 다시 생각해 보세요. 😭" });
      }
    } catch (error) {
      console.error(error);
      alert("오류가 발생했습니다.");
    }
  };

  const handleRetry = () => {
    setResult(null);
    setSelectedOption('');
  };

  if (!problem) return <div className="mypage-loading"><div className="spinner"></div></div>;

  return (
    <div>
      <Navbar />
      <main className="container" style={{ padding: '60px 20px' }}>
        <div className="auth-card solve-card">
          <div className="problem-header">
            <span className="badge">문제 {problem.id}</span>
            <h1 className="problem-title">{problem.title}</h1>
          </div>
          
          <div className="problem-desc">
            {problem.description}
          </div>

          {/* 보기 리스트 */}
          <div className="options-list">
            {problem.options ? problem.options.map((opt, idx) => (
              <label 
                key={idx} 
                className={`option-label ${selectedOption === opt ? 'selected' : ''}`}
              >
                <input 
                  type="radio" 
                  name="option" 
                  value={opt} 
                  className="option-radio"
                  onChange={(e) => {
                    setSelectedOption(e.target.value);
                    setResult(null); 
                  }}
                  checked={selectedOption === opt}
                  disabled={result !== null} 
                />
                {opt}
              </label>
            )) : (
              <input 
                type="text" 
                className="auth-input" 
                placeholder="정답을 입력하세요"
                onChange={(e) => setSelectedOption(e.target.value)}
                disabled={result !== null}
              />
            )}
          </div>

          {/* 결과 메시지 */}
          {result && (
            <div 
              className={`auth-message ${result.success ? 'success' : 'error'}`} 
              style={{ marginBottom: '20px', fontSize: '16px', fontWeight: 'bold' }}
            >
              {result.msg}
            </div>
          )}

          <div className="solve-actions">
            <button onClick={() => navigate('/problems')} className="btn-back">
              &larr; 목록으로 돌아가기
            </button>

            {result ? (
              <button onClick={handleRetry} className="btn-submit" style={{background: '#6b7280'}}>
                다시 풀기
              </button>
            ) : (
              <button onClick={handleSubmit} className="btn-submit">
                제출하기
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
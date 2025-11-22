import React, { useState } from 'react';
import { logIn, signUp } from './authService'; // 님이 만든 기능 연결
import { useNavigate, Link } from 'react-router-dom'; // 페이지 이동 도구

export default function Login() {
  // --- 1. 상태 관리 (변수 설정) ---
  const [mode, setMode] = useState('login'); // 현재 탭 (로그인 or 회원가입)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); // 알림 메시지
  const [msgType, setMsgType] = useState(''); // 메시지 색상 (성공/실패)
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate(); // 페이지 이동 함수

  // --- 2. 탭 클릭 시 실행되는 함수 ---
  const handleTabClick = (newMode) => {
    setMode(newMode);
    setMessage(''); 
    setEmail('');   
    setPassword('');
  };

  // --- 3. 로그인/회원가입 버튼 클릭 시 실행 (핵심 로직) ---
  const handleSubmit = async (e) => {
    e.preventDefault(); // 새로고침 방지
    setMessage('');
    
    if (!email || !password) {
      setMessage('아이디와 비밀번호를 입력해 주세요.');
      setMsgType('error');
      return;
    }

    setIsLoading(true); // 로딩 시작

    try {
      if (mode === 'login') {
        // (1) 로그인 시도
        await logIn(email, password);
        setMessage('로그인 성공! 메인 페이지로 이동합니다.');
        setMsgType('success');
        
        // 0.7초 후 메인으로 이동
        setTimeout(() => {
          navigate('/');
        }, 700);

      } else {
        // (2) 회원가입 시도
        await signUp(email, password);
        setMessage('회원가입 성공! 이제 로그인해 주세요.');
        setMsgType('success');
        setMode('login'); // 가입 성공 시 로그인 탭으로 이동
        setEmail('');
        setPassword('');
      }
    } catch (err) {
      setMessage(err.message || '오류가 발생했습니다.');
      setMsgType('error');
    } finally {
      setIsLoading(false); // 로딩 끝
    }
  };

  // --- 4. 화면 그리기 (친구의 HTML 디자인 적용) ---
  return (
    <div>
      {/* 헤더 */}
      <header className="site-header">
        <div className="container nav">
          <div className="logo">Easy Tracer</div>
          <nav>
            <Link to="/">홈</Link>
            <Link to="#">문제 목록</Link>
            <Link to="#">랭킹</Link>
            <Link to="#">커뮤니티</Link>
            <Link to="/auth" className="btn-primary nav-mypage">로그인</Link>
          </nav>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="container">
        <div className="auth-wrapper">
          <div className="auth-card">
            
            {/* 탭 버튼 */}
            <div className="auth-tabs">
              <div 
                className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
                onClick={() => handleTabClick('login')}
              >
                로그인
              </div>
              <div 
                className={`auth-tab ${mode === 'signup' ? 'active' : ''}`}
                onClick={() => handleTabClick('signup')}
              >
                회원가입
              </div>
            </div>

            {/* 제목 */}
            <h1 className="auth-title">
              {mode === 'login' ? '로그인' : '회원가입'}
            </h1>
            <p className="auth-sub">
              {mode === 'login' 
                ? 'Easy Tracer 계정으로 라인트레이서 문제를 풀고 기록을 저장해보세요.'
                : '아이디와 비밀번호를 설정해서 Easy Tracer 계정을 만들어보세요.'}
            </p>

            {/* 입력 폼 */}
            <form className="auth-form" onSubmit={handleSubmit}>
              <div>
                <div className="auth-label">아이디 / 이메일</div>
                <input
                  type="text"
                  className="auth-input"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} // 입력값 저장
                />
              </div>
              <div>
                <div className="auth-label">비밀번호</div>
                <input
                  type="password"
                  className="auth-input"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} // 입력값 저장
                />
              </div>

              <button type="submit" className="auth-btn" disabled={isLoading}>
                {isLoading ? '처리 중...' : (mode === 'login' ? '로그인' : '회원가입')}
              </button>

              {/* 결과 메시지 */}
              <div className={`auth-message ${msgType}`}>
                {message}
              </div>
            </form>

          </div>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="site-footer">
        <div className="container">© 2025 Easy Tracer. All rights reserved.</div>
      </footer>
    </div>
  );
}
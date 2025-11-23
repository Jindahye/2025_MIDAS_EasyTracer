import React, { useEffect, useState } from 'react';
import { auth } from './firebase';
import { getUserData, sendPasswordReset, deleteAccount, updateNickname, getGlobalRank } from './authService';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from './Navbar';
import './MyPage.css';

export default function MyPage() {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true); 
  
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const [rank, setRank] = useState('-'); // 순위 상태

  const navigate = useNavigate();

  // 1. 데이터 로딩 및 인증 체크
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        alert("로그인이 필요한 페이지입니다.");
        navigate('/auth');
        return;
      }
      
      const data = await getUserData(user.uid);
      const emailPart = user.email ? user.email.split('@')[0] : '미등록 사용자';

      let finalInfo;

      if (data) {
        finalInfo = data;
      } else {
        // DB 데이터가 없을 경우 (버그 방지용)
        finalInfo = {
          name: emailPart,
          email: user.email,
          score: 0,
          solvedProblems: []
        };
      }
      
      setUserInfo(finalInfo);
      setNewName(finalInfo.name); // 닉네임 수정창 초기값 설정
      
      // 2. 랭킹 계산
      const calculatedRank = await getGlobalRank(finalInfo.score);
      setRank(calculatedRank > 0 ? calculatedRank : '-'); // 0이면 미등록으로 표시

      setLoading(false); 
    });
    return () => unsubscribe();
  }, [navigate]);

  // 비밀번호 변경 핸들러
  const handlePasswordReset = () => {
    // 경고: window.confirm은 커스텀 모달로 대체하는 것이 좋습니다.
    if (window.confirm(`${userInfo.email}로\n비밀번호 재설정 메일을 보내시겠습니까?`)) {
      sendPasswordReset(userInfo.email);
    }
  };

  // 회원 탈퇴 핸들러
  const handleDeleteAccount = async () => {
    // 경고: window.confirm 대신 커스텀 모달 사용 권장
    if (window.confirm("정말로 탈퇴하시겠습니까?\n탈퇴 시 모든 점수와 기록이 영구적으로 삭제됩니다.")) {
      try {
        await deleteAccount();
        navigate('/'); 
      } catch (error) {
        // 에러 처리는 authService에서 alert으로 함
      }
    }
  };
  
  // 닉네임 저장 핸들러
  const handleSaveNickname = async () => {
    if (!newName.trim()) {
      alert("닉네임을 입력해주세요.");
      return;
    }
    try {
      await updateNickname(auth.currentUser.uid, newName);
      setUserInfo({ ...userInfo, name: newName }); // 화면 즉시 갱신
      setIsEditing(false); // 수정 모드 끄기
    } catch (error) {
      // 에러 처리는 authService에서 alert으로 함
    }
  };


  // 로딩 화면
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

  // 메인 화면
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
              {isEditing ? (
                // 닉네임 수정 모드
                <div style={{ display: 'flex', gap: '5px', alignItems: 'center', marginBottom: '5px' }}>
                  <input 
                    type="text" 
                    value={newName} 
                    onChange={(e) => setNewName(e.target.value)}
                    className="auth-input"
                    style={{ width: '150px', padding: '5px' }}
                  />
                  <button onClick={handleSaveNickname} style={{ cursor: 'pointer', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '5px', padding: '5px 10px' }}>저장</button>
                  <button onClick={() => setIsEditing(false)} style={{ cursor: 'pointer', background: '#e5e7eb', border: 'none', borderRadius: '5px', padding: '5px 10px' }}>취소</button>
                </div>
              ) : (
                // 일반 모드
                <h2 className="profile-name" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {userInfo.name}
                  <button 
                    onClick={() => setIsEditing(true)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}
                    title="닉네임 변경"
                  >
                    ✏️
                  </button>
                </h2>
              )}

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
                <p className="stat-value">{rank} 위</p>
                <span className="stat-sub">전체 보기</span>
              </div>
            </Link>
          </div>

          {/* 3. 하단 버튼들 */}
          <div className="mypage-actions" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link to="/problems" style={{ width: '100%' }}>
              <button className="action-btn primary" style={{ width: '100%' }}>
                문제 풀러 가기 👉
              </button>
            </Link>
            
            <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                <button className="action-btn secondary" onClick={handlePasswordReset} style={{ flex: 1 }}>
                  비밀번호 변경
                </button>
                
                <button 
                    className="action-btn" 
                    onClick={handleDeleteAccount} 
                    style={{ flex: 1, backgroundColor: '#fff', border: '1px solid #fca5a5', color: '#dc2626' }}
                >
                  회원 탈퇴
                </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import Navbar from './Navbar';
import './Ranking.css'; // ★ 랭킹 전용 디자인 연결

export default function Ranking() {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        // 1. Firestore에서 유저 데이터 가져오기 (점수 높은 순, 최대 20명)
        const usersRef = collection(db, "users");
        const q = query(usersRef, orderBy("score", "desc"), limit(20));
        
        const querySnapshot = await getDocs(q);
        const users = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setRankings(users);
      } catch (error) {
        console.error("랭킹 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, []);

  // 순위에 따른 메달 아이콘 반환 함수
  const getRankIcon = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return <span className="rank-number">{rank}</span>;
  };

  return (
    <div>
      <Navbar />
      
      <main className="ranking-container">
        <div className="ranking-header">
          <span className="badge">Hall of Fame</span>
          <h1 className="ranking-title">명예의 전당 🏆</h1>
          <p className="ranking-sub">
            Easy Tracer에서 가장 뛰어난 실력을 보여준 상위 랭커들입니다.
          </p>
        </div>

        {loading ? (
          <div className="loading-box">
            <div className="spinner"></div>
            <p>랭킹을 집계 중입니다...</p>
          </div>
        ) : (
          <div className="ranking-card">
            {/* 헤더 (표의 제목) */}
            <div className="rank-list-header">
              <div className="col-rank">순위</div>
              <div className="col-name">이름</div>
              <div className="col-score">점수</div>
            </div>

            {/* 랭킹 리스트 */}
            <div className="rank-list-body">
              {rankings.length > 0 ? (
                rankings.map((user, index) => (
                  <div key={user.id} className={`rank-item ${index < 3 ? 'top-rank' : ''}`}>
                    <div className="col-rank">
                      <div className="rank-icon">{getRankIcon(index + 1)}</div>
                    </div>
                    <div className="col-name">
                      <span className="user-name">{user.name || user.email.split('@')[0]}</span>
                      {index === 0 && <span className="badge-top">TOP</span>}
                    </div>
                    <div className="col-score">
                      {user.score} <span className="score-unit">점</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-rank">
                  아직 등록된 랭킹 데이터가 없습니다. 😢<br />
                  가장 먼저 문제를 풀고 1등이 되어보세요!
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import MyPage from './MyPage';
import Ranking from './Ranking'; // ★ 랭킹 화면 가져오기

function App() {
  return (
    <Router>
      <Routes>
        {/* 메인 화면 */}
        <Route path="/" element={<Home />} />
        
        {/* 로그인 화면 */}
        <Route path="/auth" element={<Login />} />
        
        {/* 마이페이지 */}
        <Route path="/mypage" element={<MyPage />} />
        
        {/* ★ 랭킹 화면 추가 */}
        <Route path="/ranking" element={<Ranking />} />
      </Routes>
    </Router>
  );
}

export default App;
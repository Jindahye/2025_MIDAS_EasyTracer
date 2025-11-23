import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 페이지들 가져오기
import Home from './Home';
import Login from './Login';
import MyPage from './MyPage';
import Ranking from './Ranking';
import ProblemList from './ProblemList';   
import ProblemSolve from './ProblemSolve'; 
import PostList from './PostList';     
import PostWrite from './PostWrite'; 
import PostDetail from './PostDetail'; // ★ 이 파일이 있어야 함!

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Login />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/ranking" element={<Ranking />} />

        <Route path="/problems" element={<ProblemList />} />
        <Route path="/problems/:id" element={<ProblemSolve />} />

        {/* 커뮤니티 */}
        <Route path="/community" element={<PostList />} />
        <Route path="/community/list/:category" element={<PostList />} />
        <Route path="/community/write" element={<PostWrite />} />
        
        {/* ★ 게시글 상세 보기 경로: /community/post/글번호 ★ */}
        <Route path="/community/post/:id" element={<PostDetail />} /> 
      </Routes>
    </Router>
  );
}

export default App;
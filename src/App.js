import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 페이지들 가져오기
import Home from './Home';
import Login from './Login';
import MyPage from './MyPage';
import Ranking from './Ranking';
import ProblemList from './ProblemList';   
import ProblemSolve from './ProblemSolve'; 
import Community from './Community';       

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Login />} />
        <Route path="/mypage" element={<MyPage />} />
        
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/community" element={<Community />} />

        <Route path="/problems" element={<ProblemList />} />
        <Route path="/problems/:id" element={<ProblemSolve />} />
      </Routes>
    </Router>
  );
}

export default App;
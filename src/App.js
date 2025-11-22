import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';   // 메인 화면 가져오기
import Login from './Login'; // 로그인 화면 가져오기

function App() {
  return (
    <Router>
      <Routes>
        {/* 주소창에 '/' 치면 메인 화면(Home) 보여줌 */}
        <Route path="/" element={<Home />} />
        
        {/* 주소창에 '/auth' 치면 로그인 화면(Login) 보여줌 */}
        <Route path="/auth" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
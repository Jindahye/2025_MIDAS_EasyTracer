import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

export default function Community() {
  return (
    <div>
      <Navbar />
      <main className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: '60px', marginBottom: '20px' }}>🚧</div>
        <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '16px' }}>
          커뮤니티 오픈 준비 중!
        </h1>
        <p style={{ fontSize: '18px', color: '#666', marginBottom: '40px', lineHeight: '1.6' }}>
          서로 꿀팁을 공유하고 질문할 수 있는 공간을 열심히 만들고 있어요.<br />
          조금만 기다려 주세요!
        </p>
        <Link to="/problems">
          <button className="hero-btn">
            문제 풀면서 기다리기
          </button>
        </Link>
      </main>
    </div>
  );
}
const express = require('express');
const cors = require('cors'); // 보안 허가증
const app = express();
const port = 3000;

// 1. 기본 설정
app.use(cors());            // 모든 접속 허용
app.use(express.json());    // JSON 번역기 장착

// 2. 부품(Person B의 코드) 가져오기
const b_part = require('./routes/b_part');

// 3. 경로 연결하기
// "/problems" 로 시작하는 건 모두 b_part.js가 처리해!
app.use('/problems', b_part);


// 4. 메인 대문 (간판)
app.get('/', (req, res) => {
  res.send('메인 서버입니다. 문제 풀이는 /problems 로 가세요!');
});

// 5. 서버 켜기
app.listen(port, () => {
  console.log(`서버 실행 중: http://localhost:${port}`);
});
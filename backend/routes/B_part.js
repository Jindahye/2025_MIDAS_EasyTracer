const express = require('express');
const router = express.Router(); // 라우터: 작은 서버라고 생각하세요.

// -------------------------------------------------------
// 데이터베이스 (Person B의 전용 데이터)
// -------------------------------------------------------
const problems = [
  { id: 1, title: "로그인의 정의", description: "사용자가 누구인지 확인하는 절차는?", answer: "인증" },
  { id: 2, title: "HTTP 상태 코드", description: "요청이 성공했음을 알리는 코드는?", answer: "200" },
  { id: 3, title: "CS 상식", description: "CPU 스케줄링 기법 중 하나가 아닌 것은?", answer: "FIFO" }
];

const submissions = [];

// -------------------------------------------------------
// API 경로 설정
// 주의: 여기서 주소는 '/problems'를 뺍니다.
// 왜냐하면 server.js에서 합칠 때 앞에 붙여줄 거거든요.
// -------------------------------------------------------

// 1. 문제 목록 (GET /) -> 실제 주소: /problems
router.get('/', (req, res) => {
  res.json(problems);
});

// 2. 문제 상세 (GET /:id) -> 실제 주소: /problems/1
router.get('/:id', (req, res) => {
  const problemId = parseInt(req.params.id);
  const problem = problems.find(p => p.id === problemId);
  if (problem) res.json(problem);
  else res.status(404).send('그런 문제는 없는데요? 😅');
});

// 3. 채점 및 기록 (POST /:id/check) -> 실제 주소: /problems/1/check
router.post('/:id/check', (req, res) => {
  const problemId = parseInt(req.params.id);
  const userAnswer = req.body.answer;
  const userId = req.body.userId;

  const problem = problems.find(p => p.id === problemId);
  if (!problem) return res.status(404).send('문제 없음');

  const isCorrect = (problem.answer === userAnswer);
  
  const newSubmission = {
    submission_id: submissions.length + 1,
    problem_id: problemId,
    user_id: userId,
    is_correct: isCorrect,
    timestamp: new Date()
  };
  submissions.push(newSubmission);

  res.json({ result: isCorrect ? "정답! 🎉" : "오답... 😭", score: isCorrect ? 100 : 0 });
});

// 4. 기록 확인 (GET /submissions) -> 실제 주소: /problems/submissions
// (이건 편의상 여기에 둡니다)
router.get('/submissions/all', (req, res) => {
    res.json(submissions);
});

// 이 파일을 밖으로 내보냅니다! (필수)
module.exports = router;
const API_BASE = "http://localhost:3000";

// 공통 요청 함수는 그대로 두고

// 로그인
async function login(usernameOrEmail, password) {
  const result = await apiRequest("/problems/login", {
    method: "POST",
    body: JSON.stringify({
      username: usernameOrEmail, // b_part.js 안의 변수 이름과 맞추기
      password,
    }),
  });
  return result;
}

// 회원가입
async function signup(username, password) {
  const result = await apiRequest("/problems/signup", {
    method: "POST",
    body: JSON.stringify({
      username,
      password,
    }),
  });
  return result;
}

// 마이페이지
async function fetchMyInfo() {
  const result = await apiRequest("/problems/mypage", {
    method: "GET",
  });
  return result;
}

// 점수 갱신
async function updateScore(problemId, score) {
  const result = await apiRequest("/problems/score", {
    method: "POST",
    body: JSON.stringify({
      problemId,
      score,
    }),
  });
  return result;
}

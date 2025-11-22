import { db } from "./firebase";
import { problems } from "./problemData"; // 방금 님이 만든 문제 데이터
import { updateUserScore } from "./authService"; // 님이 만든 점수 함수
import { collection, addDoc } from "firebase/firestore";

// 1. 문제 목록 다 가져오기
export const getProblems = () => {
    return problems;
};

// 2. 문제 하나 가져오기 (ID로 찾기)
export const getProblemById = (id) => {
    // id가 숫자 1일수도, 문자 "1"일수도 있어서 == 로 느슨하게 비교
    return problems.find(p => p.id == id);
};

// 3. 채점하고 결과 저장하기 (핵심 기능!)
export const submitAnswer = async (userId, problemId, userAnswer) => {
    try {
        // (1) 정답 확인
        const problem = problems.find(p => p.id == problemId);
        if (!problem) throw new Error("문제가 없습니다.");

        const isCorrect = (problem.answer === userAnswer);

        // (2) 제출 기록을 DB 'submissions' 장부에 영구 저장
        // (백엔드 2가 배열로 했던 걸 DB로 바꿈 -> 새로고침 해도 안 날아감)
        await addDoc(collection(db, "submissions"), {
            userId: userId,
            problemId: problemId,
            userAnswer: userAnswer,
            isCorrect: isCorrect,
            timestamp: new Date()
        });

        // (3) 정답이면 유저 점수 올려주기 (님이 만든 authService 함수 사용!)
        if (isCorrect) {
            await updateUserScore(userId, problemId);
        }

        return isCorrect; // true(정답) 또는 false(오답) 반환
    } catch (error) {
        console.error("채점 에러:", error);
        throw error;
    }
};
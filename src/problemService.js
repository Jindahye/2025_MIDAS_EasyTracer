import { db } from "./firebase";
import { problems } from "./problemData"; 
import { updateUserScore } from "./authService"; 
import { collection, addDoc } from "firebase/firestore";

// 1. 문제 목록 다 가져오기
export const getProblems = () => {
    return problems;
};

// 2. 문제 하나 가져오기
export const getProblemById = (id) => {
    return problems.find(p => String(p.id) === String(id));
};

// 3. 채점하고 결과 저장하기 (로그 제거 버전)
export const submitAnswer = async (userId, problemId, userAnswer) => {
    try {
        // (1) 정답 확인
        const problem = problems.find(p => String(p.id) === String(problemId));
        if (!problem) throw new Error("문제가 없습니다.");

        const isCorrect = (problem.answer === userAnswer);

        // (2) 제출 기록 저장
        await addDoc(collection(db, "submissions"), {
            userId: userId,
            problemId: String(problemId),
            userAnswer: userAnswer,
            isCorrect: isCorrect,
            timestamp: new Date()
        });

        // (3) 정답이면 점수 올리기
        if (isCorrect) {
            await updateUserScore(userId, String(problemId));
        }

        return isCorrect; 
    } catch (error) {
        console.error("채점 에러:", error);
        throw error;
    }
};
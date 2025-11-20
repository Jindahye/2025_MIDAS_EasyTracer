import { auth, db } from "./firebase";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut 
} from "firebase/auth";
import { 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc, 
    arrayUnion, 
    increment 
} from "firebase/firestore";

// 1. 인증 관련 함수 (로그인, 회원가입, 로그아웃)

/**
 * 회원가입 함수 (최종)
 * - 이메일/비번으로 계정 생성
 * - 자동으로 DB에 유저 정보 생성
 */
export const signUp = async (email, password) => {
    try {
        // 1. 파이어베이스 인증 계정 생성
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 2. Firestore DB에 초기 유저 데이터 생성 
        await setDoc(doc(db, "users", user.uid), {
            email: email,
            name: email.split("@")[0], // 이메일 앞부분을 닉네임으로 사용
            solvedProblems: [],        // 푼 문제 ID 목록 (초기값: 빈 배열)
            score: 0                   // 점수 (초기값: 0)
        });

        alert("회원가입 성공! (DB 데이터 생성 완료)");
        return user;
    } catch (error) {
        alert("회원가입 실패: " + error.message);
        throw error;
    }
};

/**
 * 로그인 함수
 */
export const logIn = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("로그인 성공:", userCredential.user.email);
        return userCredential.user;
    } catch (error) {
        alert("로그인 실패에 실패했습니다. 아이디와 비밀번호를 확인하세요.");
        throw error;
    }
};

/**
 * 로그아웃 함수
 */
export const logOut = async () => {
    await signOut(auth);
    alert("로그아웃 되었습니다.");
};

// 2. DB 관련 함수 (마이페이지 & 채점용)

/**
 * 내 정보 가져오기 (마이페이지용)
 * - uid를 넣으면 그 사람의 점수, 푼 문제 목록 등을 반환
 */
export const getUserData = async (uid) => {
    try {
        const userDocRef = doc(db, "users", uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            return userDoc.data(); // 유저 정보 { name, score, ... } 반환
        } else {
            console.log("유저 데이터가 없습니다.");
            return null;
        }
    } catch (error) {
        console.error("정보 가져오기 실패:", error);
        return null;
    }
};

/**
 * 점수 올려주기 (채점용)
 * - 백엔드2 팀원이 채점에 성공했을 때 호출
 * - 점수를 10점 올려주고, 푼 문제 목록에 문제ID를 추가
 */
export const updateUserScore = async (uid, problemId) => {
    try {
        const userDocRef = doc(db, "users", uid);
        await updateDoc(userDocRef, {
            solvedProblems: arrayUnion(problemId), // 중복 없이 문제 ID 추가
            score: increment(10)                   // 기존 점수 + 10점
        });
        console.log("점수 업데이트 완료!");
    } catch (error) {
        console.error("점수 반영 실패:", error);
        throw error;
    }
};
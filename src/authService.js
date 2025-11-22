import { auth, db } from "./firebase";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut,
    sendPasswordResetEmail // 비밀번호 변경 기능
} from "firebase/auth";
import { 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc, 
    arrayUnion, 
    increment 
} from "firebase/firestore";

// ==========================================
// 1. 인증 관련 (로그인/회원가입/로그아웃)
// ==========================================

/**
 * 회원가입 함수
 * - 이메일/비번으로 계정 생성 + DB에 유저 정보 자동 생성
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
        let msg = "가입 실패";
        
        // 에러 코드별 친절한 메시지 처리
        switch (error.code) {
            case "auth/email-already-in-use":
                msg = "이미 가입된 이메일입니다.";
                break;
            case "auth/weak-password":
                msg = "비밀번호는 6자리 이상이어야 합니다.";
                break;
            case "auth/invalid-email":
                msg = "이메일 형식이 올바르지 않습니다.";
                break;
            default:
                msg = "가입 실패: " + error.message;
        }

        alert(msg);
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
        let msg = "로그인 실패";

        // 로그인 에러 처리
        switch (error.code) {
            case "auth/user-not-found":
            case "auth/wrong-password":
            case "auth/invalid-credential":
                msg = "이메일 혹은 비밀번호가 일치하지 않습니다.";
                break;
            case "auth/invalid-email":
                msg = "이메일 형식이 올바르지 않습니다.";
                break;
            case "auth/too-many-requests":
                msg = "로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요.";
                break;
            default:
                msg = "로그인 실패: " + error.message;
        }

        alert(msg);
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

/**
 * 비밀번호 재설정 메일 보내기 (NEW)
 */
export const sendPasswordReset = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email);
        alert("이메일로 비밀번호 재설정 링크를 보냈습니다!\n메일함을 확인해주세요.");
    } catch (error) {
        console.error(error);
        let msg = "메일 전송 실패";
        if (error.code === 'auth/user-not-found') {
            msg = "가입되지 않은 이메일입니다.";
        } else if (error.code === 'auth/invalid-email') {
            msg = "이메일 형식이 올바르지 않습니다.";
        } else {
            msg = "전송 실패: " + error.message;
        }
        alert(msg);
    }
};


// ==========================================
// 2. DB 관련 함수 (마이페이지 & 채점용)
// ==========================================

/**
 * 내 정보 가져오기 (마이페이지용)
 */
export const getUserData = async (uid) => {
    try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data(); // 유저 정보 반환
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
 */
export const updateUserScore = async (uid, problemId) => {
    try {
        const userRef = doc(db, "users", uid);
        
        await updateDoc(userRef, {
            solvedProblems: arrayUnion(problemId), // 중복 없이 문제 ID 추가
            score: increment(10)                   // 기존 점수 + 10점
        });
        console.log("점수 업데이트 완료!");
    } catch (error) {
        console.error("점수 업데이트 실패:", error);
        throw error;
    }
};
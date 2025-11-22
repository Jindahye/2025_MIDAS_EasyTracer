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

// ==========================================
// 1. 인증 관련 (로그인/회원가입)
// ==========================================

/**
 * 회원가입 함수 (에러 메시지 개선됨)
 */
export const signUp = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 가입 즉시 DB에 초기 데이터 생성
        await setDoc(doc(db, "users", user.uid), {
            email: email,
            name: email.split("@")[0], 
            solvedProblems: [], 
            score: 0            
        });

        alert("회원가입 성공! (DB 데이터 생성 완료)");
        return user;
    } catch (error) {
        let msg = "가입 실패";
        
        // ★ 여기를 수정했습니다! 에러 코드별 한글 메시지 ★
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
 * 로그인 함수 (에러 메시지 개선됨)
 */
export const logIn = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("로그인 성공:", userCredential.user.email);
        return userCredential.user;
    } catch (error) {
        let msg = "로그인 실패";

        // ★ 로그인 에러 처리 추가 ★
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


// ==========================================
// 2. DB 관련 함수 (마이페이지 & 채점용)
// ==========================================

export const getUserData = async (uid) => {
    try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            console.log("유저 데이터가 없습니다.");
            return null;
        }
    } catch (error) {
        console.error("정보 가져오기 실패:", error);
        return null;
    }
};

export const updateUserScore = async (uid, problemId) => {
    try {
        const userRef = doc(db, "users", uid);
        
        await updateDoc(userRef, {
            solvedProblems: arrayUnion(problemId), 
            score: increment(10)                   
        });
        console.log("점수 업데이트 완료!");
    } catch (error) {
        console.error("점수 업데이트 실패:", error);
        throw error;
    }
};
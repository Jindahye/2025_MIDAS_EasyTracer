import { auth, db } from "./firebase";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut 
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

// 1. 회원가입 기능 (회원가입 + DB에 유저 정보 저장)
export const signUp = async (email, password) => {
    try {
        // (1) 인증: 로그인 계정 만들기
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // (2) DB: 'users' 장부에 이 사람 정보 적어놓기
        await setDoc(doc(db, "users", user.uid), {
            email: email,
            name: email.split("@")[0], // 이메일 앞부분을 이름으로 씀
            solvedProblems: [],        // 푼 문제 목록 (빈칸)
            score: 0                   // 점수 (0점)
        });

        alert("회원가입 및 DB 저장 성공!");
        return user;
    } catch (error) {
        alert("가입 실패: " + error.message);
        throw error;
    }
};

// 2. 로그인 기능
export const logIn = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("로그인 유저:", userCredential.user);
        return userCredential.user;
    } catch (error) {
        alert("로그인 실패! 아이디/비번을 확인하세요.");
        throw error;
    }
};

// 3. 로그아웃 기능
export const logOut = async () => {
    await signOut(auth);
    alert("로그아웃 되었습니다.");
};
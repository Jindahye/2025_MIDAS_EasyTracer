import { auth } from "./firebase";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut 
} from "firebase/auth";

// 1. 회원가입 기능
export const signUp = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        alert("회원가입 성공!");
        return userCredential.user;
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
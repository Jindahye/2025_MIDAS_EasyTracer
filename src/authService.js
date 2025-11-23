import { auth, db } from "./firebase";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut,
    sendPasswordResetEmail,
    deleteUser 
} from "firebase/auth";
import { 
    doc, 
    setDoc, 
    getDoc, 
    deleteDoc, 
    arrayUnion, 
    increment,
    updateDoc, // ★ 이 도구가 빠졌었습니다! 추가됨.
    collection, query, where, getDocs
} from "firebase/firestore";

// ==========================================
// 1. 인증 관련 함수
// ==========================================

// 회원가입
export const signUp = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

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
        if (error.code === 'auth/email-already-in-use') msg = "이미 가입된 이메일입니다.";
        else if (error.code === 'auth/weak-password') msg = "비밀번호는 6자리 이상이어야 합니다.";
        else if (error.code === 'auth/invalid-email') msg = "이메일 형식이 올바르지 않습니다.";
        else msg = "가입 실패: " + error.message;
        
        alert(msg);
        throw error;
    }
};

// 로그인
export const logIn = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        let msg = "로그인 실패";
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
            msg = "이메일 혹은 비밀번호가 일치하지 않습니다.";
        } else if (error.code === 'auth/invalid-email') {
            msg = "이메일 형식이 올바르지 않습니다.";
        } else {
            msg = "로그인 실패: " + error.message;
        }
        alert(msg);
        throw error;
    }
};

// 로그아웃
export const logOut = async () => {
    await signOut(auth);
    alert("로그아웃 되었습니다.");
};

// 비밀번호 재설정
export const sendPasswordReset = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email);
        alert("이메일로 비밀번호 재설정 링크를 보냈습니다!\n메일함을 확인해주세요.");
    } catch (error) {
        console.error(error);
        alert("메일 전송 실패: " + error.message);
    }
};

// ==========================================
// 2. DB 관련 함수
// ==========================================

// 내 정보 가져오기
export const getUserData = async (uid) => {
    try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            return null;
        }
    } catch (error) {
        console.error("정보 가져오기 실패:", error);
        return null;
    }
};

// 점수 업데이트
export const updateUserScore = async (uid, problemId) => {
    try {
        const userRef = doc(db, "users", uid);
        await setDoc(userRef, {
            solvedProblems: arrayUnion(problemId),
            score: increment(10)
        }, { merge: true });
        console.log("점수 업데이트 완료!");
    } catch (error) {
        console.error("점수 업데이트 실패:", error);
        throw error;
    }
};

// 회원 탈퇴
export const deleteAccount = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
        await deleteDoc(doc(db, "users", user.uid));
        await deleteUser(user);
        alert("회원 탈퇴가 완료되었습니다. 이용해 주셔서 감사합니다.");
    } catch (error) {
        console.error("탈퇴 에러:", error);
        if (error.code === 'auth/requires-recent-login') {
            alert("보안을 위해 로그아웃 후 다시 로그인한 뒤 탈퇴를 시도해주세요.");
        } else {
            alert("탈퇴 실패: " + error.message);
        }
        throw error;
    }
};

// ★ 3. [추가됨] 닉네임 변경 함수 (export 됨)
export const updateNickname = async (uid, newName) => {
    try {
        const userRef = doc(db, "users", uid);
        // updateDoc 사용
        await updateDoc(userRef, {
            name: newName
        });
        alert("닉네임이 변경되었습니다!");
    } catch (error) {
        console.error("닉네임 변경 실패:", error);
        alert("닉네임 변경 실패: " + error.message);
        throw error;
    }
};


// 마이페이지 순위 계산 함수
export const getGlobalRank = async (userScore) => {
    try {
        const usersRef = collection(db, "users");
        
        const q = query(usersRef, where("score", ">", userScore));
        const snapshot = await getDocs(q);
        
        const rank = snapshot.size + 1;
        
        return rank;
    } catch (error) {
        console.error("랭킹 계산 실패:", error);
        return 0; 
    }
};
import { db } from "./firebase";
import { 
    collection, addDoc, getDocs, getDoc, doc, updateDoc, 
    query, where, orderBy, limit, arrayUnion, arrayRemove, increment 
} from "firebase/firestore";

// ==========================================
// 커뮤니티 (게시글) 기능 서비스
// ==========================================

// 1. 글 쓰기
export const createPost = async (userId, userName, title, content, category) => {
    try {
        await addDoc(collection(db, "posts"), {
            userId,
            authorName: userName,
            title,
            content,
            category,
            createdAt: new Date(),
            views: 0,
            likes: 0,
            likedBy: [],
            commentsCount: 0 // ★ 댓글 개수 초기화 필드 추가
        });
        return true;
    } catch (error) {
        console.error("글 작성 실패:", error);
        throw error;
    }
};

// 2. 글 목록 불러오기 (여기는 댓글 개수 카운트는 안 합니다. 무거우니까.)
export const getPosts = async (category = 'all') => {
    try {
        const postsRef = collection(db, "posts");
        let q;

        if (category === 'all' || !category) {
            q = query(postsRef, orderBy("createdAt", "desc"), limit(50));
        } else {
            // ★ 인덱스 필요함
            q = query(
                postsRef, 
                where("category", "==", category), 
                orderBy("createdAt", "desc"), 
                limit(50)
            );
        }
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("목록 로딩 실패:", error);
        return [];
    }
};

// ==========================================
// ★ 추가/수정된 기능 (댓글, 좋아요) ★
// ==========================================

// 3. 글 1개 가져오기
export const getPostById = async (postId) => {
    // ... (기존 코드 유지)
    try {
        const docRef = doc(db, "posts", postId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) return { id: docSnap.id, ...docSnap.data() };
        return null;
    } catch (error) {
        console.error("글 로딩 실패:", error);
        return null;
    }
};

// 4. 댓글 쓰기 (댓글 개수 카운트 기능 추가)
export const addComment = async (postId, userId, userName, content) => {
    try {
        // 1. 댓글 자체 저장
        await addDoc(collection(db, "posts", postId, "comments"), {
            userId,
            authorName: userName,
            content,
            createdAt: new Date()
        });

        // 2. ★ [추가] 부모 글의 댓글 개수 1 증가 (DB De-normalization)
        const postRef = doc(db, "posts", postId);
        await updateDoc(postRef, {
            commentsCount: increment(1)
        });

        return true;
    } catch (error) {
        console.error("댓글 작성 실패:", error);
        throw error;
    }
};

// 5. 댓글 목록 가져오기 (기존 코드 유지)
export const getComments = async (postId) => {
    try {
        const q = query(
            collection(db, "posts", postId, "comments"),
            orderBy("createdAt", "asc")
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("댓글 로딩 실패:", error);
        return [];
    }
};

// 6. 좋아요 토글 (댓글 개수 세는 기능과 동일한 방식입니다.)
export const toggleLike = async (postId, userId) => {
    try {
        const postRef = doc(db, "posts", postId);
        const postSnap = await getDoc(postRef);
        
        if (!postSnap.exists()) return false;

        const data = postSnap.data();
        const likedBy = data.likedBy || [];

        if (likedBy.includes(userId)) {
            // 좋아요 취소
            await updateDoc(postRef, {
                likes: increment(-1),
                likedBy: arrayRemove(userId)
            });
            return false;
        } else {
            // 좋아요 추가
            await updateDoc(postRef, {
                likes: increment(1),
                likedBy: arrayUnion(userId)
            });
            return true;
        }
    } catch (error) {
        console.error("좋아요 실패:", error);
        throw error;
    }
};
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import {
  collection,
  query,
  where,
  addDoc,
  getDocs,
  getDoc,
  orderBy,
  serverTimestamp,
  doc,
  Timestamp,
} from "firebase/firestore";
import { useAuth } from "../../lib/useAuth";
import Header from "../../components/Header";

type Post = {
  id: string;
  content: string;
  createdAt: Timestamp;
  loopId: string;
  userId: string;
  nickname?: string;
};

export default function LoopDetailPage() {
  const router = useRouter();
  const { id: loopId } = router.query;
  const { user, loading } = useAuth();
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);

  // 게시글 목록 불러오기
  const fetchPosts = async () => {
    if (!loopId) {
      console.log("loopId가 없습니다");
      return;
    }

    const q = query(
      collection(db, "posts"),
      where("loopId", "==", loopId),
      orderBy("createdAt", "desc")
    );

    const snap = await getDocs(q);
    const list: Post[] = [];

    for (const docSnap of snap.docs) {
      const data = docSnap.data() as Omit<Post, "id" | "nickname">;
      
      const userRef = doc(db, "users", data.userId);
      const userSnap = await getDoc(userRef);
      const nickname = userSnap.exists() ? userSnap.data().nickname : "알 수 없음";
      
      list.push({
        id: docSnap.id,
        ...data,
        nickname,
      });
    }

    setPosts(list);
  };

  // 게시글 작성
  const submitPost = async () => {
    if (!user || !content || !loopId) {
      console.log("❌ 로그인되지 않았거나 내용이 비어 있음");
      return;
    }

    try {
      // 타임아웃을 5초로 설정
      const timeout = 5000;
      const controller = new AbortController();
    
      // 요청 타임아웃 설정 (5초 후에 요청 취소)
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      // Firestore에 게시글 추가
      const postPromise = addDoc(collection(db, "posts"), {
        content,
        userId: user.uid,
        loopId,
        createdAt: serverTimestamp(),
      });

      // Firestore 응답 대기
      const response = await postPromise;

      // 타임아웃이 발생했을 경우
      clearTimeout(timeoutId); // 타임아웃 클리어

      // 성공적으로 데이터가 추가되면 화면 갱신
      console.log("✅ 게시글 작성 성공:", response);

      // 상태 초기화 및 게시글 목록 갱신
      setContent("");
      fetchPosts();
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.error("❌ 요청이 시간 초과되었습니다.");
      } else {
        console.error("❌ 게시글 작성 중 오류 발생:", error);
      }
    }
  };

  useEffect(() => {
    if (loopId) {
      fetchPosts();
    }
  }, [loopId]);

  if (loading) return <div className="p-6">로딩 중...</div>;
  if (!user) return <div className="p-6">로그인 후 이용해 주세요.</div>;

  return (
    <>
      <Header />
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">루프 타임라인</h1>

        {/* 게시글 작성 */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="무슨 일이 있었나요?"
          className="w-full border p-3 rounded mb-3"
        />
        <button
          onClick={submitPost}
          className="bg-indigo-600 text-white px-4 py-2 rounded mb-6"
        >
          게시하기
        </button>

        {/* 게시글 목록 */}
        <ul className="space-y-4">
          {posts.map((post) => (
            <li key={post.id} className="border p-4 rounded shadow bg-white">
              <p className="text-slate-500 text-sm mb-1">
                ✏️ {post.nickname || post.userId.slice(0, 6)}
              </p>
              <p className="text-base">{post.content}</p>
              <p className="text-xs text-slate-400 mt-2">
                {post.createdAt?.seconds
                  ? new Date(post.createdAt.seconds * 1000).toLocaleString()
                  : ""}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

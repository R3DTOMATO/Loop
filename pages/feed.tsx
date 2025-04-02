import { useEffect, useState } from "react";
import { db } from "../lib/firebase"; // ✅ 정확한 상대경로 확인

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import CommentSection from "../components/CommentSection";
import { useAuth } from "../lib/useAuth";
import Header from "../components/Header";

type Post = {
  id: string;
  content: string;
  createdAt: Timestamp;
  loopId: string;
  userId: string;
  loopName?: string;
};

export default function FeedPage() {
  const { user, loading } = useAuth();
  const [feedPosts, setFeedPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchFeed = async () => {
      if (!user) return;

      const userLoopSnap = await getDocs(
        query(collection(db, "userLoops"), where("userId", "==", user.uid))
      );
      const loopIds = userLoopSnap.docs.map((doc) => doc.data().loopId);
      if (loopIds.length === 0) return;

      const postSnap = await getDocs(
        query(collection(db, "posts"), orderBy("createdAt", "desc"))
      );

      const filteredPosts: Post[] = [];

      for (const docSnap of postSnap.docs) {
        const data = docSnap.data();
        if (loopIds.includes(data.loopId)) {
          const loopDoc = await getDoc(doc(db, "loops", data.loopId));
          const loopName = loopDoc.exists() ? loopDoc.data().name : "알 수 없음";

          filteredPosts.push({
            id: docSnap.id,
            ...data,
            loopName,
          } as Post);
        }
      }

      setFeedPosts(filteredPosts);
    };

    fetchFeed();
  }, [user]);

  if (loading) return <div className="p-6">로딩 중...</div>;
  if (!user) return <div className="p-6">로그인 후 이용해 주세요.</div>;

  return (
    <>
      <Header />
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">홈 피드</h1>

        {feedPosts.length === 0 ? (
          <p className="text-slate-500">참여한 루프의 게시글이 없습니다.</p>
        ) : (
          <ul className="space-y-6">
            {feedPosts.map((post) => (
              <li key={post.id} className="border p-4 rounded shadow bg-white">
                <p className="text-sm text-indigo-600 mb-1">📎 {post.loopName}</p>
                <p>{post.content}</p>
                <p className="text-xs text-slate-400 mt-2">
                  작성자: {post.userId.slice(0, 6)} |{" "}
                  {post.createdAt.toDate().toLocaleString()}
                </p>
                <CommentSection postId={post.id} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

import { useEffect, useState } from "react";
import { db, auth } from "../lib/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  getDoc,
  doc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

// 댓글 타입 정의
type Comment = {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: Timestamp;
  nickname?: string;
};

// 댓글 작성 컴포넌트
export default function CommentSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");

  // 댓글 불러오기 (작성자 닉네임 포함)
  const fetchComments = async () => {
    const q = query(
      collection(db, "comments"),
      where("postId", "==", postId),
      orderBy("createdAt", "asc")
    );
    const snapshot = await getDocs(q);

    const commentList: Comment[] = [];

    for (const docSnap of snapshot.docs) {
      // 🔥 타입 단언으로 오류 제거
      const data = docSnap.data() as {
        postId: string;
        userId: string;
        content: string;
        createdAt: Timestamp;
      };

      const userRef = doc(db, "users", data.userId);
      const userSnap = await getDoc(userRef);
      const nickname = userSnap.exists() ? userSnap.data().nickname : "알 수 없음";

      commentList.push({
        id: docSnap.id,
        ...data,
        nickname,
      });
    }

    setComments(commentList);
  };

  // 댓글 작성
  const submitComment = async () => {
    const user = auth.currentUser;
    if (!user || !text) return;

    await addDoc(collection(db, "comments"), {
      postId,
      userId: user.uid,
      content: text,
      createdAt: serverTimestamp(),
    });

    setText("");
    fetchComments();
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  return (
    <div className="mt-4 border-t pt-2">
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="댓글 작성..."
          className="flex-1 border px-3 py-1 rounded text-sm"
        />
        <button
          onClick={submitComment}
          className="text-sm bg-indigo-600 text-white px-3 py-1 rounded"
        >
          등록
        </button>
      </div>

      <ul className="mt-3 space-y-2">
        {comments.map((comment) => (
          <li key={comment.id} className="text-sm text-slate-700">
            <span className="text-slate-400 mr-2">
              {comment.nickname || comment.userId.slice(0, 6)}:
            </span>
            {comment.content}
          </li>
        ))}
      </ul>
    </div>
  );
}

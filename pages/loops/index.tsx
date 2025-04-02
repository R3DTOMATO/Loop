import { useEffect, useState } from "react";
import { db, auth } from "../../lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import Link from "next/link";
import { Timestamp } from "firebase/firestore";

type Loop = {
  id: string;
  name: string;
  description?: string;
  createdAt?: Timestamp;
};

export default function LoopListPage() {
  const [loops, setLoops] = useState<Loop[]>([]);

  useEffect(() => {
    const fetchLoops = async () => {
      const snapshot = await getDocs(collection(db, "loops"));
      const loopList: Loop[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Loop[];
      setLoops(loopList);
    };

    fetchLoops();
  }, []);

  // 🔹 루프 참여 함수
  const joinLoop = async (loopId: string) => {
    const user = auth.currentUser;
    if (!user) return alert("로그인이 필요합니다");

    await addDoc(collection(db, "userLoops"), {
      userId: user.uid,
      loopId,
      joinedAt: serverTimestamp(),
    });

    alert("루프에 참여했습니다!");
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">전체 루프</h1>
      <ul className="space-y-4">
        {loops.map((loop) => (
          <li key={loop.id} className="border p-4 rounded shadow bg-white">
            <h2 className="text-lg font-semibold">{loop.name}</h2>
            <p className="text-sm text-slate-600">{loop.description}</p>
            <div className="flex justify-between items-center mt-2">
              <Link href={`/loops/${loop.id}`}>
                <span className="text-indigo-600 text-sm hover:underline">루프 보기</span>
              </Link>
              <button
                onClick={() => joinLoop(loop.id)}
                className="text-sm text-indigo-600 hover:underline"
              >
                참여하기
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
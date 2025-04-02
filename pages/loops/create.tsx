import { useState } from "react";
import { db, auth } from "../../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function CreateLoopPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const createLoop = async () => {
    if (!name) return alert("루프 이름을 입력해주세요");
    const user = auth.currentUser;
    if (!user) return alert("로그인이 필요합니다");

    await addDoc(collection(db, "loops"), {
      name,
      description,
      createdAt: serverTimestamp(),
      creatorId: user.uid,
    });

    alert("루프가 생성되었습니다!");
    setName("");
    setDescription("");
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">루프 생성</h1>
      <input
        className="w-full border p-2 mb-3 rounded"
        placeholder="루프 이름"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <textarea
        className="w-full border p-2 mb-3 rounded"
        placeholder="설명 (선택)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button
        onClick={createLoop}
        className="bg-indigo-600 text-white px-4 py-2 rounded"
      >
        루프 만들기
      </button>
    </div>
  );
}

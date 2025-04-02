import { useState } from "react";
import { auth, db } from "../lib/firebase";
import { doc, setDoc } from "firebase/firestore";

const interests = ["게임", "음악", "AI", "디자인"];

export default function InterestSelector() {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (item: string) => {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((v) => v !== item) : [...prev, item]
    );
  };

  const save = async () => {
    const user = auth.currentUser;
    if (!user) return alert("로그인 필요");

    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      interests: selected,
    });

    alert("저장 완료!");
  };

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold text-slate-700 mb-2">관심사 선택</h2>
      <div className="flex flex-wrap gap-2 mb-4">
        {interests.map((item) => (
          <button
            key={item}
            onClick={() => toggle(item)}
            className={`px-4 py-2 rounded-full border text-sm transition ${
              selected.includes(item)
                ? "bg-indigo-600 text-white"
                : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
      <button
        onClick={save}
        className="bg-green-600 hover:bg-green-700 text-white w-full p-3 rounded-lg font-medium"
      >
        저장하기
      </button>
    </div>
  );
  
}

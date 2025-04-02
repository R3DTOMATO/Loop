import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../lib/firebase";
import InterestSelector from "../components/InterestSelector";
import { Mail, Lock } from "lucide-react";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [isSignedUp, setIsSignedUp] = useState(false);

  const signup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        nickname: nickname,
      });

      alert("회원가입 성공!");
      setIsSignedUp(true);
    } catch (err) {
      if (err instanceof Error) alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-6">
          회원가입
        </h1>

        {/* 이메일 입력 */}
        <div className="relative mb-3">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="email"
            className="pl-12 pr-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:border-slate-600"
            placeholder="이메일"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* 비밀번호 입력 */}
        <div className="relative mb-3">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="password"
            className="pl-12 pr-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:border-slate-600"
            placeholder="비밀번호"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* 닉네임 입력 */}
        <div className="mb-4">
          <input
            className="w-full border rounded-lg px-4 py-3 dark:bg-slate-700 dark:border-slate-600"
            placeholder="닉네임"
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>

        <button
          onClick={signup}
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 w-full rounded-lg font-semibold"
        >
          가입하기
        </button>

        {isSignedUp && <InterestSelector />}
      </div>
    </div>
  );
}

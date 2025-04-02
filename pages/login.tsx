import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useRouter } from "next/router";
import { Mail, Lock } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("로그인 성공!");
      router.push("/feed"); // 로그인 후 이동할 페이지
    } catch (err) {
      if (err instanceof Error) alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-6">
          로그인
        </h1>

        {/* 이메일 */}
        <div className="relative mb-3">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="email"
            placeholder="이메일"
            onChange={(e) => setEmail(e.target.value)}
            className="pl-12 pr-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:border-slate-600"
          />
        </div>

        {/* 비밀번호 */}
        <div className="relative mb-4">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="password"
            placeholder="비밀번호"
            onChange={(e) => setPassword(e.target.value)}
            className="pl-12 pr-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:border-slate-600"
          />
        </div>

        {/* 로그인 버튼 */}
        <button
          onClick={login}
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 w-full rounded-lg font-semibold"
        >
          로그인
        </button>
      </div>
    </div>
  );
}

import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useAuth } from "../lib/useAuth";

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="w-full bg-white dark:bg-slate-800 border-b px-6 py-4 flex justify-between items-center">
      <div className="text-xl font-bold text-indigo-600">
        <Link href="/feed">Loop SNS</Link>
      </div>

      <div className="flex items-center gap-4 text-sm">
        {user ? (
          <>
            <span className="text-slate-600 dark:text-slate-300">
              {user.email}
            </span>
            <button
              onClick={() => signOut(auth)}
              className="text-indigo-600 hover:underline"
            >
              로그아웃
            </button>
          </>
        ) : (
          <Link href="/login" className="text-indigo-600 hover:underline">
            로그인
          </Link>
        )}
      </div>
    </header>
  );
}

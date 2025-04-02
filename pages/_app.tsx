import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useAuth } from "../lib/useAuth";

export default function App({ Component, pageProps }: AppProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-6 text-center">로딩 중...</div>;
  }

  return <Component {...pageProps} user={user} />;
}

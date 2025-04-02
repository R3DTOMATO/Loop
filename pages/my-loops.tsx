import { useEffect, useState } from "react";
import { db, auth } from "../lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";

type Loop = {
  id: string;
  name: string;
  description?: string;
};

export default function MyLoops() {
  const [myLoops, setMyLoops] = useState<Loop[]>([]);

  useEffect(() => {
    const fetchMyLoops = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(collection(db, "userLoops"), where("userId", "==", user.uid));
      const snap = await getDocs(q);

      const loopData: Loop[] = [];

      for (const docSnap of snap.docs) {
        const loopId = docSnap.data().loopId;
        const loopRef = doc(db, "loops", loopId);
        const loopDoc = await getDoc(loopRef);
        if (loopDoc.exists()) {
          loopData.push({ id: loopDoc.id, ...(loopDoc.data() as Omit<Loop, "id">) });
        }
      }

      setMyLoops(loopData);
    };

    fetchMyLoops();
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">내가 참여한 루프</h1>
      <ul className="space-y-4">
        {myLoops.map((loop) => (
          <li key={loop.id} className="border p-4 rounded bg-white shadow">
            <h2 className="text-lg font-semibold">{loop.name}</h2>
            <p className="text-sm text-slate-600">{loop.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import SharedProfileView from "@/components/SharedProfileView";

export default function SharedProfilePage({ params }) {
  const { code } = params;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(collection(db, "profiles"));
      const all = snap.docs.map(d => d.data());
      setProfile(all.find(p => p.globalProfileNo === code));
      setLoading(false);
    };
    load();
  }, [code]);

  if (loading) {
    return <p className="p-4 text-sm text-gray-500">Loading profile…</p>;
  }

  return (
    <SharedProfileView
      profile={profile}
      onBack={() => router.push("/")}
    />
  );
}

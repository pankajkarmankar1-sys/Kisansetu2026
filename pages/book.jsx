import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";
import BookService from "../components/customer/BookService";

export default function BookPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [selKhet, setSelKhet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/");
        return;
      }

      setUser(user);

      const savedFarm = localStorage.getItem("selectedFarm");

      if (savedFarm) {
        setSelKhet(JSON.parse(savedFarm));
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  return (
    <BookService
      user={user}
      selKhet={selKhet}
      setSelKhet={setSelKhet}
      onNext={() => router.push("/dashboard")}
      back={() => router.back()}
    />
  );
}

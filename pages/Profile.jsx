import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Profile from "../components/customer/Profile";

export default function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      setUser(user);
    }
  }

  return <Profile user={user} />;
}

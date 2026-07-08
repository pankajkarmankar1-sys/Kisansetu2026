// hooks/useAuth.js

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";


export default function useAuth() {

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);



  useEffect(() => {

    checkSession();


    const {
      data: listener
    } = supabase.auth.onAuthStateChange(
      (
        event,
        session
      ) => {

        setUser(
          session?.user || null
        );

      }
    );


    return () => {

      listener.subscription.unsubscribe();

    };


  }, []);





  async function checkSession() {

    const {
      data
    } = await supabase.auth.getSession();


    setUser(
      data.session?.user || null
    );


    setLoading(false);

  }





  async function login(phone, password) {

    const {
      data,
      error
    } =
    await supabase.auth.signInWithPassword({

      phone,

      password,

    });


    if(error) throw error;


    setUser(data.user);


    return data.user;

  }





  async function logout() {

    await supabase.auth.signOut();

    setUser(null);

  }





  return {

    user,

    loading,

    login,

    logout,

    setUser,

  };

}

"use client";

import { useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../lib/supabase";


export default function AuthProvider({
  children
}) {

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);



  useEffect(() => {

    checkUser();


    const {
      data: listener
    } =
    supabase.auth.onAuthStateChange(
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





  async function checkUser(){

    const {
      data
    } =
    await supabase.auth.getSession();


    setUser(
      data.session?.user || null
    );


    setLoading(false);

  }





  async function logout(){

    await supabase.auth.signOut();

    setUser(null);

  }




  return (

    <AuthContext.Provider

      value={{
        user,
        loading,
        logout,
        setUser,
      }}

    >

      {children}

    </AuthContext.Provider>

  );

}

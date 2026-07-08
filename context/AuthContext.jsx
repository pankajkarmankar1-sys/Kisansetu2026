// context/AuthContext.js

import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import { supabase } from "../lib/supabase";


const AuthContext =
  createContext(null);



export function AuthProvider({
  children
}) {

  const [user, setUser] =
    useState(null);


  const [loading, setLoading] =
    useState(true);



  useEffect(() => {

    checkSession();


    const {
      data
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

      data?.subscription?.unsubscribe();

    };


  }, []);





  async function checkSession(){

    const {
      data
    } =
    await supabase.auth.getSession();


    setUser(
      data.session?.user || null
    );


    setLoading(false);

  }





  async function login(data){

    setUser(data);

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

        login,

        logout,

        setUser,

      }}

    >

      {children}

    </AuthContext.Provider>

  );

}





export function useAuthContext(){

  return useContext(
    AuthContext
  );

}

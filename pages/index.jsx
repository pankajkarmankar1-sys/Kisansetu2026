import { useEffect } from "react";
import { supabase } from "../lib/supabase";


export default function Home() {


  useEffect(() => {

    checkConnection();

  }, []);



  async function checkConnection() {

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .limit(1);


    if (error) {

      console.log("Supabase Error:", error.message);

    } else {

      console.log("Supabase Connected:", data);

    }

  }



  return (

    <div>

      <h1>
        KisanSetu Supabase Test
      </h1>

    </div>

  );

}

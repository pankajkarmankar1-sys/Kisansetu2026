import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import DocumentUpload from "../components/customer/DocumentUpload";
import { supabase } from "../lib/supabase";


export default function DocumentsPage() {

  const router = useRouter();

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);



  useEffect(() => {

    checkStatus();

  }, []);



  async function checkStatus() {


    const {
      data:{
        user
      }
    } = await supabase.auth.getUser();



    if(!user){

      router.replace("/login");
      return;

    }



    const {
      data:profile
    } = await supabase
      .from("profiles")
      .select("document_status")
      .eq(
        "auth_user_id",
        user.id
      )
      .maybeSingle();



    setStatus(
      profile?.document_status || "pending"
    );


    setLoading(false);

  }




  function done(){

    router.replace("/dashboard");

  }




  if(loading){

    return <h2>Loading...</h2>;

  }




  return (

    <div style={{padding:20}}>


      {
        status === "approved" && (

          <div>

            <h2>
              ✅ Documents Approved
            </h2>

            <button
              onClick={done}
            >
              Go Dashboard
            </button>

          </div>

        )
      }



      {
        status === "pending" && (

          <div>

            <h2>
              ⏳ Documents Verification Pending
            </h2>

            <p>
              Admin approval ka wait kare.
            </p>

          </div>

        )
      }



      {
        status === "rejected" && (

          <div>

            <h2>
              ❌ Documents Rejected
            </h2>

            <p>
              Kripya documents dobara upload kare.
            </p>


            <DocumentUpload
              onDone={done}
            />


          </div>

        )
      }



    </div>

  );

}

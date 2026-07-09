import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import DocumentUpload from "../components/customer/DocumentUpload";
import { supabase } from "../lib/supabase";


export default function DocumentsPage() {

  const router = useRouter();

  const [status,setStatus] = useState("");
  const [reason,setReason] = useState("");
  const [loading,setLoading] = useState(true);



  useEffect(()=>{

    checkStatus();

  },[]);




  async function checkStatus(){


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
      .select(
        "document_status,document_reject_reason"
      )
      .eq(
        "auth_user_id",
        user.id
      )
      .maybeSingle();




    setStatus(
      profile?.document_status || "pending"
    );


    setReason(
      profile?.document_reject_reason || ""
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

    <div
      style={{
        padding:20
      }}
    >



      {
        status==="approved" && (

          <div>

            <h2>
              ✅ Documents Approved
            </h2>

            <p>
              Ab aap service booking kar sakte hain.
            </p>


            <button
              onClick={done}
            >
              Go Dashboard
            </button>


          </div>

        )
      }






      {
        (status==="pending" ||
         status==="rejected") && (


          <div>


            {
              status==="pending" && (

                <>

                <h2>
                  📄 Upload Documents
                </h2>

                <p>
                  Aadhaar aur 7/12 upload kare.
                </p>

                </>

              )
            }




            {
              status==="rejected" && (

                <>

                <h2>
                  ❌ Documents Rejected
                </h2>


                <p>
                  Reason:
                  {" "}
                  {reason}
                </p>


                <p>
                  Documents dobara upload kare.
                </p>

                </>

              )
            }





            <DocumentUpload

              onDone={done}

            />



          </div>


        )
      }




    </div>

  );

}

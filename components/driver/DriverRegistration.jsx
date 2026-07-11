import React, { useState } from "react";
import { supabase } from "../../lib/supabase";


export default function DriverRegistration() {


  const [driver,setDriver] = useState({

    name:"",
    phone:"",
    aadhaar:"",
    vehicle_type:"",
    vehicle_number:""

  });



  const [docs,setDocs] = useState({

    aadhaarFront:null,
    aadhaarBack:null,
    license:null,
    rc:null,
    vehiclePhoto:null

  });



  const [loading,setLoading] = useState(false);





  function change(e){

    setDriver({

      ...driver,

      [e.target.name]:
      e.target.value

    });

  }







  function selectFile(e,name){

    setDocs({

      ...docs,

      [name]:
      e.target.files[0]

    });

  }








  async function uploadFile(file,folder,userId){


    if(!file)
      return null;



    const fileName =

    `${folder}/${userId}_${Date.now()}_${file.name}`;





    const {
      error
    } = await supabase.storage

    .from("driver-documents")

    .upload(
      fileName,
      file
    );





    if(error)
      throw error;




    const {
      data
    } =
    supabase.storage

    .from("driver-documents")

    .getPublicUrl(
      fileName
    );



    return data.publicUrl;


  }








  async function submit(){


    try{


      setLoading(true);




      const {
        data:{
          user
        }
      } =
      await supabase.auth.getUser();




      if(!user){

        alert("Login required");

        return;

      }







      const aadhaarFront =
      await uploadFile(
        docs.aadhaarFront,
        "aadhaar-front",
        user.id
      );



      const aadhaarBack =
      await uploadFile(
        docs.aadhaarBack,
        "aadhaar-back",
        user.id
      );



      const license =
      await uploadFile(
        docs.license,
        "license",
        user.id
      );



      const rc =
      await uploadFile(
        docs.rc,
        "rc",
        user.id
      );



      const vehiclePhoto =
      await uploadFile(
        docs.vehiclePhoto,
        "vehicle",
        user.id
      );








      const {
        error
      } = await supabase

      .from("profiles")

      .update({

        name:
        driver.name,


        phone:
        driver.phone,


        role:
        "driver",


        aadhaar_front:
        aadhaarFront,


        aadhaar_back:
        aadhaarBack,


        driving_license:
        license,


        rc_book:
        rc,


        vehicle_photo:
        vehiclePhoto,


        tractor_details:
        driver.vehicle_type,


        tractor_num:
        driver.vehicle_number,


        document_status:
        "pending"


      })

      .eq(

        "auth_user_id",

        user.id

      );







      if(error)
        throw error;





      alert(
        "✅ Driver Registration Submitted"
      );



    }
    catch(err){

      alert(err.message);

    }
    finally{

      setLoading(false);

    }

  }








  return (

    <div style={{padding:20}}>


      <h2>
        🚜 Driver Registration
      </h2>




      {
        Object.keys(driver).map((key)=>(

          <input

            key={key}

            name={key}

            placeholder={key}

            value={driver[key]}

            onChange={change}

            style={{
              width:"100%",
              padding:12,
              marginBottom:10
            }}

          />

        ))
      }






      {
        Object.keys(docs).map((key)=>(


          <div key={key}>


            <p>
              {key}
            </p>


            <input

              type="file"

              accept="image/*,.pdf"

              capture="environment"

              onChange={(e)=>
                selectFile(e,key)
              }

            />


          </div>


        ))

      }







      <button

        onClick={submit}

        disabled={loading}

        style={{

          marginTop:20,

          width:"100%",

          padding:15,

          background:"#16a34a",

          color:"#fff"

        }}

      >

      {
        loading
        ?
        "Submitting..."
        :
        "✅ Register Driver"
      }

      </button>




    </div>

  );

}

import React, { useState } from "react";
import { supabase } from "../../lib/supabase";


export default function EditProfile({
  user,
  onDone,
  back,
}) {


  const [name,setName] =
    useState(user?.name || "");


  const [farmAddress,setFarmAddress] =
    useState(user?.farm_address || "");


  const [acres,setAcres] =
    useState(user?.acres || "");


  const [loading,setLoading] =
    useState(false);



  async function save(){


    try{


      setLoading(true);



      const {
        error
      } = await supabase
      .from("profiles")
      .update({

        name,

        farm_address:farmAddress,

        acres:Number(acres),

      })
      .eq(
        "auth_user_id",
        user.id
      );




      if(error)
        throw error;



      alert(
        "✅ Profile Updated"
      );



      if(onDone)
        onDone();



    }
    catch(err){

      alert(
        err.message
      );

    }
    finally{

      setLoading(false);

    }


  }




  return (

    <div
      style={{
        padding:20
      }}
    >


      <h2>
        ✏️ Edit Profile
      </h2>



      <input

        value={name}

        onChange={(e)=>
          setName(e.target.value)
        }

        placeholder="Name"

        style={{
          width:"100%",
          padding:12,
          marginBottom:10
        }}

      />



      <input

        value={farmAddress}

        onChange={(e)=>
          setFarmAddress(e.target.value)
        }

        placeholder="Farm Address"

        style={{
          width:"100%",
          padding:12,
          marginBottom:10
        }}

      />



      <input

        type="number"

        value={acres}

        onChange={(e)=>
          setAcres(e.target.value)
        }

        placeholder="Acres"

        style={{
          width:"100%",
          padding:12
        }}

      />



      <button

        onClick={save}

        disabled={loading}

        style={{
          marginTop:20,
          width:"100%",
          padding:14,
          background:"#16a34a",
          color:"#fff",
          border:"none"
        }}

      >

        {
          loading
          ?
          "Saving..."
          :
          "Save Profile"
        }

      </button>



      <button

        onClick={back}

        style={{
          marginTop:10,
          width:"100%",
          padding:14
        }}

      >

        ← Back

      </button>



    </div>

  );

}

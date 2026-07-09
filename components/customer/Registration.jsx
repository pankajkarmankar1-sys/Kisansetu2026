import { useState } from "react";
import { supabase } from "../../lib/supabase";
import CustomerLocation from "./CustomerLocation";
import LocationSelector from "../maps/LocationSelector";


export default function Registration({
  phone,
  onDone,
  back,
}) {


  const [name,setName] = useState("");

  const [farmAddress,setFarmAddress] = useState("");

  const [acres,setAcres] = useState("");

  const [location,setLocation] = useState(null);


  const [loading,setLoading] = useState(false);

  const [error,setError] = useState("");





  function handleLocation(data){

    setLocation(data);

  }







  async function handleSubmit(e){

    e.preventDefault();


    setError("");





    if(!name){

      setError(
        "Please enter your name"
      );

      return;

    }



    if(!farmAddress){

      setError(
        "Please enter farm address"
      );

      return;

    }



    if(!acres || Number(acres)<=0){

      setError(
        "Enter valid acres"
      );

      return;

    }



    if(!location){

      setError(
        "Please select location"
      );

      return;

    }






    try{


      setLoading(true);




      const {
        data:{
          user
        }
      } =
      await supabase.auth.getUser();





      if(!user){

        throw new Error(
          "Login expired"
        );

      }






      const {
        error
      } =
      await supabase

        .from("profiles")

        .upsert({

          auth_user_id:
            user.id,



          phone:
            phone ||
            user.phone,



          role:
            "farmer",



          name:
            name,



          farm_address:
            farmAddress,



          acres:
            Number(acres),




          village:
            location.village || "",



          state:
            location.state || "",



          district:
            location.district || "",



          taluka:
            location.taluka || "",




          latitude:
            location.latitude ||
            location.lat ||
            null,



          longitude:
            location.longitude ||
            location.lng ||
            null,



          document_status:
            "pending",


        },

        {

          onConflict:
            "auth_user_id"

        }

      );







      if(error)
        throw error;







      alert(
        "✅ Registration Complete"
      );





      if(onDone){

        onDone();

      }







    }
    catch(err){

      console.log(err);

      setError(
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
        👨‍🌾 Farmer Registration
      </h2>





      <form onSubmit={handleSubmit}>





        <input

          placeholder="Full Name"

          value={name}

          onChange={(e)=>
            setName(e.target.value)
          }

          style={input}

        />






        <input

          placeholder="Farm Address"

          value={farmAddress}

          onChange={(e)=>
            setFarmAddress(e.target.value)
          }

          style={input}

        />







        <input

          type="number"

          placeholder="Farm Acres"

          value={acres}

          onChange={(e)=>
            setAcres(e.target.value)
          }

          style={input}

        />







        <LocationSelector

          onSelect={handleLocation}

        />






        <CustomerLocation

          onLocationSelect={(loc)=>

            setLocation((prev)=>({

              ...prev,

              ...loc

            }))

          }

        />







        {
          error &&

          <p
            style={{
              color:"red"
            }}
          >

            {error}

          </p>

        }







        <button

          type="submit"

          disabled={loading}

          style={button}

        >

          {
            loading
            ?
            "Saving..."
            :
            "✅ Complete Registration"
          }


        </button>






        {
          back &&

          <button

            type="button"

            onClick={back}

            style={{
              ...button,
              background:"#ddd",
              color:"#000"
            }}

          >

            ← Back

          </button>

        }





      </form>


    </div>

  );

}





const input={

  width:"100%",

  padding:12,

  marginBottom:12,

  borderRadius:8,

  border:"1px solid #ccc"

};




const button={

  width:"100%",

  padding:14,

  marginTop:15,

  background:"#16a34a",

  color:"#fff",

  border:"none",

  borderRadius:10

};

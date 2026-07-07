import { useState, useEffect } from "react";
import { sbGetUser, sbSaveUser } from "../../lib/database";

export default function Profile({ phone }) {

  const [user, setUser] = useState({
    name: "",
    village: "",
    farmAddress: "",
    acres: "",
  });


  useEffect(() => {

    if (phone) {
      loadProfile();
    }

  }, [phone]);



  async function loadProfile() {

    try {

      const data = await sbGetUser(phone);


      if (data) {

        setUser({
          name: data.name || "",
          village: data.village || "",
          farmAddress: data.farm_address || "",
          acres: data.acres || "",
        });

      }


    } catch (e) {

      console.error(
        "Profile Load Error:",
        e
      );

    }

  }



  async function save() {

    try {

      await sbSaveUser({
        phone,
        ...user,
      });


      alert(
        "Profile Updated Successfully"
      );


    } catch (e) {

      alert(
        e.message
      );

    }

  }



  return (

    <div
      style={{
        padding: 20,
      }}
    >

      <h2>
        👤 My Profile
      </h2>


      <input
        placeholder="Name"
        value={user.name}
        onChange={(e) =>
          setUser({
            ...user,
            name: e.target.value,
          })
        }
      />


      <br /><br />


      <input
        placeholder="Village"
        value={user.village}
        onChange={(e) =>
          setUser({
            ...user,
            village: e.target.value,
          })
        }
      />


      <br /><br />


      <input
        placeholder="Farm Address"
        value={user.farmAddress}
        onChange={(e) =>
          setUser({
            ...user,
            farmAddress: e.target.value,
          })
        }
      />


      <br /><br />


      <input
        type="number"
        placeholder="Total Acres"
        value={user.acres}
        onChange={(e) =>
          setUser({
            ...user,
            acres: e.target.value,
          })
        }
      />


      <br /><br />


      <button onClick={save}>
        Save Profile
      </button>


    </div>

  );
}

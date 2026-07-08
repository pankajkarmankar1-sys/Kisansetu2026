import { useState, useEffect } from "react";
import { sbGetUser, sbSaveUser } from "../../lib/database";

export default function Profile({ user }) {

  const [profile, setProfile] = useState({
    name: "",
    village: "",
    farmAddress: "",
    acres: "",
  });

  useEffect(() => {
    if (user?.id) {
      loadProfile();
    }
  }, [user]);

  async function loadProfile() {
    try {
      const data = await sbGetUser(user.id);

      if (data) {
        setProfile({
          name: data.name || "",
          village: data.village || "",
          farmAddress: data.farm_address || "",
          acres: data.acres || "",
        });
      }
    } catch (e) {
      console.error("Profile Load Error:", e);
    }
  }

  async function save() {
    try {
      await sbSaveUser({
        id: user.id,
        phone: user.phone || "",
        ...profile,
      });

      alert("✅ Profile Updated Successfully");
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <div style={{ padding: 20 }}>

      <h2>👤 My Profile</h2>

      <input
        placeholder="Name"
        value={profile.name}
        onChange={(e) =>
          setProfile({
            ...profile,
            name: e.target.value,
          })
        }
      />

      <br /><br />

      <input
        placeholder="Village"
        value={profile.village}
        onChange={(e) =>
          setProfile({
            ...profile,
            village: e.target.value,
          })
        }
      />

      <br /><br />

      <input
        placeholder="Farm Address"
        value={profile.farmAddress}
        onChange={(e) =>
          setProfile({
            ...profile,
            farmAddress: e.target.value,
          })
        }
      />

      <br /><br />

      <input
        type="number"
        placeholder="Total Acres"
        value={profile.acres}
        onChange={(e) =>
          setProfile({
            ...profile,
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

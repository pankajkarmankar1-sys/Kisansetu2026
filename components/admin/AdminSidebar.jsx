import React from "react";
import { useRouter } from "next/router";

export default function AdminSidebar({
  onLogout
}) {

  const router = useRouter();


  const menu = [
    {
      name:"📊 Dashboard",
      path:"/admin"
    },
    {
      name:"📋 Bookings",
      path:"/admin/bookings"
    },
    {
      name:"🚜 Drivers",
      path:"/admin/drivers"
    },
    {
      name:"👨‍🌾 Customers",
      path:"/admin/customers"
    },
    {
      name:"⚙️ Settings",
      path:"/admin/settings"
    },
  ];



  return (

    <div
      style={{
        width:250,
        minHeight:"100vh",
        background:"#1f2937",
        color:"#fff",
        padding:20,
        boxSizing:"border-box",
      }}
    >


      <h2
        style={{
          marginBottom:30
        }}
      >
        🚜 Admin Panel
      </h2>



      {
        menu.map((item)=>(

          <div

            key={item.path}

            onClick={()=>
              router.push(item.path)
            }

            style={{

              marginBottom:20,

              cursor:"pointer",

              padding:10,

              borderRadius:8,

            }}

          >

            {item.name}

          </div>


        ))
      }



      <hr />



      <div

        onClick={onLogout}

        style={{

          marginTop:20,

          color:"#ff8080",

          cursor:"pointer",

          padding:10,

        }}

      >

        🚪 Logout

      </div>



    </div>

  );

}

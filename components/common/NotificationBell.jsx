import { useEffect, useState } from "react";
import { getNotifications } from "../../lib/notificationService";


export default function NotificationBell({
  user,
  onClick,
}) {

  const [count, setCount] = useState(0);



  async function load() {

    try {

      if (!user?.id) {

        setCount(0);
        return;

      }


      const data = await getNotifications(
        user.id
      );


      setCount(
        data?.length || 0
      );


    } catch (e) {

      console.error(
        "Notification Error:",
        e
      );

    }

  }




  useEffect(()=>{

    load();


    const timer = setInterval(
      load,
      5000
    );


    return () => {
      clearInterval(timer);
    };


  },[user]);





  return (

    <button

      onClick={onClick}

      style={{

        position:"relative",

        fontSize:22,

        background:"none",

        border:"none",

        cursor:"pointer",

        color:"#fff",

      }}

    >

      🔔


      {
        count > 0 && (

          <span

            style={{

              position:"absolute",

              top:-5,

              right:-5,

              background:"red",

              color:"#fff",

              borderRadius:"50%",

              padding:"2px 6px",

              fontSize:10,

            }}

          >

            {count}

          </span>

        )
      }


    </button>

  );

}


import React, {
  useEffect,
  useState,
} from "react";

import { supabase } from "../../lib/supabase";
import ChatWindow from "./ChatWindow";


export default function AdminChatPanel({
  admin
}) {


  const [rooms,setRooms] =
    useState([]);

  const [activeRoom,setActiveRoom] =
    useState(null);




  useEffect(()=>{

    loadRooms();


    const channel =
      supabase

      .channel("admin-chat-rooms")

      .on(

        "postgres_changes",

        {

          event:"INSERT",

          schema:"public",

          table:"chat_rooms",

        },

        ()=>{

          loadRooms();

        }

      )

      .subscribe();



    return ()=>{

      supabase.removeChannel(
        channel
      );

    };


  },[]);






  async function loadRooms(){


    const {
      data,
      error
    } = await supabase

    .from("chat_rooms")

    .select("*")

    .order(
      "created_at",
      {
        ascending:false
      }
    );



    if(!error){

      setRooms(
        data || []
      );

    }


  }






  return (

    <div style={styles.container}>


      <div style={styles.sidebar}>


        <h3>
          🛠 Admin Chat Panel
        </h3>



        {
          rooms.map((room)=>(


            <div

              key={room.id}

              onClick={()=>
                setActiveRoom(room)
              }


              style={{

                ...styles.room,

                background:

                activeRoom?.id===room.id

                ?

                "#fff3e0"

                :

                "#fff",

              }}

            >


              <b>
                🚜 Driver
              </b>

              <div>

                {room.driver_id}

              </div>



              <div style={{
                fontSize:12
              }}>

                👨‍🌾 Customer:
                {" "}
                {room.customer_name}

              </div>



              <div style={{
                fontSize:11
              }}>

                Booking:
                {" "}
                {room.booking_id}

              </div>


            </div>


          ))

        }


      </div>





      <div style={styles.chatArea}>


        {

          activeRoom

          ?

          <ChatWindow

            roomId={
              activeRoom.id
            }

            user={admin}

          />


          :


          <div style={styles.empty}>

            Select chat to monitor 🛠

          </div>


        }


      </div>


    </div>

  );

}






const styles={


container:{

display:"flex",

minHeight:"100vh",

fontFamily:"sans-serif",

},


sidebar:{

width:"320px",

maxWidth:"35%",

borderRight:"1px solid #ddd",

padding:10,

overflowY:"auto",

background:"#f9f9f9",

},


room:{

padding:12,

borderRadius:8,

marginBottom:8,

cursor:"pointer",

border:"1px solid #eee",

},


chatArea:{

flex:1,

padding:10,

},


empty:{

height:"100%",

display:"flex",

justifyContent:"center",

alignItems:"center",

color:"#777",

}

};

// components/chat/DriverChat.jsx

import React, {
  useEffect,
  useState,
} from "react";

import { supabase } from "../../lib/supabase";
import ChatWindow from "./ChatWindow";


export default function DriverChat({

  driver

}) {


  const [rooms, setRooms] =
    useState([]);

  const [activeRoom, setActiveRoom] =
    useState(null);

  const [loading, setLoading] =
    useState(false);




  useEffect(()=>{

    if(driver?.id){

      loadRooms();

    }

  },[driver?.id]);





  async function loadRooms(){


    try{


      setLoading(true);



      const {
        data,
        error
      } =
      await supabase
      .from("chat_rooms")
      .select("*")
      .eq(
        "driver_id",
        driver.id
      );



      if(error)
        throw error;




      const updated =
      await Promise.all(

        (data || [])
        .map(async(room)=>{


          const {
            count
          } =
          await supabase
          .from("messages")
          .select(
            "*",
            {
              count:"exact",
              head:true
            }
          )
          .eq(
            "room_id",
            room.id
          )
          .eq(
            "is_read",
            false
          )
          .neq(
            "sender_id",
            driver.id
          );



          return {

            ...room,

            unread:
            count || 0,

          };


        })

      );



      setRooms(updated);



    }catch(error){

      console.error(
        error
      );


    }finally{

      setLoading(false);

    }

  }





  return (

    <div style={styles.container}>


      <div style={styles.sidebar}>


        <h3>
          🚜 Driver Chats
        </h3>



        {
          loading &&
          <p>Loading...</p>
        }



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
                activeRoom?.id === room.id
                ? "#dcedc8"
                : "#fff",

              }}

            >

              <b>
                {room.customer_name}
              </b>


              <div>
                Booking:
                {" "}
                {room.booking_id}
              </div>



              {
                room.unread > 0 &&
                <span style={styles.badge}>
                  {room.unread}
                </span>
              }


            </div>

          ))
        }


      </div>





      <div style={styles.chatArea}>


        {
          activeRoom ?

          <ChatWindow

            roomId={
              activeRoom.id
            }

            user={driver}

          />

          :

          <div style={styles.empty}>
            Select chat 🚜
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

},


room:{

padding:12,

borderRadius:8,

marginBottom:8,

cursor:"pointer",

border:"1px solid #eee",

position:"relative",

},


chatArea:{

flex:1,

padding:10,

},


empty:{

height:"100%",

display:"flex",

alignItems:"center",

justifyContent:"center",

color:"#777",

},


badge:{

position:"absolute",

right:10,

top:10,

background:"red",

color:"#fff",

width:20,

height:20,

borderRadius:"50%",

display:"flex",

alignItems:"center",

justifyContent:"center",

fontSize:12,

}

};

import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import { supabase } from "../../lib/supabase";


export default function ChatWindow({
  roomId,
  user,
}) {


  const [messages, setMessages] =
    useState([]);

  const [text, setText] =
    useState("");

  const [sending, setSending] =
    useState(false);

  const bottomRef =
    useRef(null);



  useEffect(() => {

    if(!roomId) return;

    loadMessages();


    const channel =
      supabase

      .channel(
        `chat-${roomId}`
      )

      .on(

        "postgres_changes",

        {

          event:"INSERT",

          schema:"public",

          table:"messages",

          filter:
          `room_id=eq.${roomId}`,

        },


        (payload)=>{

          setMessages(prev=>{

            const exists =
            prev.find(
              m=>m.id===payload.new.id
            );


            if(exists)
              return prev;


            return [
              ...prev,
              payload.new
            ];

          });

        }

      )

      .subscribe();



    return ()=>{

      supabase.removeChannel(
        channel
      );

    };


  },[roomId]);





  async function loadMessages(){

    const {
      data,
      error
    } =
    await supabase

    .from("messages")

    .select("*")

    .eq(
      "room_id",
      roomId
    )

    .order(
      "created_at",
      {
        ascending:true
      }
    );


    if(!error){

      setMessages(
        data || []
      );

    }

  }





  async function sendMessage(){


    if(
      !text.trim() ||
      !user?.id
    )
      return;



    try{

      setSending(true);


      await supabase

      .from("messages")

      .insert([

        {

          room_id:roomId,

          sender_id:user.id,

          sender_name:
          user.name || "User",

          message:text.trim(),

          is_read:false,

          created_at:
          new Date()
          .toISOString(),

        }

      ]);



      setText("");



    }finally{

      setSending(false);

    }


  }







  async function uploadFile(file){


    if(!file)
      return null;



    if(
      file.size >
      10 * 1024 * 1024
    ){

      alert(
        "File size 10MB se kam hona chahiye"
      );

      return null;

    }



    const fileName =
    `chat/${Date.now()}-${file.name}`;



    const {
      error
    } =
    await supabase.storage

    .from("chat-files")

    .upload(
      fileName,
      file
    );



    if(error){

      console.log(error);

      return null;

    }



    const {
      data
    } =
    supabase.storage

    .from("chat-files")

    .getPublicUrl(
      fileName
    );


    return data.publicUrl;

  }






  async function sendFile(file){


    const url =
    await uploadFile(file);



    if(!url)
      return;



    await supabase

    .from("messages")

    .insert([

      {

        room_id:roomId,

        sender_id:user.id,

        sender_name:
        user.name || "User",

        message:"",

        file_url:url,

        file_type:file.type,

        is_read:false,

        created_at:
        new Date()
        .toISOString(),

      }

    ]);

  }






  useEffect(()=>{

    bottomRef.current
    ?.scrollIntoView({

      behavior:"smooth"

    });

  },[messages]);







  return (

    <div style={styles.container}>


      <div style={styles.chatBox}>


        {
          messages.map((m)=>(


            <div

              key={m.id}

              style={{

                ...styles.bubble,

                alignSelf:
                m.sender_id===user.id
                ?"flex-end"
                :"flex-start",

                background:
                m.sender_id===user.id
                ?"#DCF8C6"
                :"#fff",

              }}

            >


              {
                m.message &&
                <div>
                  {m.message}
                </div>
              }



              {
                m.file_url &&

                <div>

                  {
                    m.file_type
                    ?.includes("image")

                    ?

                    <img

                      src={m.file_url}

                      alt="file"

                      style={{
                        width:150,
                        borderRadius:10,
                      }}

                    />

                    :

                    <a
                      href={m.file_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      📎 File
                    </a>

                  }


                </div>

              }



            </div>


          ))
        }



        <div ref={bottomRef}/>


      </div>





      <div style={styles.inputBox}>


        <input

          type="file"

          id="fileUpload"

          style={{
            display:"none"
          }}

          onChange={(e)=>{

            sendFile(
              e.target.files[0]
            );

          }}

        />



        <button

          onClick={()=>{

            document
            .getElementById(
              "fileUpload"
            )
            .click();

          }}

          style={styles.fileBtn}

        >
          📎
        </button>





        <input

          value={text}

          onChange={(e)=>
            setText(e.target.value)
          }

          onKeyDown={(e)=>
            e.key==="Enter" &&
            sendMessage()
          }

          placeholder="Message..."

          style={styles.input}

        />





        <button

          onClick={sendMessage}

          disabled={sending}

          style={styles.button}

        >

          {
            sending
            ?"..."
            :"Send"
          }

        </button>



      </div>



    </div>

  );

}







const styles={


container:{

display:"flex",

flexDirection:"column",

height:"100%",

border:"1px solid #ddd",

borderRadius:10,

overflow:"hidden",

background:"#e5ddd5",

},


chatBox:{

flex:1,

padding:10,

overflowY:"auto",

display:"flex",

flexDirection:"column",

gap:8,

},


bubble:{

maxWidth:"70%",

padding:"8px 10px",

borderRadius:10,

fontSize:14,

},


inputBox:{

display:"flex",

padding:8,

background:"#fff",

alignItems:"center",

},


input:{

flex:1,

padding:10,

borderRadius:20,

border:"1px solid #ccc",

marginLeft:5,

},


button:{

marginLeft:8,

padding:"10px 16px",

border:"none",

borderRadius:20,

background:"#128C7E",

color:"#fff",

},


fileBtn:{

padding:"8px 12px",

border:"none",

borderRadius:20,

}

};

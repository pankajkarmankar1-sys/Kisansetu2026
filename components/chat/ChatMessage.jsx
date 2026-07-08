import React from "react";


export default function ChatMessage({

  message,

  own = false,

}) {


  const time =
    message?.created_at

    ?

    new Date(
      message.created_at
    )
    .toLocaleTimeString([],{

      hour:"2-digit",

      minute:"2-digit",

    })

    :

    "";




  return (

    <div

      style={{

        display:"flex",

        justifyContent:
        own
        ?"flex-end"
        :"flex-start",

        marginBottom:12,

      }}

    >


      <div

        style={{

          maxWidth:"75%",

          padding:"10px 14px",

          borderRadius:14,

          background:
          own
          ?"#16a34a"
          :"#fff",

          color:
          own
          ?"#fff"
          :"#222",

          boxShadow:
          "0 1px 3px rgba(0,0,0,0.15)",

          wordBreak:"break-word",

        }}

      >



        <div

          style={{

            fontSize:12,

            fontWeight:"bold",

            marginBottom:5,

          }}

        >

          {
            own
            ?"You"
            :
            message?.sender_name ||
            "User"
          }


        </div>




        {
          message?.message &&

          <div

            style={{

              fontSize:15,

              lineHeight:1.5,

              whiteSpace:"pre-wrap",

            }}

          >

            {message.message}

          </div>

        }





        {
          message?.file_url &&


          <div style={{
            marginTop:8
          }}>


            {
              message.file_type
              ?.includes("image")

              ?

              <img

                src={
                  message.file_url
                }

                alt="file"

                style={{

                  width:150,

                  borderRadius:10,

                }}

              />


              :


              <a

                href={
                  message.file_url
                }

                target="_blank"

                rel="noreferrer"

              >

                📎 Open File

              </a>

            }


          </div>

        }





        {
          message?.audio_url &&

          <audio

            controls

            src={
              message.audio_url
            }

            style={{

              width:200,

              marginTop:8,

            }}

          />

        }





        <div

          style={{

            marginTop:6,

            fontSize:11,

            textAlign:"right",

            opacity:0.7,

          }}

        >

          {time}


          {

            own &&

            (
              message?.status==="read"

              ?

              " ✓✓"

              :

              " ✓"

            )

          }


        </div>



      </div>


    </div>

  );

}

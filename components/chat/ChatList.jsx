import React from "react";


export default function ChatList({

  chats = [],

  selectedChat,

  onSelect,

}) {


  if(chats.length === 0){

    return (

      <div

        style={{

          padding:20,

          textAlign:"center",

          color:"#777",

        }}

      >

        💬 No chats found

      </div>

    );

  }




  return (

    <div

      style={{

        width:"100%",

        height:"100%",

        overflowY:"auto",

        background:"#fff",

        borderRight:"1px solid #ddd",

      }}

    >



      {

        chats.map((chat)=>(


          <div

            key={chat.id}

            onClick={()=>{

              onSelect?.(chat);

            }}


            style={{

              padding:15,

              cursor:"pointer",

              borderBottom:
              "1px solid #eee",

              background:

              selectedChat?.id===chat.id

              ?

              "#e8f5e9"

              :

              "#fff",

            }}

          >



            <div

              style={{

                display:"flex",

                alignItems:"center",

                justifyContent:
                "space-between",

              }}

            >



              <div

                style={{

                  display:"flex",

                  alignItems:"center",

                  gap:8,

                }}

              >


                <div

                  style={{

                    width:35,

                    height:35,

                    borderRadius:"50%",

                    background:"#16a34a",

                    color:"#fff",

                    display:"flex",

                    alignItems:"center",

                    justifyContent:"center",

                  }}

                >

                  👤

                </div>



                <b>

                  {
                    chat.name ||
                    "Unknown User"
                  }

                </b>


              </div>





              {

                chat.unread > 0 &&


                <span

                  style={{

                    minWidth:22,

                    height:22,

                    borderRadius:"50%",

                    background:"#16a34a",

                    color:"#fff",

                    display:"flex",

                    alignItems:"center",

                    justifyContent:"center",

                    fontSize:12,

                  }}

                >

                  {chat.unread}

                </span>


              }


            </div>






            <div

              style={{

                marginTop:8,

                color:"#666",

                fontSize:14,

                overflow:"hidden",

                textOverflow:"ellipsis",

                whiteSpace:"nowrap",

              }}

            >

              {
                chat.lastMessage ||
                "No messages"
              }


            </div>





            <div

              style={{

                marginTop:5,

                fontSize:11,

                color:"#999",

                textAlign:"right",

              }}

            >

              {
                chat.lastTime ||
                ""
              }

            </div>



          </div>


        ))

      }


    </div>

  );

}

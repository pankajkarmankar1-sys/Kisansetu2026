import React, {
  useState,
} from "react";


export default function ChatInput({

  onSend,

  disabled = false,

  placeholder =
  "Type a message...",

}) {


  const [text,setText] =
    useState("");




  function handleSend(){


    const message =
    text.trim();



    if(!message)
      return;



    if(onSend){

      onSend(message);

    }



    setText("");

  }






  function handleKeyDown(e){


    if(
      e.key==="Enter" &&
      !e.shiftKey
    ){

      e.preventDefault();

      handleSend();

    }


  }






  return (

    <div

      style={{

        display:"flex",

        gap:10,

        padding:12,

        background:"#fff",

        borderTop:
        "1px solid #ddd",

        alignItems:"center",

      }}

    >



      <button

        style={{

          border:"none",

          background:"#eee",

          borderRadius:"50%",

          width:38,

          height:38,

          cursor:"pointer",

          fontSize:18,

        }}

      >

        😊

      </button>





      <textarea

        value={text}

        disabled={disabled}

        placeholder={placeholder}

        onChange={(e)=>
          setText(e.target.value)
        }

        onKeyDown={handleKeyDown}

        rows={1}

        maxLength={500}

        style={{

          flex:1,

          resize:"none",

          padding:10,

          borderRadius:20,

          border:"1px solid #ccc",

          outline:"none",

          fontSize:15,

        }}

      />





      <button

        onClick={handleSend}

        disabled={
          disabled ||
          text.trim()===""
        }

        style={{

          width:70,

          height:40,

          border:"none",

          borderRadius:20,

          background:"#16a34a",

          color:"#fff",

          fontWeight:"bold",

          cursor:"pointer",

        }}

      >

        Send

      </button>


    </div>

  );

}

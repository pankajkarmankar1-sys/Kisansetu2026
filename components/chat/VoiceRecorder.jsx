// components/chat/VoiceRecorder.jsx

import React, {
  useRef,
  useState,
} from "react";

import { supabase } from "../../lib/supabase";


export default function VoiceRecorder({

  roomId,

  user,

  onVoiceSent,

}) {


  const [recording, setRecording] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);



  const mediaRecorderRef =
    useRef(null);

  const streamRef =
    useRef(null);

  const chunksRef =
    useRef([]);




  async function startRecording(){

    if(!user?.id){

      alert("User not found");

      return;

    }


    try{


      const stream =
        await navigator.mediaDevices
        .getUserMedia({
          audio:true,
        });



      streamRef.current = stream;


      const recorder =
        new MediaRecorder(stream);


      mediaRecorderRef.current =
        recorder;


      chunksRef.current = [];



      recorder.ondataavailable =
      (event)=>{

        if(event.data.size){

          chunksRef.current.push(
            event.data
          );

        }

      };




      recorder.onstart = ()=>{

        setRecording(true);

      };




      recorder.onstop = async()=>{


        setRecording(false);


        const blob =
          new Blob(
            chunksRef.current,
            {
              type:"audio/webm",
            }
          );



        await uploadVoice(blob);



        stream
        .getTracks()
        .forEach(
          track=>track.stop()
        );


      };



      recorder.start();



    }catch(error){

      console.error(error);

      alert(
        "Microphone permission required"
      );

    }


  }





  function stopRecording(){


    if(
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !==
      "inactive"
    ){

      mediaRecorderRef.current.stop();

    }


  }






  async function uploadVoice(blob){


    try{


      setUploading(true);



      const fileName =
      `voice/${roomId}-${Date.now()}.webm`;




      const {
        error
      } =
      await supabase.storage
      .from("voice-messages")
      .upload(
        fileName,
        blob
      );



      if(error) throw error;




      const {
        data
      } =
      supabase.storage
      .from("voice-messages")
      .getPublicUrl(
        fileName
      );



      await supabase
      .from("messages")
      .insert([

        {

          room_id:roomId,

          sender_id:user.id,

          sender_name:
          user.name || "User",

          message:"",

          audio_url:
          data.publicUrl,

          is_read:false,

        }

      ]);



      onVoiceSent?.();



    }catch(error){

      console.error(
        error
      );

      alert(
        "Voice upload failed"
      );


    }finally{

      setUploading(false);

    }

  }





  return (

    <button

      onClick={
        recording
        ? stopRecording
        : startRecording
      }

      disabled={uploading}

      style={{

        width:50,

        height:50,

        borderRadius:"50%",

        border:"none",

        background:
        recording
        ? "#dc2626"
        : "#16a34a",

        color:"#fff",

        fontSize:18,

      }}

    >

      {
        uploading
        ? "⏳"
        : recording
        ? "⏹️"
        : "🎤"
      }


    </button>

  );

}

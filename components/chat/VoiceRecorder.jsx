import React, { useRef, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function VoiceRecorder({
  roomId,
  user,
  onVoiceSent,
}) {
  const [recording, setRecording] = useState(false);
  const [uploading, setUploading] = useState(false);

  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      streamRef.current = stream;

      const recorder = new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstart = () => {
        setRecording(true);
      };

      recorder.onstop = async () => {
        setRecording(false);

        const blob = new Blob(chunksRef.current, {
          type: "audio/webm",
        });

        await uploadVoice(blob);

        if (streamRef.current) {
          streamRef.current
            .getTracks()
            .forEach((track) => track.stop());
        }
      };

      recorder.start();
    } catch (err) {
      console.error("Microphone error:", err);
      alert("Microphone permission denied.");
    }
  }
  function stopRecording() {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
  }

  async function uploadVoice(blob) {
    try {
      setUploading(true);

      const fileName = `voice-${Date.now()}.webm`;

      const { error } = await supabase.storage
        .from("voice-messages")
        .upload(fileName, blob);

      if (error) throw error;

      const { data } = supabase.storage
        .from("voice-messages")
        .getPublicUrl(fileName);

      const audioUrl = data.publicUrl;

      const { error: insertError } = await supabase
        .from("messages")
        .insert([
          {
            room_id: roomId,
            sender_id: user.id,
            sender_name: user.name || "User",
            message: "",
            audio_url: audioUrl,
            is_read: false,
            created_at: new Date().toISOString(),
          },
        ]);

      if (insertError) throw insertError;

      if (onVoiceSent) {
        onVoiceSent();
      }
    } catch (err) {
      console.error(err);
      alert("Voice upload failed.");
    } finally {
      setUploading(false);
    }
  }
  return (
    <button
      onClick={recording ? stopRecording : startRecording}
      disabled={uploading}
      style={{
        padding: "10px 14px",
        border: "none",
        borderRadius: "50%",
        background: recording ? "#d32f2f" : "#2e7d32",
        color: "#fff",
        cursor: "pointer",
        fontSize: 18,
        width: 50,
        height: 50,
      }}
      title={recording ? "Stop Recording" : "Start Recording"}
    >
      {uploading ? "⏳" : recording ? "⏹️" : "🎤"}
    </button>
  );
}

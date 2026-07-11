import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AddFarm({
  user,
  next,
  back,
  refreshKhets,
}) {
  const [loading, setLoading] = useState(false);

  const [farmName, setFarmName] = useState("");
  const [villageName, setVillageName] = useState("");
  const [address, setAddress] = useState("");

  const [stateName, setStateName] = useState("Maharashtra");
  const [district, setDistrict] = useState("");
  const [taluka, setTaluka] = useState("");

  const [acres, setAcres] = useState("");

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const [surveyNumber, setSurveyNumber] = useState("");
  const [documentFile, setDocumentFile] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toString());
        setLongitude(position.coords.longitude.toString());
      },
      (err) => {
        console.log(err);
      }
    );
  }, []);

  async function uploadDocument() {
    if (!documentFile) return null;

    const fileName =
      Date.now() + "-" + documentFile.name;

    const { error } = await supabase.storage
      .from("khet-documents")
      .upload(fileName, documentFile);

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage
      .from("khet-documents")
      .getPublicUrl(fileName);

    return publicUrl;
  }

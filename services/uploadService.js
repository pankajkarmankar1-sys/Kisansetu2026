// services/uploadService.js

import { supabase } from "../lib/supabase";


// Upload File
export async function uploadFile(
  file,
  folder = "documents"
) {

  if (!file) {

    return {
      success:false,
      message:"No file selected",
    };

  }


  const fileName =
    `${folder}/${Date.now()}-${file.name}`;



  const {
    error
  } = await supabase
    .storage
    .from("uploads")
    .upload(
      fileName,
      file
    );


  if(error) {

    throw error;

  }



  const {
    data
  } = supabase
    .storage
    .from("uploads")
    .getPublicUrl(
      fileName
    );



  return {

    success:true,

    url:
      data.publicUrl,

    name:
      file.name,

    path:
      fileName,

  };

}



// Delete File
export async function deleteFile(
  path
) {

  const {
    error
  } = await supabase
    .storage
    .from("uploads")
    .remove([
      path
    ]);


  if(error) {
    throw error;
  }


  return {
    success:true,
  };

}



// Get File URL
export async function getFile(
  path
) {

  if(!path) return null;


  const {
    data
  } = supabase
    .storage
    .from("uploads")
    .getPublicUrl(
      path
    );


  return data.publicUrl;

}

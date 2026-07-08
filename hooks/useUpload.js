id="h7p4s2"
// hooks/useUpload.js

import { useState } from "react";
import { uploadFile } from "../services/uploadService";


export default function useUpload() {

  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState(null);



  async function upload(
    file,
    folder = "documents"
  ) {

    try {

      setUploading(true);
      setError(null);


      const result =
        await uploadFile(
          file,
          folder
        );


      return result;


    } catch (err) {

      setError(
        err.message
      );

      throw err;


    } finally {

      setUploading(false);

    }

  }



  return {

    uploading,

    error,

    upload,

  };

}

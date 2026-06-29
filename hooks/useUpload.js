import { useState } from "react";

export default function useUpload() {
  const [uploading, setUploading] = useState(false);

  async function upload(file) {
    setUploading(true);

    await new Promise((r) => setTimeout(r, 500));

    setUploading(false);

    return file;
  }

  return {
    uploading,
    upload,
  };
}

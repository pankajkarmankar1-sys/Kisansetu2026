// services/uploadService.js

export async function uploadFile(file, folder = "documents") {
  console.log("Uploading File...", folder);

  if (!file) {
    return {
      success: false,
      message: "No file selected",
    };
  }

  // Future:
  // Upload to Supabase Storage

  return {
    success: true,
    url: URL.createObjectURL(file),
    name: file.name,
  };
}

export async function deleteFile(path) {
  console.log("Delete File", path);

  return {
    success: true,
  };
}

export async function getFile(path) {
  console.log("Get File", path);

  return path;
}

import React from "react";
import { useRouter } from "next/router";
import DocumentsUpload from "../components/customer/DocumentUpload";

export default function DocumentsPage() {
  const router = useRouter();

  return (
    <DocumentsUpload
      onDone={() => {
        router.replace("/dashboard");
      }}
    />
  );
}

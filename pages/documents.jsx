import { useRouter } from "next/router";
import DocumentUpload from "../components/customer/DocumentUpload";

export default function DocumentsPage() {

  const router = useRouter();


  function handleDone() {

    router.replace("/dashboard");

  }


  return (

    <DocumentUpload

      onDone={handleDone}

    />

  );

}

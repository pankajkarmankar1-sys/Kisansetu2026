import { useRouter } from "next/router";
import DocumentsUpload from "../components/customer/DocumentsUpload";


export default function DocumentsPage(){

  const router = useRouter();


  return (

    <DocumentsUpload

      onDone={()=>{

        router.replace("/dashboard");

      }}

    />

  );

}

import { useRouter } from "next/router";

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

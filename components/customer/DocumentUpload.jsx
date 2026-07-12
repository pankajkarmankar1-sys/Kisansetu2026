import React, { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function DocumentUpload({ onDone }) {

  const [aadhaarFront,setAadhaarFront] = useState(null);
  const [aadhaarBack,setAadhaarBack] = useState(null);
  const [satbara,setSatbara] = useState(null);
  const [loading,setLoading] = useState(false);


  async function uploadFile(file,type,userId){

    const path =
      `${userId}/${Date.now()}-${type}-${file.name}`;

    const {error} =
      await supabase.storage
      .from("khet-documents")
      .upload(path,file);

    if(error) throw error;

    return path;

  }



  async function submit(e){

    e.preventDefault();

    try{

      setLoading(true);


      const {
        data:{user}
      } = await supabase.auth.getUser();


      if(!user)
        throw new Error("Login required");


      if(!aadhaarFront || !aadhaarBack || !satbara){

        alert("Please upload all documents");
        return;

      }


      const front =
      await uploadFile(
        aadhaarFront,
        "aadhaar-front",
        user.id
      );


      const back =
      await uploadFile(
        aadhaarBack,
        "aadhaar-back",
        user.id
      );


      const seven =
      await uploadFile(
        satbara,
        "7-12",
        user.id
      );



      const {error} =
      await supabase
      .from("profiles")
      .update({

        aadhaar_front:front,
        aadhaar_back:back,
        satbara_7_12:seven,
        document_status:"pending"

      })
      .eq(
        "auth_user_id",
        user.id
      );


      if(error) throw error;


      alert("Documents uploaded");


      if(onDone)
        onDone();


    }
    catch(err){

      alert(err.message);

    }
    finally{

      setLoading(false);

    }

  }



return (

<div style={{
 minHeight:"100vh",
 background:"#e8f5e9",
 padding:20
}}>


<div style={{
 maxWidth:450,
 margin:"auto",
 background:"#fff",
 borderRadius:25,
 padding:25,
 boxShadow:"0 5px 20px #ccc"
}}>


<h1 style={{
 textAlign:"center",
 color:"#15803d"
}}>
📄 Farmer Documents
</h1>


<p style={{
textAlign:"center",
color:"#666"
}}>
Upload Aadhaar & 7/12 documents
</p>



<FileBox
title="🪪 Aadhaar Front"
file={aadhaarFront}
setFile={setAadhaarFront}
/>


<FileBox
title="🪪 Aadhaar Back"
file={aadhaarBack}
setFile={setAadhaarBack}
/>


<FileBox
title="📜 7/12 Satbara"
file={satbara}
setFile={setSatbara}
/>



<button

onClick={submit}

disabled={loading}

style={{
width:"100%",
marginTop:25,
padding:15,
borderRadius:15,
border:"none",
background:"#16a34a",
color:"#fff",
fontSize:18,
fontWeight:"bold"
}}

>

{loading?"Uploading...":"✅ Submit Documents"}

</button>


</div>

</div>

);


}



function FileBox({title,file,setFile}){

return (

<div style={{
background:"#f0fdf4",
padding:15,
borderRadius:15,
marginTop:15
}}>

<h3>{title}</h3>


<input

type="file"

accept="image/*,.pdf"

onChange={(e)=>
setFile(e.target.files[0])
}

/>


{
file &&
<p style={{color:"green"}}>
✅ {file.name}
</p>
}


</div>

);

}

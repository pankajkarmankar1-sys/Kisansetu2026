import React, { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function DocumentUpload({ onDone }) {

  const [aadhaarFront,setAadhaarFront] = useState(null);
  const [aadhaarBack,setAadhaarBack] = useState(null);
  const [satbara,setSatbara] = useState(null);

  const [loading,setLoading] = useState(false);


  async function uploadFile(file,userId,type){

    if(!file) return null;

    const path =
      `${userId}/${Date.now()}-${type}-${file.name}`;


    const {error} =
      await supabase.storage
      .from("khet-documents")
      .upload(path,file);


    if(error) throw error;


    return path;

  }



  async function submitDocuments(e){

    e.preventDefault();


    try{

      setLoading(true);


      const {
        data:{user}
      } =
      await supabase.auth.getUser();


      if(!user)
        throw new Error("Login required");



      const front =
      await uploadFile(
        aadhaarFront,
        user.id,
        "aadhaar-front"
      );


      const back =
      await uploadFile(
        aadhaarBack,
        user.id,
        "aadhaar-back"
      );


      const seven =
      await uploadFile(
        satbara,
        user.id,
        "7-12"
      );



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



      alert("✅ Documents Submitted");

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

<div style={page}>


<div style={card}>


<h1 style={title}>
🌱 Farmer Verification
</h1>


<p style={sub}>
Upload Aadhaar & 7/12 documents
</p>




<UploadBox
title="🪪 Aadhaar Front"
file={aadhaarFront}
setFile={setAadhaarFront}
/>



<UploadBox
title="🪪 Aadhaar Back"
file={aadhaarBack}
setFile={setAadhaarBack}
/>



<UploadBox
title="📄 7/12 Satbara"
file={satbara}
setFile={setSatbara}
/>




<button
onClick={submitDocuments}
disabled={loading}
style={button}
>

{
loading
?
"Uploading..."
:
"✅ Submit Documents"
}

</button>



</div>

</div>

);

}





function UploadBox({
title,
file,
setFile
}){

return (

<div style={box}>

<h3>{title}</h3>


<label style={upload}>

📁 Choose File


<input

type="file"

accept="image/*,.pdf"

hidden

onChange={(e)=>
setFile(
e.target.files[0]
)
}

/>


</label>



{
file &&

<p style={fileText}>
✅ {file.name}
</p>

}


</div>

);

}





const page={

minHeight:"100vh",

background:
"linear-gradient(135deg,#dcfce7,#eff6ff)",

padding:20

};



const card={

maxWidth:420,

margin:"auto",

background:"#fff",

padding:25,

borderRadius:25,

boxShadow:
"0 10px 30px rgba(0,0,0,0.12)"

};



const title={

color:"#15803d",

textAlign:"center"

};


const sub={

textAlign:"center",

color:"#555",

marginBottom:25

};



const box={

background:"#f8fafc",

borderRadius:18,

padding:15,

marginBottom:15,

border:
"1px solid #e2e8f0"

};



const upload={

display:"block",

background:"#16a34a",

color:"#fff",

padding:12,

borderRadius:12,

textAlign:"center",

cursor:"pointer"

};



const fileText={

fontSize:13,

color:"#15803d"

};



const button={

width:"100%",

padding:15,

background:"#2563eb",

color:"#fff",

border:"none",

borderRadius:15,

fontSize:16,

fontWeight:"bold"

};

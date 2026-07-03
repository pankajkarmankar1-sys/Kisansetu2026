import { useState, useRef } from "react";

export default function Reg({ phone, onDone, back }) {

  // ===============================
  // Personal Details
  // ===============================

  const [name, setName] = useState("");
  const [farm, setFarm] = useState("");
  const [mobile, setMobile] = useState(phone || "");

  // ===============================
  // Location
  // ===============================

  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [taluka, setTaluka] = useState("");
  const [village, setVillage] = useState("");

  // ===============================
  // Aadhaar
  // ===============================

  const [aadhaarFile, setAadhaarFile] = useState(null);
  const [aadhaarPreview, setAadhaarPreview] = useState("");

  const aadhaarInput = useRef(null);

  // ===============================
  // 7/12 Documents
  // ===============================

  const [documents, setDocuments] = useState([]);

  const sevenInput = useRef(null);

  // ===============================
  // Loading
  // ===============================

  const [loading, setLoading] = useState(false);

  // ===============================
  // Errors
  // ===============================

  const [errors, setErrors] = useState({});
  // ===============================
  // Aadhaar Upload
  // ===============================

  const pickAadhaar = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAadhaarFile(file);

    if (file.type.startsWith("image")) {
      setAadhaarPreview(URL.createObjectURL(file));
    } else {
      setAadhaarPreview("");
    }
  };

  // ===============================
  // 7/12 Upload
  // ===============================

  const pick712 = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    const obj = {
      id: Date.now(),
      file,
      preview: file.type.startsWith("image")
        ? URL.createObjectURL(file)
        : "",
      village: village,
      state: state,
      district: district,
      taluka: taluka
    };

    setDocuments((p) => [...p, obj]);

  };

  function remove712(id) {
    setDocuments((p) => p.filter((x) => x.id !== id));
  }

  // ===============================
  // Registration
  // ===============================

  function registerCustomer() {

    const e = {};

    if (!name) e.name = true;

    if (!farm) e.farm = true;

    if (mobile.length !== 10) e.mobile = true;

    if (!state) e.state = true;

    if (!district) e.district = true;

    if (!taluka) e.taluka = true;

    if (!village) e.village = true;

    if (!aadhaarFile) e.aadhaar = true;

    if (documents.length === 0) e.documents = true;

    setErrors(e);

    if (Object.keys(e).length) return;

    setLoading(true);

    setTimeout(() => {

      setLoading(false);

      onDone({
        name,
        farm,
        mobile,
        state,
        district,
        taluka,
        village,
        aadhaarFile,
        documents
      });

    },1500);

  }

  return (

    <div style={{
      minHeight:"100vh",
      background:"#f8fafc",
      padding:16
    }}>      <div
        style={{
          maxWidth: 520,
          margin: "0 auto",
          background: "#fff",
          borderRadius: 18,
          padding: 18,
          boxShadow: "0 8px 25px rgba(0,0,0,.08)"
        }}
      >

        <h2
          style={{
            textAlign: "center",
            marginBottom: 20,
            color: "#166534"
          }}
        >
          🚜 Customer Registration
        </h2>

        <label>👤 Full Name</label>

        <input
          value={name}
          onChange={(e)=>setName(e.target.value)}
          placeholder="Customer Name"
          style={inputStyle}
        />

        <br/><br/>

        <label>🌾 Farm Address</label>

        <textarea
          value={farm}
          onChange={(e)=>setFarm(e.target.value)}
          placeholder="Farm Address"
          style={{
            ...inputStyle,
            height:80,
            resize:"none"
          }}
        />

        <br/><br/>

        <label>📱 Mobile Number</label>

        <input
          value={mobile}
          onChange={(e)=>setMobile(e.target.value)}
          maxLength={10}
          placeholder="10 Digit Mobile"
          style={inputStyle}
        />

        <br/><br/>        <label>🌍 State</label>

        <select
          value={state}
          onChange={(e)=>{
            setState(e.target.value);
            setDistrict("");
            setTaluka("");
            setVillage("");
          }}
          style={inputStyle}
        >
          <option value="">Select State</option>
          <option value="Maharashtra">Maharashtra</option>
        </select>

        <br/><br/>

        <label>🏛 District</label>

        <select
          value={district}
          onChange={(e)=>{
            setDistrict(e.target.value);
            setTaluka("");
            setVillage("");
          }}
          style={inputStyle}
        >
          <option value="">Select District</option>

          <option value="Nagpur">Nagpur</option>
          <option value="Chandrapur">Chandrapur</option>
          <option value="Wardha">Wardha</option>
          <option value="Gadchiroli">Gadchiroli</option>
          <option value="Bhandara">Bhandara</option>
        </select>

        <br/><br/>

        <label>🏘 Taluka</label>

        <select
          value={taluka}
          onChange={(e)=>{
            setTaluka(e.target.value);
            setVillage("");
          }}
          style={inputStyle}
        >
          <option value="">Select Taluka</option>

          <option value="Warora">Warora</option>
          <option value="Chimur">Chimur</option>
          <option value="Mul">Mul</option>
          <option value="Rajura">Rajura</option>
          <option value="Ballarpur">Ballarpur</option>
        </select>

        <br/><br/>

        <label>🏡 Village</label>

        <select
          value={village}
          onChange={(e)=>setVillage(e.target.value)}
          style={inputStyle}
        >
          <option value="">Select Village</option>

          <option value="Sondo">Sondo</option>
          <option value="Sindola">Sindola</option>
          <option value="Dewada">Dewada</option>
          <option value="Bhoyar">Bhoyar</option>
          <option value="Wanoja">Wanoja</option>
        </select>

        <br/><br/>        <label style={{fontWeight:700}}>🪪 Aadhaar Card</label>

        <input
          type="file"
          accept="image/*,.pdf"
          capture="environment"
          ref={aadhaarInput}
          onChange={pickAadhaar}
          style={{display:"none"}}
        />

        <button
          onClick={()=>aadhaarInput.current.click()}
          style={greenButton}
        >
          📤 Upload Aadhaar
        </button>

        {aadhaarPreview && (

          <div
            style={{
              marginTop:15,
              border:"2px solid #2d8a4e",
              borderRadius:14,
              overflow:"hidden"
            }}
          >

            <img
              src={aadhaarPreview}
              style={{
                width:"100%",
                display:"block"
              }}
            />

          </div>

        )}

        <br/>

        <label style={{fontWeight:700}}>
          📄 7/12 Documents
        </label>

        <input
          type="file"
          accept="image/*,.pdf"
          capture="environment"
          ref={sevenInput}
          onChange={pick712}
          style={{display:"none"}}
        />

        <button
          onClick={()=>sevenInput.current.click()}
          style={greenButton}
        >
          ➕ Add Another 7/12
        </button>

        <br/><br/>        {documents.map((doc,index)=>(

          <div
            key={doc.id}
            style={{
              border:"2px solid #2d8a4e",
              borderRadius:14,
              overflow:"hidden",
              marginBottom:18,
              background:"#fff"
            }}
          >

            <div
              style={{
                background:"#2d8a4e",
                color:"#fff",
                padding:"10px",
                fontWeight:700
              }}
            >
              📄 7/12 Document #{index+1}
            </div>

            {doc.preview ? (

              <img
                src={doc.preview}
                style={{
                  width:"100%",
                  display:"block"
                }}
              />

            ) : (

              <div
                style={{
                  padding:35,
                  textAlign:"center",
                  background:"#fafafa"
                }}
              >
                📄 PDF Uploaded
              </div>

            )}

            <div
              style={{
                padding:12
              }}
            >

              <div><b>State :</b> {doc.state}</div>

              <div><b>District :</b> {doc.district}</div>

              <div><b>Taluka :</b> {doc.taluka}</div>

              <div><b>Village :</b> {doc.village}</div>

              <button

                onClick={()=>remove712(doc.id)}

                style={{
                  marginTop:12,
                  width:"100%",
                  background:"#dc2626",
                  color:"#fff",
                  border:"none",
                  padding:12,
                  borderRadius:10,
                  cursor:"pointer"
                }}

              >

                🗑 Delete 7/12

              </button>

            </div>

          </div>

        ))}        {loading && (

          <div
            style={{
              marginTop:20,
              padding:20,
              background:"#ecfdf5",
              borderRadius:12,
              textAlign:"center",
              border:"2px solid #2d8a4e"
            }}
          >

            <div
              style={{
                fontSize:40,
                marginBottom:10
              }}
            >
              ⏳
            </div>

            <h3 style={{color:"#166534"}}>
              Registration Processing...
            </h3>

            <p>Please wait...</p>

          </div>

        )}

        <button
          onClick={registerCustomer}
          style={{
            width:"100%",
            background:"#16a34a",
            color:"#fff",
            border:"none",
            padding:16,
            borderRadius:12,
            fontSize:18,
            fontWeight:"bold",
            marginTop:20,
            cursor:"pointer"
          }}
        >
          ✅ Complete Registration
        </button>

        <button
          onClick={back}
          style={{
            width:"100%",
            marginTop:12,
            background:"#e5e7eb",
            border:"none",
            padding:14,
            borderRadius:12,
            cursor:"pointer",
            fontWeight:"bold"
          }}
        >
          ← Back
        </button>

      </div>

    </div>

  );

}// ===================== STYLES =====================

const inputStyle={
  width:"100%",
  padding:"12px",
  marginTop:6,
  marginBottom:14,
  borderRadius:10,
  border:"1.5px solid #d1d5db",
  outline:"none",
  fontSize:15,
  boxSizing:"border-box"
};

const labelStyle={
  fontWeight:700,
  color:"#166534",
  fontSize:14
};

const greenBtn={
  width:"100%",
  padding:"13px",
  border:"none",
  borderRadius:10,
  background:"#16a34a",
  color:"#fff",
  fontWeight:700,
  cursor:"pointer",
  marginTop:10
};

const whiteBtn={
  width:"100%",
  padding:"13px",
  border:"2px solid #16a34a",
  borderRadius:10,
  background:"#fff",
  color:"#16a34a",
  fontWeight:700,
  cursor:"pointer",
  marginTop:10
};

const uploadBox={
  border:"2px dashed #16a34a",
  borderRadius:12,
  padding:18,
  textAlign:"center",
  background:"#f8fff8",
  marginTop:10,
  marginBottom:10
};function UploadButtons({camera,gallery,pdf}){

return(

<div
style={{
display:"grid",
gridTemplateColumns:"1fr 1fr 1fr",
gap:10,
marginTop:10
}}
>

<button style={greenBtn} onClick={camera}>
📷
<br/>
Camera
</button>

<button style={greenBtn} onClick={gallery}>
🖼️
<br/>
Gallery
</button>

<button style={greenBtn} onClick={pdf}>
📄
<br/>
PDF
</button>

</div>

);

}export default Reg;

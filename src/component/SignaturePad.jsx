"use client";

import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

export default function SignaturePad({ onSave }) {
  const sigPadRef = useRef(null);
  const [message, setMessage] = useState(""); 

  const saveSignature = () => {
    if (sigPadRef.current) {
      const signatureData = sigPadRef.current.toDataURL();
      onSave(signatureData);
      setMessage("Signature saved successfully! ✅"); 
      setTimeout(() => setMessage(""), 3000);  
    }
  };

  return (
    <div className="border p-4 mt-4">
      <SignatureCanvas 
        ref={sigPadRef} 
        canvasProps={{ className: "signature-canvas w-full h-40 border" }} 
      />

      <button
        className="mt-2 bg-green-500 px-4 py-2 rounded text-white cursor-pointer hover:bg-green-600 active:bg-green-700"
        onClick={saveSignature}
      >
        Save Signature
      </button>

      {message && <p className="mt-2 text-green-600">{message}</p>}
    </div>
  );
}

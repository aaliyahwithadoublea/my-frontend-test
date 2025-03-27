"use client";

import { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";

export default function SignaturePad({ onSave }) {
  const sigPadRef = useRef(null);

  const saveSignature = () => {
    if (sigPadRef.current) {
      const signatureData = sigPadRef.current.toDataURL();
      onSave(signatureData);
    }
  };

  return (
    <div className="border p-4 mt-4">
      <SignatureCanvas ref={sigPadRef} canvasProps={{ className: "signature-canvas w-full h-40 border" }} />
      <button className="mt-2 bg-green-500 px-4 py-2 rounded text-white" onClick={saveSignature}>
        Save Signature
      </button>
    </div>
  );
}

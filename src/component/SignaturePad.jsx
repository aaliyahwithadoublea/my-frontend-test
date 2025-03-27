"use client";

import SignatureCanvas from "react-signature-canvas";

export default function SignaturePad({ onSave }) {
  let sigCanvas = null;

  return (
    <div className="p-4">
      <SignatureCanvas
        ref={(ref) => (sigCanvas = ref)}
        penColor="black"
        canvasProps={{ width: 400, height: 200, className: "border border-gray-400" }}
      />
      <button className="bg-green-500 text-white px-4 py-2 mt-2" onClick={() => onSave(sigCanvas.toDataURL())}>
        Save Signature
      </button>
      <button className="bg-red-500 text-white px-4 py-2 mt-2 ml-2" onClick={() => sigCanvas.clear()}>
        Clear
      </button>
    </div>
  );
}

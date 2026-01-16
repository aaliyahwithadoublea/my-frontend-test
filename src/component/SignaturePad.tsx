"use client";

import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { showToast } from "./Toast";

interface SignaturePadProps {
  onSave: (signatureData: string, size: number) => void;
  defaultSize?: number;
  onSizeChange?: (size: number) => void;
}

export default function SignaturePad({ onSave, defaultSize = 150, onSizeChange }: SignaturePadProps) {
  const sigPadRef = useRef<any>(null);
  const [savedSignature, setSavedSignature] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [signatureSize, setSignatureSize] = useState<number>(defaultSize);

  const handleSizeChange = (newSize: number) => {
    setSignatureSize(newSize);
    if (onSizeChange) {
      onSizeChange(newSize);
    }
  };

  const saveSignature = () => {
    if (sigPadRef.current && !sigPadRef.current.isEmpty()) {
      // Get the canvas element
      const canvas = sigPadRef.current.getCanvas();
      
      // Get image data from canvas
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Process image data to make white pixels transparent
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        // If pixel is white or near-white, make it transparent
        if (r > 250 && g > 250 && b > 250) {
          data[i + 3] = 0; // Set alpha to 0 (transparent)
        }
      }
      
      // Create a new canvas with transparent background
      const transparentCanvas = document.createElement('canvas');
      transparentCanvas.width = canvas.width;
      transparentCanvas.height = canvas.height;
      const newCtx = transparentCanvas.getContext('2d');
      
      if (newCtx) {
        // Put the processed image data (with transparent white pixels)
        newCtx.putImageData(imageData, 0, 0);
        
        // Save as PNG with transparency
        const signatureData = transparentCanvas.toDataURL('image/png');
        setSavedSignature(signatureData);
        onSave(signatureData, signatureSize);
        setMessage("Signature saved! Click on the PDF to place it.");
        setTimeout(() => setMessage(""), 3000);
      }
    } else {
      showToast("Please draw a signature first!", "warning");
      setMessage("Please draw a signature first!");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const clearSignature = () => {
    if (sigPadRef.current) {
      sigPadRef.current.clear();
      setSavedSignature(null);
      setMessage("");
    }
  };

  return (
    <div className="glass-effect rounded-xl p-6 mt-4 shadow-lg backdrop-blur-sm border border-white/50">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-md">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Signature Pad
        </h3>
      </div>
      <div className="border-2 border-gray-200 rounded-xl bg-white shadow-inner overflow-hidden hover:border-purple-300 transition-colors">
        <SignatureCanvas
          ref={sigPadRef}
          canvasProps={{
            className: "signature-canvas w-full h-44",
          }}
          backgroundColor="rgba(255, 255, 255, 0)"
        />
      </div>
      {/* Size Control */}
      <div className="mt-5 p-4 bg-white/60 rounded-xl border border-gray-200 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Signature Size: <span className="text-purple-600">{signatureSize}px</span>
        </label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="80"
            max="300"
            value={signatureSize}
            onChange={(e) => handleSizeChange(Number(e.target.value))}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #9333ea 0%, #9333ea ${((signatureSize - 80) / (300 - 80)) * 100}%, #e5e7eb ${((signatureSize - 80) / (300 - 80)) * 100}%, #e5e7eb 100%)`
            }}
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleSizeChange(Math.max(80, signatureSize - 10))}
              className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 font-semibold transition-colors"
            >
              -
            </button>
            <button
              type="button"
              onClick={() => handleSizeChange(Math.min(300, signatureSize + 10))}
              className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 font-semibold transition-colors"
            >
              +
            </button>
          </div>
        </div>
      </div>
      <div className="flex gap-3 mt-5">
        <button
          className="px-7 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl cursor-pointer hover:from-green-600 hover:to-emerald-700 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
          onClick={saveSignature}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Save Signature
        </button>
        <button
          className="px-7 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-bold rounded-xl cursor-pointer hover:from-gray-600 hover:to-gray-700 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
          onClick={clearSignature}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Clear
        </button>
      </div>
      {message && (
        <div className={`mt-4 p-3 rounded-lg ${
          message.includes("saved") 
            ? "bg-green-50 border-2 border-green-200" 
            : "bg-red-50 border-2 border-red-200"
        }`}>
          <p className={`text-sm font-semibold flex items-center gap-2 ${
            message.includes("saved") ? "text-green-700" : "text-red-700"
          }`}>
            {message.includes("saved") ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
            {message}
          </p>
        </div>
      )}
      {savedSignature && (
        <div className="mt-5 p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border-2 border-purple-200 shadow-md">
          <p className="text-sm font-bold text-purple-700 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
            Saved Signature:
          </p>
          <div className="relative inline-block p-2 bg-white rounded-xl border-2 border-purple-200 shadow-lg">
            <img
              src={savedSignature}
              alt="Saved Signature"
              className="w-44 h-auto"
              style={{
                background: 'transparent',
                mixBlendMode: 'multiply',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

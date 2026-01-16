"use client";

import { useState, useRef } from "react";
import FileUploader from "../component/FileUploader";
import PdfViewer from "../component/PdfViewer";
import AnnotationToolbar from "../component/AnnotationToolbar";
import SignaturePad from "../component/SignaturePad";
import ExportButton from "../component/ExportButton";
import { showToast } from "../component/Toast";

interface Annotation {
  text: string;
  type?: string;
  color?: string;
  position?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

interface SignaturePosition {
  x: number;
  y: number;
  image: string;
  size?: number;
}

export default function HomePage() {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [selectedText, setSelectedText] = useState("");
  const [selectedTextPosition, setSelectedTextPosition] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [signatureSize, setSignatureSize] = useState<number>(150); // Default size in pixels
  const [signaturePositions, setSignaturePositions] = useState<SignaturePosition[]>([]);

  // Function to handle text selection from PDF viewer
  const handleTextSelection = (text: string, position: { x: number; y: number; width: number; height: number }) => {
    setSelectedText(text);
    setSelectedTextPosition(position);
  };

  // Function to add an annotation
  const addAnnotation = (type: string, color: string) => {
    if (!selectedText.trim() || !selectedTextPosition) {
      showToast("Please select text in the PDF before applying an annotation.", "warning");
      return;
    }

    setAnnotations([
      ...annotations,
      { type, color, text: selectedText, position: selectedTextPosition },
    ]);
    setSelectedText("");
    setSelectedTextPosition(null);
    
    // Clear the selection
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
    }
  };

  // Function to handle saved signature
  const handleSignatureSave = (signatureData: string, size: number) => {
    if (!signatureData) {
      showToast("No signature detected! Please draw a signature first.", "error");
      return;
    }
    setSignature(signatureData);
    setSignatureSize(size);
    showToast("Signature saved! Click anywhere on the PDF to place it.", "success");
  };

  // Function to place signature on PDF (called from PdfViewer)
  const handleSignatureClick = (x: number, y: number) => {
    if (!signature) return;

    setSignaturePositions([
      ...signaturePositions,
      { x, y, image: signature, size: signatureSize },
    ]);
  };

  const handleNewFile = () => {
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl);
    }
    setFileUrl(null);
    setAnnotations([]);
    setSelectedText("");
    setSignature(null);
    setSignaturePositions([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-block mb-4">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25"></div>
            <h1 className="relative text-5xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 tracking-tight">
              PDF Annotation Tool
            </h1>
          </div>
          <p className="text-gray-600 text-lg font-medium">
            Upload, annotate, sign, and export your PDF documents with ease
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <span className="inline-block w-2 h-2 bg-purple-500 rounded-full"></span>
            <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full"></span>
            <span className="inline-block w-2 h-2 bg-pink-500 rounded-full"></span>
          </div>
        </div>

        {!fileUrl ? (
          <FileUploader onFileUpload={setFileUrl} />
        ) : (
          <div className="space-y-6 animate-fade-in">
            {/* Control Bar */}
            <div className="flex items-center justify-between glass-effect p-5 rounded-xl shadow-lg backdrop-blur-sm">
              <button
                onClick={handleNewFile}
                className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
              >
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Upload New PDF
                </span>
              </button>
              <div className="flex items-center gap-4 text-sm font-medium">
                <div className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg shadow-sm">
                  <span className="font-semibold">{annotations.length}</span> annotation{annotations.length !== 1 ? "s" : ""}
                </div>
                <div className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg shadow-sm">
                  <span className="font-semibold">{signaturePositions.length}</span> signature{signaturePositions.length !== 1 ? "s" : ""}
                </div>
              </div>
            </div>

            {/* Annotation Toolbar */}
            <AnnotationToolbar
              onHighlight={(color) => addAnnotation("highlight", color)}
              onUnderline={(color) => addAnnotation("underline", color)}
            />

            {/* PDF Viewer */}
            <div className="relative">
              <PdfViewer
                fileUrl={fileUrl}
                setSelectedText={setSelectedText}
                setAnnotations={setAnnotations}
                signaturePositions={signaturePositions}
                annotations={annotations}
                onTextSelection={handleTextSelection}
                onSignatureClick={handleSignatureClick}
              />
            </div>

            {/* Signature Pad */}
            <SignaturePad onSave={handleSignatureSave} defaultSize={signatureSize} onSizeChange={setSignatureSize} />

            {/* Export Button */}
            <div className="flex justify-center">
              <ExportButton
                fileUrl={fileUrl}
                annotations={annotations}
                signatures={signaturePositions}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

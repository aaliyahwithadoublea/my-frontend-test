"use client";

import { useState, useRef } from "react";
import FileUploader from "../component/FileUploader";
import PdfViewer from "../component/PdfViewer";
import AnnotationToolbar from "../component/AnnotationToolbar";
import SignaturePad from "../component/SignaturePad";
import ExportButton from "../component/ExportButton";

export default function HomePage() {
  const [fileUrl, setFileUrl] = useState(null);
  const [annotations, setAnnotations] = useState([]);
  const [selectedText, setSelectedText] = useState("");
  const [signature, setSignature] = useState(null);
  const [signaturePositions, setSignaturePositions] = useState([]);
  const pdfViewerRef = useRef(null);

  // Function to add an annotation
  const addAnnotation = (type, color) => {
    if (!selectedText) {
      alert("Please select text before applying an annotation.");
      return;
    }
    setAnnotations([...annotations, { type, color, text: selectedText }]);
    setSelectedText(""); 
  };

  // Function to handle saved signature
  const handleSignatureSave = (signatureData) => {
    if (!signatureData) {
      alert("No signature detected!");
      return;
    }
    setSignature(signatureData);
    alert("Signature saved! Click on the PDF to place it.");
  };

  // Function to place signature on PDF
  const handlePdfClick = (event) => {
    if (!signature) return;

    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setSignaturePositions([...signaturePositions, { x, y, image: signature }]);
  };

  return (
    <div className="mt-4">
      {!fileUrl ? (
        <FileUploader onFileUpload={setFileUrl} />
      ) : (
        <>
          <AnnotationToolbar 
            onHighlight={(color) => addAnnotation("highlight", color)}
            onUnderline={(color) => addAnnotation("underline", color)}
          />
          <div onClick={handlePdfClick} className="relative">
            <PdfViewer 
              fileUrl={fileUrl} 
              setSelectedText={setSelectedText} 
              setAnnotations={setAnnotations} 
              signaturePositions={signaturePositions} 
            />
            {/* Display the signatures */}
            {signaturePositions.map((sig, index) => (
              <img 
                key={index} 
                src={sig.image} 
                alt="Signature" 
                className="absolute w-20 h-auto"
                style={{ top: sig.y, left: sig.x }}
              />
            ))}
          </div>
          <SignaturePad onSave={handleSignatureSave} />
          <ExportButton 
            fileUrl={fileUrl} 
            annotations={annotations} 
            signatures={signaturePositions} 
          />
        </>
      )}
    </div>
  );
}

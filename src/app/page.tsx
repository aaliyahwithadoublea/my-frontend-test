"use client";

import { useState } from "react";
import FileUploader from "../component/FileUploader";
import PdfViewer from "../component/PdfViewer";
import AnnotationToolbar from "../component/AnnotationToolbar";
import SignaturePad from "../component/SignaturePad";
import ExportButton from "../component/ExportButton";

export default function HomePage() {
  const [fileUrl, setFileUrl] = useState(null);
  const [annotations, setAnnotations] = useState([]);
  const [signature, setSignature] = useState(null);

  return (
    <div className="mt-4">
      {!fileUrl ? (
        <FileUploader onFileUpload={setFileUrl} />
      ) : (
        <>
          <AnnotationToolbar 
            onHighlight={(color) => setAnnotations([...annotations, { type: "highlight", color }])}
            onUnderline={(color) => setAnnotations([...annotations, { type: "underline", color }])}
          />
          <PdfViewer fileUrl={fileUrl} annotations={annotations} />
          <SignaturePad onSave={setSignature} />
          <ExportButton fileUrl={fileUrl} annotations={annotations} signature={signature} />
        </>
      )}
    </div>
  );
}
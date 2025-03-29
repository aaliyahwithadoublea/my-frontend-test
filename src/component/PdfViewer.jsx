"use client";

import { useState } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

const pdfWorkerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export default function PdfViewer({ fileUrl, setSelectedText, setAnnotations }) {
  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const text = selection.toString();
    const boundingBox = range.getBoundingClientRect(); // Get selection position

    console.log("Selected text:", text, "Bounding box:", boundingBox);

    if (text) {
      setSelectedText(text);
      setAnnotations((prev) => [
        ...prev,
        {
          text,
          position: {
            x: boundingBox.x,
            y: boundingBox.y,
            width: boundingBox.width,
            height: boundingBox.height,
          },
        },
      ]);
    }
  };

  return (
    <div className="border p-4 mt-4" onMouseUp={handleTextSelection}>
      <Worker workerUrl={pdfWorkerSrc}>
        <Viewer fileUrl={fileUrl} />
      </Worker>
    </div>
  );
}

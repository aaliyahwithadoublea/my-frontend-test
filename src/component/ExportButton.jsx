"use client";

import { useState } from "react";
import { PDFDocument, rgb } from "pdf-lib";

export default function ExportButton({ fileUrl, annotations }) {
  const [loading, setLoading] = useState(false);

  const exportPdf = async () => {
    setLoading(true);
    try {
      const existingPdfBytes = await fetch(fileUrl).then((res) => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];

      annotations.forEach(({ type, color, text, position }) => {
        if (!position) return;
      
        const { x, y, width, height } = position;
        const pdfHeight = firstPage.getHeight();
      
        console.log("Applying annotation:", { x, y, width, height });
      
        if (type === "highlight") {
          firstPage.drawRectangle({
            x,
            y: pdfHeight - y - height, 
            width,
            height,
            color: rgb(1, 1, 0, 0.3),
          });
        } else if (type === "underline") {
          firstPage.drawLine({
            start: { x, y: pdfHeight - y - 2 },
            end: { x: x + width, y: pdfHeight - y - 2 },
            thickness: 1,
            color: rgb(1, 0, 0), 
          });
        }
      });
      

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "annotated-document.pdf";
      a.click();
    } catch (error) {
      console.error("Error exporting PDF:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={exportPdf}
      disabled={loading}
      className={`mt-4 px-6 py-3 font-semibold text-white rounded-lg shadow-md transition-all duration-300 ${
        loading ? "bg-gray-500 cursor-not-allowed" : "bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
      }`}
    >
      {loading ? "Exporting..." : "Export PDF"}
    </button>
  );
}

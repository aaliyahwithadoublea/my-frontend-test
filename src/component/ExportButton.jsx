"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";

export default function ExportButton({ fileUrl, annotations, signature }) {
  const [loading, setLoading] = useState(false);

  const exportPdf = async () => {
    setLoading(true);
    try {
      const existingPdfBytes = await fetch(fileUrl).then((res) => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];

      // Add annotations
      annotations.forEach(({ type, color }) => {
        firstPage.drawRectangle({
          x: 50,
          y: 500,
          width: 100,
          height: 20,
          color: color,
        });
      });

      // Add signature
      if (signature) {
        const signatureImage = await pdfDoc.embedPng(signature);
        firstPage.drawImage(signatureImage, { x: 100, y: 450, width: 100, height: 50 });
      }

      // Save the PDF
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

"use client";

import { PDFDocument } from "pdf-lib";

export default async function ExportButton({ fileUrl, annotations, signature }) {
  const exportPdf = async () => {
    const existingPdfBytes = await fetch(fileUrl).then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    annotations.forEach(annotation => {
      firstPage.drawText(annotation.text, { x: annotation.x, y: annotation.y, color: annotation.color });
    });

    if (signature) {
      const sigImage = await pdfDoc.embedPng(signature);
      firstPage.drawImage(sigImage, { x: 100, y: 100, width: 200, height: 100 });
    }

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "annotated.pdf";
    link.click();
  };

  return <button className="bg-blue-500 text-white px-4 py-2" onClick={exportPdf}>Export PDF</button>;
}

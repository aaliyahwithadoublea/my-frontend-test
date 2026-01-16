"use client";

import { useState } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import { showToast } from "./Toast";

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
}

interface ExportButtonProps {
  fileUrl: string;
  annotations: Annotation[];
  signatures: SignaturePosition[];
}

export default function ExportButton({
  fileUrl,
  annotations,
  signatures,
}: ExportButtonProps) {
  const [loading, setLoading] = useState(false);

  const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16) / 255,
          g: parseInt(result[2], 16) / 255,
          b: parseInt(result[3], 16) / 255,
        }
      : { r: 1, g: 0.84, b: 0 }; // Default yellow
  };

  const exportPdf = async () => {
    setLoading(true);
    try {
      const existingPdfBytes = await fetch(fileUrl).then((res) =>
        res.arrayBuffer()
      );
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const pageHeight = firstPage.getHeight();
      const pageWidth = firstPage.getWidth();

      // Get the PDF viewer container to calculate dimensions
      const pdfViewerContainer = document.querySelector('[data-pdf-viewer-container]') as HTMLElement;
      const containerPadding = 24; // p-6 = 24px padding on each side
      
      // Get actual rendered PDF dimensions
      let viewerWidth = pageWidth; // Default to PDF dimensions
      let viewerHeight = pageHeight;
      let offsetX = 0;
      let offsetY = 0;
      
      if (pdfViewerContainer) {
        const containerRect = pdfViewerContainer.getBoundingClientRect();
        const containerWidth = containerRect.width - (containerPadding * 2);
        const containerHeight = containerRect.height - (containerPadding * 2);
        
        // Try to find the actual PDF canvas element
        let pdfCanvas: HTMLCanvasElement | null = null;
        
        // Look for canvas directly
        pdfCanvas = pdfViewerContainer.querySelector('canvas') as HTMLCanvasElement;
        
        // If not found, look for iframe
        if (!pdfCanvas) {
          const pdfIframe = pdfViewerContainer.querySelector('iframe') as HTMLIFrameElement;
          if (pdfIframe && pdfIframe.contentWindow) {
            try {
              const iframeDoc = pdfIframe.contentDocument || pdfIframe.contentWindow.document;
              pdfCanvas = iframeDoc?.querySelector('canvas') as HTMLCanvasElement;
            } catch (e) {
              console.log("Could not access iframe content");
            }
          }
        }
        
        if (pdfCanvas) {
          // Get actual canvas dimensions
          const canvasRect = pdfCanvas.getBoundingClientRect();
          const containerInnerRect = pdfViewerContainer.getBoundingClientRect();
          
          // Calculate the actual rendered area
          viewerWidth = canvasRect.width || pdfCanvas.width || containerWidth;
          viewerHeight = canvasRect.height || pdfCanvas.height || containerHeight;
          
          // Calculate offset (where the canvas starts relative to container)
          offsetX = canvasRect.left - containerInnerRect.left - containerPadding;
          offsetY = canvasRect.top - containerInnerRect.top - containerPadding;
        } else {
          // Fallback: use container dimensions
          viewerWidth = containerWidth;
          viewerHeight = containerHeight;
        }
        
        // Calculate aspect ratios to maintain PDF proportions
        const pdfAspect = pageWidth / pageHeight;
        const containerAspect = viewerWidth / viewerHeight;
        
        // If container is wider than PDF, center horizontally
        if (containerAspect > pdfAspect) {
          const scaledHeight = viewerWidth / pdfAspect;
          offsetY = (viewerHeight - scaledHeight) / 2;
          viewerHeight = scaledHeight;
        } else {
          // If container is taller than PDF, center vertically
          const scaledWidth = viewerHeight * pdfAspect;
          offsetX = (viewerWidth - scaledWidth) / 2;
          viewerWidth = scaledWidth;
        }
      }

      // Calculate scale factors
      if (viewerWidth === 0) viewerWidth = pageWidth;
      if (viewerHeight === 0) viewerHeight = pageHeight;
      
      const scaleX = pageWidth / viewerWidth;
      const scaleY = pageHeight / viewerHeight;

      // Add annotations
      annotations.forEach((annotation) => {
        if (!annotation.position || !annotation.type) return;

        const { x, y, width, height } = annotation.position;
        const color = annotation.color || "#FFD700";
        const rgbColor = hexToRgb(color);

        // Account for container padding and offsets
        const adjustedX = Math.max(0, x - containerPadding - offsetX);
        const adjustedY = Math.max(0, y - containerPadding - offsetY);

        // Convert screen coordinates to PDF coordinates
        const pdfX = adjustedX * scaleX;
        const pdfY = pageHeight - (adjustedY * scaleY); // PDF Y is bottom-up
        
        // Convert dimensions
        const pdfWidth = width * scaleX;
        const pdfHeight = height * scaleY;

        if (annotation.type === "highlight") {
          firstPage.drawRectangle({
            x: pdfX,
            y: pdfY - pdfHeight,
            width: pdfWidth,
            height: pdfHeight,
            color: rgb(rgbColor.r, rgbColor.g, rgbColor.b),
            opacity: 0.3,
          });
        } else if (annotation.type === "underline") {
          // Position underline BELOW the text (subtract from Y in PDF coordinates)
          // The underline should be at the bottom edge of the text, so use pdfY - pdfHeight as base
          // and position it slightly below that
          const underlineY = pdfY - pdfHeight - 2; // 2 points below the bottom of the text
          
          firstPage.drawLine({
            start: { x: pdfX, y: underlineY },
            end: {
              x: pdfX + pdfWidth,
              y: underlineY,
            },
            thickness: 2,
            color: rgb(rgbColor.r, rgbColor.g, rgbColor.b),
          });
        }
      });

      // Add signatures
      for (const sig of signatures) {
        try {
          // Fetch the image data URL
          const imageResponse = await fetch(sig.image);
          const imageBytes = await imageResponse.arrayBuffer();
          
          // Try to detect image type from data URL
          let image;
          const isPng = sig.image.startsWith('data:image/png') || sig.image.includes('png');
          const isJpg = sig.image.startsWith('data:image/jpeg') || sig.image.startsWith('data:image/jpg');
          
          try {
            if (isPng) {
              image = await pdfDoc.embedPng(imageBytes);
            } else if (isJpg) {
              image = await pdfDoc.embedJpg(imageBytes);
            } else {
              // Default to PNG
              image = await pdfDoc.embedPng(imageBytes);
            }
          } catch (embedError) {
            // If PNG fails, try JPG
            try {
              image = await pdfDoc.embedJpg(imageBytes);
            } catch {
              console.error("Unable to embed signature image:", embedError);
              continue;
            }
          }
          
          // Use the signature size if provided (in screen pixels)
          const sigSize = sig.size || 150;
          const sigSizeInPoints = sigSize * scaleX; // Convert screen pixels to PDF points
          
          // Scale image to desired size while maintaining aspect ratio
          const aspectRatio = image.width / image.height;
          let imageWidth = sigSizeInPoints;
          let imageHeight = sigSizeInPoints / aspectRatio;
          
          // Ensure reasonable size limits
          if (imageWidth > pageWidth) {
            imageWidth = pageWidth * 0.5;
            imageHeight = imageWidth / aspectRatio;
          }

          // Account for container padding and offsets
          const adjustedX = Math.max(0, sig.x - containerPadding - offsetX);
          const adjustedY = Math.max(0, sig.y - containerPadding - offsetY);

          // Convert screen coordinates to PDF coordinates
          const pdfX = adjustedX * scaleX;
          const pdfY = pageHeight - (adjustedY * scaleY) - imageHeight; // PDF Y is bottom-up

          // Only draw if coordinates are valid
          if (pdfX >= 0 && pdfY >= 0 && pdfX + imageWidth <= pageWidth && pdfY + imageHeight <= pageHeight) {
            firstPage.drawImage(image, {
              x: pdfX,
              y: pdfY,
              width: imageWidth,
              height: imageHeight,
            });
            console.log(`Signature placed at PDF coordinates: (${pdfX}, ${pdfY}), size: ${imageWidth}x${imageHeight}`);
          } else {
            console.warn(`Signature coordinates out of bounds: (${pdfX}, ${pdfY})`);
          }
        } catch (error) {
          console.error("Error adding signature:", error);
          showToast(`Error adding signature: ${error instanceof Error ? error.message : 'Unknown error'}`, "error");
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "annotated-document.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showToast("PDF exported successfully!", "success");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      showToast("Failed to export PDF. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={exportPdf}
      disabled={loading}
      className={`mt-6 px-10 py-4 font-extrabold text-white rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 ${
        loading
          ? "bg-gray-500 cursor-not-allowed"
          : "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700"
      }`}
    >
      {loading ? (
        <span className="flex items-center gap-3">
          <svg
            className="animate-spin h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span className="text-lg">Exporting...</span>
        </span>
      ) : (
        <span className="flex items-center gap-3 text-lg">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export Annotated PDF
        </span>
      )}
    </button>
  );
}

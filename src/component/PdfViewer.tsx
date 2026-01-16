"use client";

import { useEffect, useRef } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

const pdfWorkerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

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

interface PdfViewerProps {
  fileUrl: string;
  setSelectedText: (text: string) => void;
  setAnnotations: React.Dispatch<React.SetStateAction<Annotation[]>>;
  signaturePositions: Array<{ x: number; y: number; image: string; size?: number }>;
  annotations?: Annotation[];
  onTextSelection?: (text: string, position: { x: number; y: number; width: number; height: number }) => void;
  onSignatureClick?: (x: number, y: number) => void;
}

export default function PdfViewer({
  fileUrl,
  setSelectedText,
  setAnnotations,
  signaturePositions,
  annotations = [],
  onTextSelection,
  onSignatureClick,
}: PdfViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount || !containerRef.current) return;

    const range = selection.getRangeAt(0);
    const text = selection.toString().trim();

    if (text) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const rangeRect = range.getBoundingClientRect();
      
      // Calculate position relative to the PDF viewer container
      const position = {
        x: rangeRect.left - containerRect.left + containerRef.current.scrollLeft,
        y: rangeRect.top - containerRect.top + containerRef.current.scrollTop,
        width: rangeRect.width,
        height: rangeRect.height,
      };

      setSelectedText(text);
      
      // Pass position to parent for annotation creation
      if (onTextSelection) {
        onTextSelection(text, position);
      }
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // Only handle clicks if signature placement is active (onSignatureClick is provided)
    if (!onSignatureClick) return;
    
    // Don't place signature if user is selecting text
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      return;
    }
    
    // Check if clicking on a button or link
    const target = event.target as HTMLElement;
    if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a')) {
      return;
    }
    
    if (!containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const x = event.clientX - containerRect.left + containerRef.current.scrollLeft;
    const y = event.clientY - containerRect.top + containerRef.current.scrollTop;
    
    // Call the click handler to place signature
    onSignatureClick(x, y);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("mouseup", handleTextSelection);
      return () => {
        container.removeEventListener("mouseup", handleTextSelection);
      };
    }
  }, [onTextSelection]);

  const hexToRgba = (hex: string, alpha: number = 0.3) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return `rgba(255, 215, 0, ${alpha})`;
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <div
      ref={containerRef}
      data-pdf-viewer-container
      onClick={handleClick}
      className="relative border-2 border-gray-200 rounded-xl p-6 bg-white shadow-xl overflow-auto max-h-[75vh] hover:border-purple-300 transition-colors"
      style={{ position: "relative" }}
    >
      <Worker workerUrl={pdfWorkerSrc}>
        <Viewer fileUrl={fileUrl} />
      </Worker>
      
      {/* Render annotations as overlays */}
      {annotations.map((annotation, index) => {
        if (!annotation.position) return null;
        const { x, y, width, height } = annotation.position;
        const color = annotation.color || "#FFD700";
        
        return (
          <div
            key={index}
            className="absolute pointer-events-none"
            style={{
              left: `${x}px`,
              top: `${y}px`,
              width: `${width}px`,
              height: `${height}px`,
              backgroundColor: annotation.type === "highlight" ? hexToRgba(color, 0.3) : "transparent",
              borderBottom: annotation.type === "underline" ? `2px solid ${color}` : "none",
              zIndex: 5,
            }}
          />
        );
      })}

      {/* Render signature overlays */}
      {signaturePositions.map((sig, index) => {
        const size = sig.size || 150; // Default size if not specified
        return (
          <div
            key={`sig-${index}`}
            className="absolute pointer-events-none"
            style={{
              left: `${sig.x}px`,
              top: `${sig.y}px`,
              zIndex: 10,
            }}
          >
            <img
              src={sig.image}
              alt="Signature"
              className="h-auto"
              style={{
                width: `${size}px`,
                height: 'auto',
                background: 'transparent',
                mixBlendMode: 'multiply',
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

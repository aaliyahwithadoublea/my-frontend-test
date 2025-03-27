"use client";

import { Viewer, Worker } from "@react-pdf-viewer/core";
import { highlightPlugin } from "@react-pdf-viewer/highlight";
import { toolbarPlugin } from "@react-pdf-viewer/toolbar";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/highlight/lib/styles/index.css";
import "@react-pdf-viewer/toolbar/lib/styles/index.css";

export default function PdfViewer({ fileUrl }) {
  const highlightPluginInstance = highlightPlugin();
  const toolbarPluginInstance = toolbarPlugin();

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="p-2 bg-gray-200">{toolbarPluginInstance.renderDefaultToolbar()}</div>
      <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js`}>
        <Viewer fileUrl={fileUrl} plugins={[highlightPluginInstance, toolbarPluginInstance]} />
      </Worker>
    </div>
  );
}

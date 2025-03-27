"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function FileUploader({ onFileUpload }) {
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onload = () => onFileUpload(reader.result);
      reader.readAsDataURL(file);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "application/pdf",
    onDrop
  });

  return (
    <div {...getRootProps()} className="border-dashed border-2 p-6 rounded-md text-center cursor-pointer bg-gray-100">
      <input {...getInputProps()} />
      <p>Drag & drop a PDF here, or click to select one</p>
    </div>
  );
}

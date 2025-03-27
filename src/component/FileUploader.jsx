"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function FileUploader({ onFileUpload }) {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const fileUrl = URL.createObjectURL(file);
      onFileUpload(fileUrl);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "application/pdf",
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`p-20 border border-dashed text-center cursor-pointer transition ${
        isDragActive ? "border-blue-500 bg-blue-100" : "border-gray-400 bg-gray-100"
      }`}
    >
      <input {...getInputProps()} className="hidden" />
      {isDragActive ? (
        <p className="text-blue-600 font-semibold">Drop the file here...</p>
      ) : (
        <label className="cursor-pointer text-blue-500">
          Drag & drop a PDF here, or <span className="font-semibold">click to upload</span>
        </label>
      )}
    </div>
  );
}

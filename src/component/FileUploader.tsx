"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface FileUploaderProps {
  onFileUpload: (fileUrl: string) => void;
}

export default function FileUploader({ onFileUpload }: FileUploaderProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const fileUrl = URL.createObjectURL(file);
        onFileUpload(fileUrl);
      }
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    multiple: false,
  });

  return (
    <div className="flex items-center justify-center min-h-[500px] animate-fade-in">
      <div
        {...getRootProps()}
        className={`relative w-full max-w-3xl p-20 border-2 border-dashed rounded-3xl text-center cursor-pointer transition-all duration-300 backdrop-blur-sm ${
          isDragActive
            ? "border-purple-500 bg-gradient-to-br from-purple-50 to-indigo-50 shadow-2xl scale-[1.02] ring-4 ring-purple-200"
            : "border-gray-300 bg-white/80 hover:border-purple-400 hover:shadow-xl hover:bg-white/90 shadow-lg"
        }`}
      >
        <input {...getInputProps()} className="hidden" />
        <div className="flex flex-col items-center space-y-6">
          <div className={`relative ${isDragActive ? "animate-pulse-slow" : ""}`}>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full blur-xl opacity-30"></div>
            <svg
              className="relative w-24 h-24 text-purple-600 transform transition-transform duration-300 hover:scale-110"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          {isDragActive ? (
            <div className="space-y-2">
              <p className="text-purple-700 font-bold text-xl animate-pulse-slow">
                Drop the PDF here...
              </p>
              <p className="text-gray-500 text-sm">Release to upload</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-gray-800 text-xl font-semibold">
                Drag & drop a PDF here
              </p>
              <p className="text-gray-500 text-base">
                or{" "}
                <span className="text-purple-600 font-bold hover:text-purple-700 transition-colors underline decoration-2 underline-offset-2">
                  click to browse
                </span>
              </p>
              <p className="text-gray-400 text-sm mt-4">
                Supported format: PDF
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

export default function FileUploader({ onFileUpload }) {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      onFileUpload(fileUrl);
    }
  };

  return (
    <div className="p-20 border border-dashed border-gray-400 text-center">
      <input type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" id="file-upload" />
      <label htmlFor="file-upload" className="cursor-pointer text-blue-500 text-lg" >
        Click to upload a PDF
      </label>
    </div>
  );
}

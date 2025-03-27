import "./styles/globals.css"; 

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="p-6">
        <div className="max-w-4xl mx-auto bg-white shadow-md p-4 rounded-md">
          <h1 className="text-2xl font-bold text-center">Document Signer & Annotation Tool</h1>
          {children}
        </div>
      </body>
    </html>
  );
}

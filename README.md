# PDF Annotation Tool

A modern, feature-rich PDF annotation web application built with Next.js and React. Upload PDF documents, annotate with highlights and underlines, add signatures, and export annotated PDFs with all your changes.

![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0.17-38bdf8?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 📄 PDF Management
- **Drag & Drop Upload** - Easily upload PDF files with an intuitive drag-and-drop interface
- **PDF Viewer** - Clean, responsive PDF viewing experience
- **Export Annotated PDFs** - Download PDFs with all annotations and signatures embedded

### 🎨 Annotation Tools
- **Text Highlighting** - Highlight selected text with customizable colors
- **Underlining** - Underline important text with your chosen color
- **Real-time Preview** - See annotations instantly on the PDF viewer
- **Color Picker** - Choose any color for your annotations

### ✍️ Signature Feature
- **Signature Pad** - Draw signatures with mouse or touch
- **Resizable Signatures** - Adjust signature size from 80px to 300px
- **Transparent Background** - Signatures save with transparent backgrounds
- **Click to Place** - Click anywhere on the PDF to place your signature
- **Multiple Signatures** - Place multiple signatures at different locations

### 🎯 User Experience
- **Toast Notifications** - Beautiful toast notifications for success, error, and info messages
- **Modern UI Design** - Sleek gradient design with glass morphism effects
- **Responsive Layout** - Works seamlessly on desktop and tablet devices
- **Smooth Animations** - Polished animations and transitions throughout

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/aaliyahwithadoublea/my-frontend-test.git
cd my-frontend-test
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## 📖 Usage

### Annotating Text

1. **Upload a PDF** - Drag and drop a PDF file or click to browse
2. **Select Text** - Click and drag to select text in the PDF
3. **Apply Annotation** - Click "Highlight" or "Underline" button
4. **Choose Color** - Use the color picker to customize annotation color
5. **Export** - Click "Export Annotated PDF" to download with annotations

### Adding Signatures

1. **Draw Signature** - Use the signature pad to draw your signature
2. **Adjust Size** - Use the slider or +/- buttons to set signature size
3. **Save Signature** - Click "Save Signature" button
4. **Place on PDF** - Click anywhere on the PDF to place the signature
5. **Export** - Signatures will be included in the exported PDF

## 🛠️ Technologies Used

- **Next.js 15.2.4** - React framework for production
- **React 19** - UI library
- **TypeScript 5** - Type-safe JavaScript
- **Tailwind CSS 4.0.17** - Utility-first CSS framework
- **PDF.js** - PDF rendering engine
- **pdf-lib** - PDF manipulation library
- **@react-pdf-viewer/core** - PDF viewer component
- **react-signature-canvas** - Signature drawing component
- **react-dropzone** - File upload component

## 📁 Project Structure

```
my-frontend-test/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Main page component
│   │   └── styles/
│   │       └── globals.css     # Global styles
│   ├── component/
│   │   ├── AnnotationToolbar.tsx  # Highlight/Underline toolbar
│   │   ├── ExportButton.tsx       # PDF export functionality
│   │   ├── FileUploader.tsx       # PDF upload component
│   │   ├── PdfViewer.tsx          # PDF viewer component
│   │   ├── SignaturePad.tsx       # Signature drawing pad
│   │   └── Toast.tsx              # Toast notification component
│   └── types/
│       └── react-signature-canvas.d.ts  # TypeScript definitions
├── public/                     # Static assets
├── package.json
└── README.md
```

## 🎨 Features Breakdown

### Annotation System
- Accurate coordinate conversion from screen to PDF coordinates
- Support for multiple annotations on the same document
- Customizable colors for each annotation
- Precise positioning that matches the selected text

### Signature System
- Transparent background signatures
- Resizable signatures (80px - 300px)
- Multiple signature placement
- Proper scaling and positioning in exported PDFs

### Export System
- Embeds all annotations and signatures into the PDF
- Maintains PDF quality and formatting
- Accurate coordinate conversion for all elements
- Proper handling of PDF page dimensions and scaling

## 🔧 Configuration

The application uses default configurations that work out of the box. You can customize:

- **PDF Worker URL** - Configure in `src/component/PdfViewer.tsx`
- **Signature Size Range** - Adjust in `src/component/SignaturePad.tsx`
- **Toast Duration** - Modify in `src/component/Toast.tsx`

## 🐛 Known Issues

- Coordinate conversion may require adjustment for very large or small PDFs
- Some complex PDFs with embedded fonts may render differently

## 🚧 Future Improvements

- **Multi-page Annotation Support** - Enable annotations and signatures on multiple pages
- **Different Annotation Types** - Support for shapes, freehand drawing, and sticky notes
- **Save & Load Annotations** - Implement a feature to store and reload annotations for editing later
- **User Authentication** - Allow users to save and retrieve annotated documents from the cloud

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Aaliyah Momodu**

- GitHub: [@aaliyahwithadoublea](https://github.com/aaliyahwithadoublea)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- PDF rendering powered by [PDF.js](https://mozilla.github.io/pdf.js/)
- PDF manipulation by [pdf-lib](https://pdf-lib.js.org/)

---

Made with ❤️ using Next.js and TypeScript
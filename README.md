Document Annotation Tool
Setup and Running Instructions

Prerequisites
Ensure you have the following installed on your system:
1. Node.js (>= 14.x)
2. npm or yarn

Installation
Clone the repository:
git clone https://github.com/aaliyahwithadoublea/my-frontend-test.git
cd /my-frontend-test

Install dependencies:
npm install
or

yarn install

Running the Application
To start the development server:
npm run dev
or

yarn dev
Then, open http://localhost:3000 in your browser.

Libraries and Tools Used
1. React.js: For building the UI and managing state.
2. pdf-lib: To modify and embed annotations and signatures into PDF files.
3. react-signature-canvas: To capture user-drawn signatures.
4. Tailwind CSS: For styling components.

Challenges Faced and Solutions
1. Embedding Signatures in the Exported PDF
Initially, signatures were only displayed on the UI but not embedded in the exported file.
Solution: Used pdf-lib to convert signatures to image data and draw them on the correct page coordinates.

2. Handling PDF Parsing Errors
Encountered errors when loading and modifying PDFs.
Solution: Ensured the PDF file was correctly fetched as an arrayBuffer before processing.

3. Text Selection for Annotation
Difficulty in capturing selected text accurately.
Solution: Used event listeners and PDF.js text layer to track selections.

Future Improvements
1. Multi-page Annotation Support: Enable annotations and signatures on multiple pages, not just the first.

2. Different Annotation Types: Support for shapes, freehand drawing, and sticky notes.

3. Save & Load Annotations: Implement a feature to store and reload annotations for editing later.

4. User Authentication: Allow users to save and retrieve annotated documents from the cloud.


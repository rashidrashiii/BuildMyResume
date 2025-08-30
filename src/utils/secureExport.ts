import CryptoJS from "crypto-js";

const SHARED_SECRET = import.meta.env.VITE_SHARED_SECRET;
const CLOUD_FUNCTION_URL = import.meta.env.VITE_EXPORT_API!;

function base64ToBlob(base64: string, mimeType: string = 'application/pdf'): Blob {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}

export async function securePdfExport(rawContent: string) {
  // Wrap the passed HTML in a full document
  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="${import.meta.env.VITE_BASE_URL || 'https://buildmyresume.live'}/export-tailwind.css" rel="stylesheet">
        <style>
          /* Essential fallback styles in case external CSS fails to load */
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.5;
            color: #333;
            background: white;
          }
          
          /* Ensure proper page sizing */
          @page {
            size: A4;
            margin: 0.5in;
          }
          
          /* Basic layout fallbacks */
          .flex { display: flex; }
          .flex-col { flex-direction: column; }
          .flex-row { flex-direction: row; }
          .justify-between { justify-content: space-between; }
          .justify-center { justify-content: center; }
          .items-center { align-items: center; }
          .items-start { align-items: flex-start; }
          .gap-1 { gap: 0.25rem; }
          .gap-2 { gap: 0.5rem; }
          .gap-4 { gap: 1rem; }
          .gap-6 { gap: 1.5rem; }
          .gap-8 { gap: 2rem; }
          
          /* Text utilities */
          .text-xs { font-size: 0.75rem; }
          .text-sm { font-size: 0.875rem; }
          .text-base { font-size: 1rem; }
          .text-lg { font-size: 1.125rem; }
          .text-xl { font-size: 1.25rem; }
          .text-2xl { font-size: 1.5rem; }
          .text-3xl { font-size: 1.875rem; }
          .font-bold { font-weight: 700; }
          .font-semibold { font-weight: 600; }
          .font-medium { font-weight: 500; }
          
          /* Spacing */
          .p-1 { padding: 0.25rem; }
          .p-2 { padding: 0.5rem; }
          .p-4 { padding: 1rem; }
          .p-6 { padding: 1.5rem; }
          .p-8 { padding: 2rem; }
          .m-1 { margin: 0.25rem; }
          .m-2 { margin: 0.5rem; }
          .m-4 { margin: 1rem; }
          .m-6 { margin: 1.5rem; }
          .m-8 { margin: 2rem; }
          
          /* Colors */
          .text-gray-600 { color: #4b5563; }
          .text-gray-700 { color: #374151; }
          .text-gray-800 { color: #1f2937; }
          .text-gray-900 { color: #111827; }
          .bg-white { background-color: white; }
          .bg-gray-50 { background-color: #f9fafb; }
          .bg-gray-100 { background-color: #f3f4f6; }
          
          /* Borders */
          .border { border: 1px solid #e5e7eb; }
          .border-t { border-top: 1px solid #e5e7eb; }
          .border-b { border-bottom: 1px solid #e5e7eb; }
          .rounded { border-radius: 0.25rem; }
          .rounded-lg { border-radius: 0.5rem; }
          
          /* Grid */
          .grid { display: grid; }
          .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
          .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
          
          /* Width and height */
          .w-full { width: 100%; }
          .h-full { height: 100%; }
          .min-h-screen { min-height: 100vh; }
          
          /* Position */
          .relative { position: relative; }
          .absolute { position: absolute; }
          .sticky { position: sticky; }
          
          /* Display */
          .block { display: block; }
          .inline-block { display: inline-block; }
          .hidden { display: none; }
          
          /* Overflow */
          .overflow-hidden { overflow: hidden; }
          .overflow-auto { overflow: auto; }
          
          /* Z-index */
          .z-10 { z-index: 10; }
          .z-20 { z-index: 20; }
          .z-30 { z-index: 30; }
          @media print {
            html, body {
              width: 100%;
              margin: 0 !important;
              padding: 0 !important;
              background: white !important;
            }
            .resume-root {
              width: 8.27in !important;
              min-width: 8.27in !important;
              max-width: 8.27in !important;
              margin: 0 auto !important;
              background: white !important;
              box-sizing: border-box;
            }
            .print-three-col {
              display: flex !important;
              flex-direction: row !important;
              gap: 1rem !important;
            }
            .print-three-col > .col-span-2 {
              flex: 2 1 0% !important;
            }
            .print-three-col > *:not(.col-span-2) {
              flex: 1 1 0% !important;
            }
            .print-two-col {
              display: flex !important;
              flex-direction: row !important;
              gap: 1rem !important;
            }
            .print-two-col > * {
              flex: 1 1 0% !important;
            }
            .print-date-layout {
              display: flex !important;
              flex-direction: row !important;
              justify-content: space-between !important;
              align-items: flex-start !important;
            }
            .print-date-layout > .flex-1 {
              flex: 1 1 0% !important;
            }
            .print-date-layout > .text-xs {
              text-align: right !important;
              margin-top: 0 !important;
            }
            .print-languages-grid {
              display: grid !important;
              grid-template-columns: 1fr 1fr !important;
              gap: 1rem !important;
            }
            .print-contact-grid {
              display: grid !important;
              grid-template-columns: 1fr 1fr 1fr !important;
              gap: 0.75rem !important;
            }
            .avoid-break {
              break-inside: avoid !important;
              page-break-inside: avoid !important;
            }
          }
        </style>
      </head>
      <body>
        ${rawContent}
      </body>
    </html>
  `;
  const payload = JSON.stringify({ html });
  const encryptedData = CryptoJS.AES.encrypt(payload, SHARED_SECRET).toString();
  const signature = CryptoJS.HmacSHA256(encryptedData, SHARED_SECRET).toString();

  const res = await fetch(CLOUD_FUNCTION_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ encryptedData, signature }),
  });

  const data = await res.json();
  if (!res.ok) {
    // Provide more specific error messages based on status code
    if (res.status === 408) {
      throw new Error("PDF generation timed out. Please try again with a simpler resume layout.");
    } else if (res.status === 429) {
      throw new Error("Too many PDF export requests. Please wait a moment and try again.");
    } else if (res.status === 403) {
      throw new Error("Access denied. Please refresh the page and try again.");
    } else if (res.status === 400) {
      throw new Error(data.error || "Invalid request. Please check your resume content.");
    } else {
      throw new Error(data.error || "Failed to export PDF. Please try again.");
    }
  }
  
  if (!data.pdf) throw new Error("Failed to export PDF - no PDF data received");

  const blob = base64ToBlob(data.pdf);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "resume.pdf";
  link.click();
  URL.revokeObjectURL(url);
}

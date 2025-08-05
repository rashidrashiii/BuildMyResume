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
  if (!res.ok || !data.pdf) throw new Error("Failed to export PDF");

  const blob = base64ToBlob(data.pdf);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "resume.pdf";
  link.click();
  URL.revokeObjectURL(url);
}

import express, { Request, Response } from "express";
import cors from "cors";
import * as CryptoJS from "crypto-js";
import puppeteer from "puppeteer";

const app = express();
app.use(cors({ origin: true }));
app.use(express.json({ limit: "10mb" }));

const SHARED_SECRET = process.env.SHARED_SECRET;
if (!SHARED_SECRET) {
  throw new Error('SHARED_SECRET environment variable is required');
}

app.post("/export-pdf", async (req: Request, res: Response) => {
  try {
    const { encryptedData, signature } = req.body;

    // Validate HMAC signature
    const expectedSignature = CryptoJS.HmacSHA256(encryptedData, SHARED_SECRET).toString();
    if (expectedSignature !== signature) {
      return res.status(403).json({ error: "Invalid signature." });
    }

    // Decrypt data
    const bytes = CryptoJS.AES.decrypt(encryptedData, SHARED_SECRET);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    const { html } = JSON.parse(decrypted);

    // Launch Puppeteer (full)
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "a4",
      printBackground: true,
    });

    await browser.close();

    // Convert to base64 to return to frontend
    const base64Pdf = Buffer.from(pdfBuffer).toString("base64");
    return res.status(200).json({ pdf: base64Pdf });
  } catch (err) {
    console.error("PDF generation error:", err);
    return res.status(500).json({ error: "PDF generation failed" });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Local PDF export server running on port ${PORT}`);
}); 
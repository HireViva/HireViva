import express from 'express';
const router = express.Router();
import multer from 'multer';

// --- PDF Parser Import for pdf-parse v2.4.5 ---
// v2.4.5 exports a PDFParse class (not a function).
// Usage: new PDFParse({ data: buffer }); await parser.getText();
let PDFParseClass = null;
try {
    const pdfLib = await import('pdf-parse');
    if (pdfLib.PDFParse && typeof pdfLib.PDFParse === 'function') {
        PDFParseClass = pdfLib.PDFParse;
        console.log('[PDF] ✅ PDF Parser loaded successfully (v2.4.5 class-based API)');
    } else {
        console.warn('[PDF] ⚠️ pdf-parse loaded but PDFParse class not found. Keys:', Object.keys(pdfLib));
    }
} catch (err) {
    console.warn('[PDF] ⚠️ pdf-parse could not be loaded:', err.message);
}
// -----------------------------------------------

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 2 * 1024 * 1024 }
});

router.post('/upload', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        let extractedText = "";

        if (PDFParseClass) {
            console.log('[PDF] Parsing uploaded PDF...');
            try {
                // pdf-parse v2.4.5 API: pass data as Uint8Array in constructor options
                const parser = new PDFParseClass({ data: new Uint8Array(req.file.buffer) });
                const result = await parser.getText();

                // result is a TextResult object, extract the text content
                extractedText = typeof result === 'string' ? result : (result?.text || String(result));

                if (!extractedText || !extractedText.trim()) {
                    extractedText = "Resume uploaded but text appears empty (possibly a scanned/image PDF).";
                } else {
                    console.log('[PDF] ✅ Extracted', extractedText.length, 'characters from PDF');
                }
            } catch (parseErr) {
                console.error('[PDF] ❌ PDF parsing failed:', parseErr.message);
                extractedText = "Resume uploaded (PDF text extraction failed: " + parseErr.message + ")";
            }
        } else {
            console.log('[PDF] Parser unavailable. Skipping text extraction.');
            extractedText = "Resume uploaded successfully (Text analysis unavailable - pdf-parse not loaded).";
        }

        res.json({ success: true, text: extractedText });

    } catch (error) {
        console.error('[PDF] Upload Endpoint Error:', error);
        res.status(500).json({ error: 'Upload failed: ' + error.message });
    }
});

export default router;

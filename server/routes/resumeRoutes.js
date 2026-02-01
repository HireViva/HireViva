import express from 'express';
const router = express.Router();
import multer from 'multer';

// --- ULTIMATE DEFENSIVE IMPORT ---
// This block prevents the server from crashing regardless of what pdf-parse version 
// is installed (or if it's missing/broken).
let pdfParser = null;
(async () => {
    try {
        // Try to load the library
        const pdfLib = await import('pdf-parse');

        // Check what we got
        if (typeof pdfLib === 'function') {
            // v1.1.1 (Standard)
            pdfParser = pdfLib;
        } else if (pdfLib && typeof pdfLib.default === 'function') {
            // v2.4.5+ (ES Module / TypeScript default export)
            pdfParser = pdfLib.default;
        } else {
            console.warn('PDF Parser loaded but format is unrecognized (not a function).');
        }
    } catch (err) {
        // If import throws (e.g. "MODULE_NOT_FOUND")
        console.warn('PDF Parser could not be loaded (Server will continue without it):', err.message);
    }
})();
// ---------------------------------

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 2 * 1024 * 1024 }
});

router.post('/upload', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        let extractedText = "";

        if (pdfParser) {
            console.log('Parsing PDF with loaded library...');
            try {
                const data = await pdfParser(req.file.buffer);
                extractedText = data.text;

                if (!extractedText || !extractedText.trim()) {
                    extractedText = "Resume uploaded but text appears empty.";
                }
            } catch (parseErr) {
                console.error('PDF Analysis Failed:', parseErr);
                extractedText = "Resume uploaded (Analysis failed: " + parseErr.message + ")";
            }
        } else {
            console.log('PDF Parser unavailable. Skipping text extraction.');
            extractedText = "Resume uploaded successfully (Text analysis unavailable).";
        }

        res.json({ success: true, text: extractedText });

    } catch (error) {
        console.error('Upload Endpoint Error:', error);
        res.status(500).json({ error: 'Upload failed: ' + error.message });
    }
});

export default router;

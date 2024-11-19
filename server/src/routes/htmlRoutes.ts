import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express, { Router } from 'express';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();

// TO DO: Define route to serve index.html
router.get('/', (req, res) => {
    req.app.use(express.static('client/dist'));
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

export default router;

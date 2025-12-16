import { Router, Request, Response } from "express";
import multer from "multer";
import { clamAvInstream } from "../clamav/instream";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });
const clamav = new clamAvInstream();

router.post("/", upload.single("file"), async (req: Request, res: Response) => {
    // 1. Validate input
    if (!req.file) {
        return res.status(400).json({
            status: "error",
            error: "No file uploaded"
        });
    }

    try {
        // 2. Call ClamAV
        const result = await clamav.scanBuffer(req.file.buffer);

        // 3. Normal scan response
        return res.status(200).json(result);

    } catch (err: any) {
        // 4. ClamAV unreachable → 503
        if (
            err.code === "ENOTFOUND" ||
            err.code === "ECONNREFUSED" ||
            err.code === "EHOSTUNREACH" ||
            err.code === "ETIMEDOUT"
        ) {
            return res.status(503).json({
                status: "UNREACHABLE",
                error: "ClamAV service is not reachable"
            });
        }

        // 5. Other errors → 500
        return res.status(500).json({
            status: "error",
            error: err.message || "Scan failed"
        });
    }
});


export default router;

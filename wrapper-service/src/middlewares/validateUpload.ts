import { Request, Response, NextFunction } from "express";
import { scanConfig } from "../config/scan.config";

// Middleware to validate uploaded files
export function validateUpload(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        // Validate max upload size
        if (req.file.size > scanConfig.maxFileSize) {
            return res.status(400).json({
                error: `File is too large. Maximum allowed: ${
                    scanConfig.maxFileSize / (1024 * 1024)
                } MB`,
            });
        }
        next();
    } catch (err) {
        next(err);
    }
}

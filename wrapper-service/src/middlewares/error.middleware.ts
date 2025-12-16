import { Request, Response, NextFunction } from "express";

export function errorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.error("ERROR:", err);

    // 1. Multer Errors (file upload)
    if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
            status: "error",
            message: "Uploaded file is too large",
        });
    }

    if (err.code === "LIMIT_UNEXPECTED_FILE") {
        return res.status(400).json({
            status: "error",
            message: "Unexpected file upload",
        });
    }

    // 2. ClamAV / Scan errors passed from instream.ts
    if (err.isClamAVError) {
        return res.status(500).json({
            status: "error",
            message: "ClamAV scanning failed",
            detail: err.message,
        });
    }

    // 3. Timeout errors
    if (err.name === "TimeoutError") {
        return res.status(408).json({
            status: "error",
            message: "ClamAV scan timed out",
        });
    }

     // 4. General / unknown errors
    return res.status(err.status || 500).json({
        status: "error",
        message: err.message || "Something went wrong",
    });
}

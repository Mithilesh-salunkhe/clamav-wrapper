// src/middlewares/enforceLimits.ts
import { Request, Response, NextFunction } from "express";
import { scanConfig } from "../config/scan.config";

let activeScans = 0;

//enforceLimits function is used to limit the number of concurrent scan requests to ClamAV server.
export function enforceLimits(req: Request, res: Response, next: NextFunction) {
    if (activeScans >= scanConfig.concurrency) {
        return res.status(429).json({
            error: "Too many scan requests in progress. Try again later.",
        });
    }

    // Occupy a slot
    activeScans++;

    // Release slot when response is done
    res.on("finish", () => {
        activeScans--;
    });

    next();
}

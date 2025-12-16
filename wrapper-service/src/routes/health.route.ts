import { Router, Request, Response } from "express";
import { clamAvInstream } from "../clamav/instream";

const router = Router();
const clamav = new clamAvInstream();

router.get("/", async (req: Request, res: Response) => {
    try {
        const isHealthy = await clamav.healthCheck();
        if (!isHealthy) {
            return res.status(503).json({ status: "UNREACHABLE",message: "ClamAV service is unreachable" });
        }
        return res.status(200).json({ status: "HEALTHY",message:"ClamAV is running" });
    } catch (err: any) {
        return res.status(500).json({ status: "UNREACHABLE", error: err.message });
    }
});

export default router;

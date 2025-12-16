//Import dependencies
import express, { Request, Response } from "express";
import scanRoutes from "./routes/scan.route";
import healthRoutes from "./routes/health.route";
import { enforceLimits } from "./middlewares/enforceLimits";
import { errorHandler } from "./middlewares/error.middleware";

// Initialize Express
const app = express();

//Global middlewares
app.use(express.json());       // Parse JSON requests
app.use(express.urlencoded({ extended: true }));  // Parse URL-encoded requests

//Apply concurrency limiter (optional global, or can apply per route)
app.use(enforceLimits);

//Routes
app.use("/scan", scanRoutes);  // POST /scan, GET /health

app.use("/health", healthRoutes);  // Health check route

//Default route
app.get("/", (req: Request, res: Response) => {
    res.send("ClamAV Wrapper API is running!");
});

//Error-handling middleware
app.use(errorHandler);

//Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
});

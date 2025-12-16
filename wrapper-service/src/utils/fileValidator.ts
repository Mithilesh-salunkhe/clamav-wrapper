import { scanConfig } from "../config/scan.config";
import { Express } from "express";

// Function to validate uploaded file based on size and type
export function validateUploadedFile(file: Express.Multer.File) {
    if (!file) {
        throw new Error("No file uploaded.");
    }

    if (!file.originalname) {
        throw new Error("File name missing.");
    }

    if (!file.buffer || file.size === 0) {
        throw new Error("Uploaded file is empty.");
    }


    if (file.size > scanConfig.maxFileSize) {
        throw new Error(`File exceeds max size of ${scanConfig.maxFileSize} bytes.`);
    }

    // Optional: file type validation from config
    if (scanConfig.allowedFileTypes !== "ANY") {
        const ext = file.originalname.split(".").pop()?.toLowerCase();

        if (!ext || !scanConfig.allowedFileTypes.includes(ext)) {
            throw new Error(`File type .${ext} not allowed.`);
        }
    }

    return true;
}

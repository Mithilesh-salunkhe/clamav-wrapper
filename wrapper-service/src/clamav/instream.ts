import { ClamAVClient } from "./client";
import { ScanResult } from "../types/scanResults";
import { scanConfig } from "../config/scan.config";
import { limit } from "../utils/limiter";

export class clamAvInstream {
  private client: ClamAVClient;

  constructor() {
    this.client = new ClamAVClient(
      scanConfig.CLAMAV_HOST,
      scanConfig.CLAMAV_PORT,
      scanConfig.SCAN_TIMEOUT
    );
  }

  // Scan buffer (from API upload)
  public async scanBuffer(buffer: Buffer): Promise<ScanResult> {
    if (buffer.length > scanConfig.streamMaxLength) {
      return {
        status: "error",
        scannedBytes: 0,
        timeTaken: 0,
        error: "File too large to scan",
      };
    }

    try {
      const result = await limit(() => this.client.scanBuffer(buffer));
      return result;
    } catch (err: any) {
      return {
        status: "error",
        scannedBytes: 0,
        timeTaken: 0,
        error: err.message || "Unknown error during scanning",
      };
    }
  }

  // Health check for ClamAV server
  public async healthCheck(): Promise<boolean> {
    try {
      return await this.client.ping();
    } catch {
      return false;
    }
  }
}

import net from "net";//net module provides an asynchronous network API for creating stream-based TCP or IPC servers and clients.
import { ScanResult } from "../types/scanResults";
import { scanConfig } from "../config/scan.config";

export class ClamAVClient {
  private host: string;
  private port: number;
  private timeout: number;

  constructor(host?: string, port?: number, timeout?: number) {
    this.host = host || scanConfig.CLAMAV_HOST;
    this.port = port || scanConfig.CLAMAV_PORT;
    this.timeout = timeout || scanConfig.SCAN_TIMEOUT;
  }

  // Ping ClamAV server
  public ping(): Promise<boolean> {
    return new Promise((resolve) => {
      const socket = net.createConnection({ host: this.host, port: this.port }, () => {
        socket.write("PING\n");
      });

      socket.setTimeout(this.timeout, () => {
        socket.destroy();
        resolve(false);
      });

      socket.on("data", (data) => {
        const response = data.toString().trim();
        resolve(response === "PONG");
      });

      socket.on("error", () => {
        socket.destroy();
        resolve(false);
      });
    });
  }

  // Scan buffer
  public scanBuffer(buffer: Buffer): Promise<ScanResult> {
    return new Promise((resolve) => {
      const socket = net.createConnection({ host: this.host, port: this.port }, () => {
        socket.write("zINSTREAM\0");//zINSTREAM\0 is the command to start an in-stream scan.

        const chunkSize = scanConfig.chunkSize;
        // Send buffer in chunks
        for (let offset = 0; offset < buffer.length; offset += chunkSize) {
          const chunk = buffer.slice(offset, offset + chunkSize);//slice extracts a section of the buffer from offset to offset + chunkSize.
          const sizePrefix = Buffer.alloc(4);//.alloc(4) allocates a new buffer of 4 bytes.
          sizePrefix.writeUInt32BE(chunk.length, 0);//writeUInt32BE writes a 32-bit unsigned integer to the buffer at the specified offset using big-endian byte order.

          socket.write(sizePrefix);
          socket.write(chunk);
        }

        // End of stream
        const endPrefix = Buffer.alloc(4);
        endPrefix.writeUInt32BE(0, 0);
        socket.write(endPrefix);
      });

      socket.setTimeout(this.timeout, () => {
        socket.destroy();
        resolve({
          status: "error",
          scannedBytes: 0,
          timeTaken: 0,
          error: "Scan timed out",
        });
      });

      const startTime = Date.now();
      let responseRaw = "";

      socket.on("data", (data) => {
        responseRaw += data.toString();
      });

      socket.on("end", () => {
        const timeTaken = Date.now() - startTime;
        const scannedBytes = buffer.length;
        const response = responseRaw.replace(/\x00/g, "").trim();

        if (response.startsWith("stream:") && response.includes("OK")) {
          resolve({ status: "clean", scannedBytes, timeTaken });
        } else if (response.includes("FOUND")) {
          const virusName = response.split(":")[1]?.replace("FOUND", "").trim();
          resolve({ status: "infected", virusName, scannedBytes, timeTaken });
        } else {
          resolve({
            status: "error",
            scannedBytes,
            timeTaken,
            error: `Unexpected response: ${response}`,
          });
        }
      });

      socket.on("error", (err) => {
        resolve({
          status: "error",
          scannedBytes: 0,
          timeTaken: 0,
          error: err.message,
        });
      });
    });
  }
}

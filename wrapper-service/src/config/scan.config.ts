export const scanConfig = {
  // File size limits
  maxFileSize: Number(process.env.MAX_FILE_SIZE) || 50 * 1024 * 1024,      // 50 MB
  streamMaxLength: Number(process.env.STREAM_MAX_LENGTH) || 50 * 1024 * 1024, // 50 MB
  maxScanSize: Number(process.env.MAX_SCAN_SIZE) || 100 * 1024 * 1024,      // 100 MB
  maxFiles: Number(process.env.MAX_FILES) || 10000,
  allowedFileTypes: process.env.ALLOWED_FILE_TYPES || "ANY",    

  // Timeouts
  readTimeout: Number(process.env.READ_TIMEOUT) || 180000,                  // 3 minutes
  commandReadTimeout: Number(process.env.COMMAND_READ_TIMEOUT) || 300000,  // 5 minutes
  maxScanTime: Number(process.env.MAX_SCAN_TIME) || 120000,                 // 2 minutes per scan

  // TCP streaming configuration
  chunkSize: Number(process.env.CHUNK_SIZE) || 8192, // 8 KB
  concurrency: Number(process.env.CONCURRENCY) || 2, // max concurrent scans

  // ClamAV TCP host/port
  CLAMAV_HOST: process.env.CLAMAV_HOST || "clamav", // Docker service name
  CLAMAV_PORT: Number(process.env.CLAMAV_PORT) || 3310,
  SCAN_TIMEOUT: Number(process.env.SCAN_TIMEOUT) || 30000, // 30 seconds TCP timeout
};

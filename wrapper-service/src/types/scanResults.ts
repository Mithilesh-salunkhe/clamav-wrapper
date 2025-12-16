/**
 * Represents the result of a ClamAV scan for a single file or buffer.
 */
export interface ScanResult {

  status: 'clean' | 'infected' | 'error';

  virusName?: string;

  scannedBytes: number;

  timeTaken: number;

  error?: string;
}
    
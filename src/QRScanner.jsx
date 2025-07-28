import React, { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';

// Ensure worker path is set for performance
QrScanner.WORKER_PATH = '/qr-scanner-worker.min.js';

function QRScanner({ onScan }) {
  const videoRef = useRef(null);
  const scannerRef = useRef(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;

    const scanner = new QrScanner(
      videoRef.current,
      (result) => {
        if (!scanning) {
          setScanning(true);
          onScan(result.data);
          console.log("Scanned QR Data:", result.data);

          // Reset scanning flag after a short delay
          setTimeout(() => setScanning(false), 1500);
        }
      },
      {
        highlightScanRegion: true,
        highlightCodeOutline: true,
      }
    );

    scanner.start()
      .then(() => console.log("QR Scanner started"))
      .catch((err) => console.error("Scanner failed to start:", err));

    scannerRef.current = scanner;

    // cleanup on unmount
    return () => {
      scanner.stop();
      scanner.destroy();
    };
  // ⚡ only run once when mounted
  }, [onScan]);  

  return (
    <div style={{ width: "100%", textAlign: "center" }}>
      <video
        ref={videoRef}
        style={{
          width: "100%",
          maxWidth: "400px",
          border: "2px solid #ccc",
          borderRadius: "10px"
        }}
      />
    </div>
  );
}

export default QRScanner;

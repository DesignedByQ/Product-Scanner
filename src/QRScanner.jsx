import React, { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';

function QRScanner({ onScan }) {
  const videoRef = useRef(null);
  const scannerRef = useRef(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;

    const scanner = new QrScanner(
      videoRef.current,
      (result) => {
        if (!scanning) { // prevent duplicate rapid scans
          setScanning(true);
          onScan(result.data);
          console.log("Scanned:", result.data);

          // Allow scanning again after short pause
          setTimeout(() => setScanning(false), 1500);
        }
      },
      {
        highlightScanRegion: true,
        highlightCodeOutline: true,
      }
    );

    scanner.start()
      .then(() => {
        console.log("QR Scanner started.");
      })
      .catch((err) => {
        console.error("Failed to start scanner:", err);
      });

    scannerRef.current = scanner;

    return () => {
      scanner.stop();
      scanner.destroy();
      scanner.start();
      //scanner.destroy();
      //scanner.clear()
    };
  }, [onScan, scanning]);

  return (
    <div style={{ width: "100%", textAlign: "center" }}>
      <video
        ref={videoRef}
        style={{ width: "100%", maxWidth: "400px", border: "2px solid #ccc", borderRadius: "10px" }}
      />
    </div>
  );
}

export default QRScanner;

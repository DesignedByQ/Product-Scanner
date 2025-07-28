import React, { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';

// Set worker path for better performance
QrScanner.WORKER_PATH = '/qr-scanner-worker.min.js';

function QRScanner({ onScan }) {
  const videoRef = useRef(null);
  const scannerRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!videoRef.current) return;

    const scanner = new QrScanner(
      videoRef.current,
      (result) => {
        if (!scanning && isActive) {
          setScanning(true);
          onScan(result.data);
          console.log("Scanned QR Data:", result.data);

          // Reset scanning flag to allow another scan
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

    // cleanup only on unmount
    return () => {
      scanner.stop();
      scanner.destroy();
    };
  }, []); // 🚀 empty dependency array = run once only

  // Toggle Pause / Resume
  const toggleScan = async () => {
    if (!scannerRef.current) return;

    if (isActive) {
      await scannerRef.current.pause();
      setIsActive(false);
    } else {
      await scannerRef.current.start();
      setIsActive(true);
    }
  };

  return (
    <div style={{ width: "100%", textAlign: "center" }}>
      <video
        ref={videoRef}
        style={{
          width: "100%",
          maxWidth: "400px",
          border: "2px solid #ccc",
          borderRadius: "10px",
        }}
      />
      <div style={{ marginTop: "10px" }}>
        <button 
          onClick={toggleScan} 
          style={{
            padding: "10px 20px",
            background: isActive ? "red" : "green",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          {isActive ? "Pause Scan" : "Resume Scan"}
        </button>
      </div>
    </div>
  );
}

export default QRScanner;

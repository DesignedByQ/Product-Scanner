import React, { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';

function QRScanner({ onScan }) {
  const videoRef = useRef(null);
  const scannerRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [scannerKey, setScannerKey] = useState(0); // force reinit on iOS

  useEffect(() => {
    if (!videoRef.current) return;

    const scanner = new QrScanner(
      videoRef.current,
      (result) => {
        if (!isPaused) {
          console.log("Scanned:", result.data);
          onScan(result.data);
          setIsPaused(true);

          // Stop camera stream to avoid iOS blank bug
          scanner.stop();
        }
      },
      {
        highlightScanRegion: true,
        highlightCodeOutline: true,
        returnDetailedScanResult: true,
      }
    );

    scanner.start()
      .then(() => console.log("QR Scanner started."))
      .catch((err) => console.error("Failed to start scanner:", err));

    scannerRef.current = scanner;

    return () => {
      scanner.stop();
      scanner.destroy();
    };
  }, [scannerKey, onScan, isPaused]); // reinit when scannerKey changes

  const handleResume = () => {
    setIsPaused(false);
    setScannerKey((prev) => prev + 1); // rebuild scanner with fresh camera stream
  };

  return (
    <div style={{ width: "100%", textAlign: "center" }}>
      <video
        key={scannerKey} // force a new <video> element
        ref={videoRef}
        playsInline
        muted
        autoPlay
        style={{
          width: "100%",
          maxWidth: "400px",
          border: "2px solid #ccc",
          borderRadius: "10px",
          backgroundColor: "white",
        }}
      />
      {isPaused && (
        <button
          onClick={handleResume}
          style={{
            marginTop: "10px",
            padding: "12px 24px",
            background: "green",
            color: "white",
            fontWeight: "bold",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Tap to Scan Next Item
        </button>
      )}
    </div>
  );
}

export default QRScanner;

import React, { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';

function QRScanner({ onScan }) {
  const videoRef = useRef(null);
  const scannerRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;

    const scanner = new QrScanner(
      videoRef.current,
      (result) => {
        if (!isPaused) {
          console.log("Scanned:", result.data);
          onScan(result.data);
          setIsPaused(true);
          scanner.stop(); // stop camera after one scan
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
  }, [onScan, isPaused]);

  const handleResume = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.start();
        setIsPaused(false);
        console.log("Scanner resumed.");
      } catch (err) {
        console.error("Failed to resume scanner:", err);
      }
    }
  };

  return (
    <div style={{ width: "100%", textAlign: "center" }}>
      <video
        ref={videoRef}
        playsInline
        muted
        autoPlay
        style={{
          width: "100%",
          maxWidth: "400px",
          border: "2px solid #ccc",
          borderRadius: "10px",
          backgroundColor: "black", // avoids white screen on Safari
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
          Scan Next Item
        </button>
      )}
    </div>
  );
}

export default QRScanner;

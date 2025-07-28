import React, { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';

function QRScanner({ onScan }) {
  const videoRef = useRef(null);
  const scannerRef = useRef(null);
  const onScanRef = useRef(onScan);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  useEffect(() => {
    if (!videoRef.current) return;

    const scanner = new QrScanner(
      videoRef.current,
      (result) => {
        if (!isPaused && onScanRef.current) {
          onScanRef.current(result.data);
          console.log("Scanned:", result.data);
          setIsPaused(true); // auto-pause after scan
          scanner.stop(); // explicitly stop stream on iOS
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
  }, [isPaused]);

  const handleResume = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.start(); // restart camera explicitly
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
        playsInline // important for iOS Safari
        muted
        autoPlay
        style={{
          width: "100%",
          maxWidth: "400px",
          border: "2px solid #ccc",
          borderRadius: "10px",
          backgroundColor: "black" // avoids white blank screen
        }}
      />
      {isPaused && (
        <button
          onClick={handleResume}
          style={{
            marginTop: "10px",
            padding: "10px 20px",
            background: "green",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          Scan Next Item
        </button>
      )}
    </div>
  );
}

export default QRScanner;

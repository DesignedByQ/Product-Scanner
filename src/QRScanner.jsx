import React, { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';

function QRScanner({ onScan }) {
  const videoRef = useRef(null);
  const scannerRef = useRef(null);
  // State to prevent multiple rapid scans
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;

    // Use a variable to hold the scanner instance
    const scanner = new QrScanner(
      videoRef.current,
      (result) => {
        // Prevent processing if a scan is already in progress
        if (isProcessing) return;
        
        // 1. Set the processing flag and stop the scanner for a "refresh" effect
        setIsProcessing(true);
        scannerRef.current?.stop();
        
        // 2. Pass the scanned data to the parent component
        onScan(result.data);
        console.log("Scanned:", result.data);

        // 3. After a pause, restart the scanner and allow the next scan
        setTimeout(() => {
          scannerRef.current?.start();
          setIsProcessing(false);
        }, 1500); // 1.5-second pause
      },
      {
        highlightScanRegion: true,
        highlightCodeOutline: true,
      }
    );

    // Start the scanner when the component mounts
    scanner.start().catch((err) => {
      console.error("Failed to start scanner:", err);
    });

    // Store the instance in the ref
    scannerRef.current = scanner;

    // CRITICAL: Cleanup function to run when the component unmounts
    return () => {
      console.log("Destroying scanner instance.");
      scanner.destroy();
    };
    // CRITICAL: The dependency array should not include the processing state
  }, [onScan]);

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
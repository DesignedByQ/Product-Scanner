import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

// The ID for the video element
const QR_READER_ID = "qr-code-reader";

function QRScanner({ onScan }) {
  const scannerRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  // State to prevent multiple scan calls for the same QR code
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Only proceed if the camera should be on
    if (!isCameraOn) {
      return;
    }
    
    // Ensure the scannerRef is not already holding an instance
    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode(QR_READER_ID);
    }
    const html5QrCode = scannerRef.current;

    // Configuration for the scanner
    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    };

    // Success callback
    const onScanSuccess = (decodedText, decodedResult) => {
      // Prevent processing the same scan multiple times in a row
      if (isProcessing) {
        return;
      }
      
      setIsProcessing(true); // Set processing flag
      onScan(decodedText); // Pass result to parent
      console.log(`Continuous scan successful: ${decodedText}`);

      // Add a small delay before allowing another scan
      setTimeout(() => {
        setIsProcessing(false);
      }, 2000); // 2-second cooldown
    };
    
    // Error callback (can be left empty to ignore non-scans)
    const onScanError = (error) => {
      // console.warn(error);
    };

    // Start the camera and scanning
    html5QrCode.start(
      { facingMode: "environment" }, // Prefer the back camera
      config,
      onScanSuccess,
      onScanError
    ).catch((err) => {
      console.error("Unable to start scanning.", err);
      // If there's an error, turn the camera off
      setIsCameraOn(false);
    });

    // Cleanup function: This is critical for stopping the camera
    return () => {
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop()
          .then(() => {
            console.log("QR Code scanning stopped.");
            // Clearing the reference is not strictly necessary but good practice
            scannerRef.current = null;
          })
          .catch((err) => {
            console.error("Failed to stop scanning.", err);
          });
      }
    };
    // Re-run the effect if the camera's state changes
  }, [isCameraOn, onScan, isProcessing]);

  const handleToggleCamera = () => {
    setIsCameraOn(prev => !prev);
    // Reset processing state when toggling camera
    setIsProcessing(false); 
  };

  return (
    <div>
      <button onClick={handleToggleCamera}>
        {isCameraOn ? 'Stop Scanning' : 'Start Scanning'}
      </button>
      {/* The video element is required for Html5Qrcode to attach the camera stream */}
      <div id={QR_READER_ID} style={{ width: '100%', maxWidth: '500px', marginTop: '10px' }}></div>
    </div>
  );
}

export default QRScanner;
import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

function QRScanner({ onScan }) {
  // Use a ref to hold the scanner instance.
  const scannerRef = useRef(null);
  // State to control the camera's on/off status.
  const [isCameraOn, setIsCameraOn] = useState(false);

  // This useEffect hook manages the scanner's lifecycle.
  // It runs whenever `isCameraOn` or `onScan` changes.
  useEffect(() => {
    if (isCameraOn) {
      // Create a new scanner instance only if the camera should be on.
      const scanner = new Html5QrcodeScanner(
        'qr-scanner-container', // The ID of the container element
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          // Important: request the back camera
          facingMode: "environment"
        },
        /* verbose= */ false
      );

      // Define the success callback
      const onScanSuccess = (decodedText, decodedResult) => {
        // Pass the decoded text to the parent component
        onScan(decodedText);
        // Turn off the camera after a successful scan = change to false
        setIsCameraOn(true); // Keep camera on for continuous scanning
        // You can also add feedback to the user here
        console.log(`Scan successful: ${decodedText}`);
      };

      // Define the error callback
      const onScanError = (errorMessage) => {
        // You can ignore errors or log them for debugging.
        console.warn(`QR scan error: ${errorMessage}`);
      };

      // Start scanning
      scanner.render(onScanSuccess, onScanError);
      scannerRef.current = scanner;
    }

    // Cleanup function: this runs when the component unmounts OR when the effect re-runs.
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
        scannerRef.current = null;
      }
    };
  }, [isCameraOn, onScan]); // Dependency array

  const handleToggleCamera = () => {
    setIsCameraOn(prev => !prev); // Toggle camera state
  };

  return (
    <div>
      <button onClick={handleToggleCamera}>
        {isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
      </button>
      {/* The container element for the scanner will only be visible when the camera is on */}
      {isCameraOn && <div id="qr-scanner-container" style={{ width: "100%", marginTop: "10px" }}></div>}
    </div>
  );
}

export default QRScanner;
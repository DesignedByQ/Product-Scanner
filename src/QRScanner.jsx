import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

function QRScanner({ onScan }) {
  const scannerRef = useRef(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    // Initialize the scanner
    const scanner = new Html5QrcodeScanner('qr-scanner', {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    });

    scanner.render(
      (decodedText) => {
        if (!scanning) { // Debounce to prevent multiple scans
          setScanning(true);
          onScan(decodedText);
          console.log("Scanned: ", decodedText);

          // Short pause to allow continuous scanning
          setTimeout(() => setScanning(false), 1500); // Adjust delay as needed
        }
      },
      (errorMessage) => {
        console.error('QR scan error:', errorMessage);
      }
    );

    scannerRef.current = scanner;

    return () => {
      // Proper cleanup on component unmount
      //scanner.clear();
      scanner.clear();
      setScanning(true)
    };
  }, [onScan, scanning]);

  return (
    <div>
      <div id="qr-scanner" style={{ width: "100%", minHeight: "300px" }}></div>
    </div>
  );
}

export default QRScanner;
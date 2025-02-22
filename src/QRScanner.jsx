import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

function QRScanner({ onScan }) {
  const html5QrCode = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    // Initialize Html5Qrcode once
    if (!html5QrCode.current) {
      html5QrCode.current = new Html5Qrcode("qr-scanner");
    }

    return () => {
      // Cleanup on unmount
      if (cameraActive) {
        html5QrCode.current.stop().catch(err => console.error("Camera stop error: ", err));
      }
    };
  }, [cameraActive]);

  const startCamera = () => {
    if (!cameraActive) {
      html5QrCode.current
        .start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            if (!scanning) {  // Prevents multiple triggers
              setScanning(true);
              onScan(decodedText);
              console.log("Scanned: ", decodedText);
              setTimeout(() => setScanning(false), 1500);  // Delay for 1.5 seconds
            }
          },
          (errorMessage) => {
            console.error('QR scan error:', errorMessage);
          }
        )
        .then(() => {
          setCameraActive(true);
        })
        .catch(err => console.error("Camera start error: ", err));
    }
  };

  const stopCamera = () => {
    if (cameraActive) {
      html5QrCode.current
        .stop()
        .then(() => {
          setCameraActive(false);
          html5QrCode.current.clear(); // Clear the scanning area
        })
        .catch(err => console.error("Camera stop error: ", err));
    }
  };

  return (
    <div>
      <div id="qr-scanner" style={{ width: "100%", minHeight: "300px" }}></div>
      <div>
        {!cameraActive ? (
          <button onClick={startCamera}>Start Camera</button>
        ) : (
          <button onClick={stopCamera}>Stop Camera</button>
        )}
      </div>
    </div>
  );
}

export default QRScanner;

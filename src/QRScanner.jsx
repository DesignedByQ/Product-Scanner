import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

function QRScanner({ onScan }) {
  const scannerRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);

  useEffect(() => {
    scannerRef.current = new Html5Qrcode('qr-scanner');

    return () => {
      // Cleanup when component is unmounted
      if (cameraActive) {
        scannerRef.current.stop().catch((err) => {
          console.error('Stop failed:', err);
        });
      }
    };
  }, [cameraActive]);

  const startCamera = async () => {
    if (!cameraActive) {
      try {
        await scannerRef.current.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            onScan(decodedText); // Handle scanned text

            // Pause and restart to allow continuous scanning
            scannerRef.current.pause();
            setTimeout(() => {
              scannerRef.current.resume().catch((err) => {
                console.error('Resume failed:', err);
              });
            }, 1000); // Adjust delay for smoother scanning
          },
          (errorMessage) => {
            console.error('QR scan error:', errorMessage);
          }
        );
        setCameraActive(true);
      } catch (err) {
        console.error('Camera start failed:', err);
      }
    }
  };

  const stopCamera = async () => {
    if (cameraActive) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear(); // Clear the scanning area
        setCameraActive(false);
      } catch (err) {
        console.error('Stop failed:', err);
      }
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

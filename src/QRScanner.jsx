import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from 'html5-qrcode';

function QRScanner({ onScan }) {
  const scannerRef = useRef(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    scannerRef.current = new Html5Qrcode('qr-scanner');
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
        scannerRef.current.clear().catch(() => {});
      }
    };
  }, []);

  const startScanner = async () => {
    if (!scanning && scannerRef.current) {
      try {
        await scannerRef.current.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            onScan(decodedText);
            // Pause and resume for continuous scanning
            scannerRef.current.pause();
            setTimeout(() => {
              scannerRef.current.resume().catch(() => {});
            }, 500);
          },
          (errorMessage) => {
            console.error('QR scan error:', errorMessage);
          }
        );
        setScanning(true);
      } catch (err) {
        console.error('Camera start failed:', err);
      }
    }
  };

  const stopScanner = async () => {
    if (scanning && scannerRef.current) {
      try {
        await scannerRef.current.stop();
        setScanning(false);
      } catch (err) {
        console.error('Camera stop failed:', err);
      }
    }
  };

  return (
    <div>
      <div id="qr-scanner"></div>
      <button onClick={startScanner} disabled={scanning}>Start Camera</button>
      <button onClick={stopScanner} disabled={!scanning}>Stop Camera</button>
    </div>
  );
}

export default QRScanner;
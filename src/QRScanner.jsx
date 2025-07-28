import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const QR_READER_ID = "qr-code-reader";

function QRScanner({ onScan }) {
  const scannerRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const lastResultRef = useRef(null);
  const isProcessingRef = useRef(false);

  useEffect(() => {
    if (!isCameraOn) return;

    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode(QR_READER_ID);
    }
    const html5QrCode = scannerRef.current;

    const config = { fps: 10, qrbox: { width: 250, height: 250 } };

    const onScanSuccess = (decodedText) => {
      // Ignore duplicates
      if (decodedText === lastResultRef.current) return;

      if (isProcessingRef.current) return;
      isProcessingRef.current = true;

      lastResultRef.current = decodedText;
      onScan(decodedText);
      console.log(`Scan successful: ${decodedText}`);

      // Reset after short cooldown
      setTimeout(() => {
        isProcessingRef.current = false;
      }, 1000); // 1s cooldown
    };

    const onScanError = () => {
      // do nothing, library calls this often
    };

    html5QrCode.start(
      { facingMode: "environment" },
      config,
      onScanSuccess,
      onScanError
    ).catch((err) => {
      console.error("Unable to start scanning.", err);
      setIsCameraOn(false);
    });

    return () => {
      if (html5QrCode.isScanning) {
        html5QrCode.stop().then(() => {
          html5QrCode.clear();
          console.log("QR scanning stopped.");
        }).catch(err => console.error("Failed to stop scanning.", err));
      }
    };
  }, [isCameraOn, onScan]);

  const handleToggleCamera = () => {
    setIsCameraOn(prev => !prev);
    isProcessingRef.current = false;
    lastResultRef.current = null;
  };

  return (
    <div>
      <button onClick={handleToggleCamera}>
        {isCameraOn ? 'Stop Scanning' : 'Start Scanning'}
      </button>
      <div
        id={QR_READER_ID}
        style={{ width: '100%', maxWidth: '500px', marginTop: '10px' }}
      ></div>
    </div>
  );
}

export default QRScanner;

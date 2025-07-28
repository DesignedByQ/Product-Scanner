import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const QR_READER_ID = "qr-code-reader";

function QRScanner({ onScan }) {
  const scannerRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const processingRef = useRef(false); // useRef instead of state

  useEffect(() => {
    if (!isCameraOn) return;

    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode(QR_READER_ID);
    }
    const html5QrCode = scannerRef.current;

    const config = { fps: 10, qrbox: { width: 250, height: 250 } };

    const onScanSuccess = (decodedText) => {
      if (processingRef.current) return;

      processingRef.current = true;
      onScan(decodedText);
      console.log(`Scan successful: ${decodedText}`);

      setTimeout(() => {
        processingRef.current = false;
      }, 2000);
    };

    const onScanError = (err) => {
      // Optionally log errors
    };

    html5QrCode.start({ facingMode: "environment" }, config, onScanSuccess, onScanError)
      .catch((err) => {
        console.error("Unable to start scanning.", err);
        setIsCameraOn(false);
      });

    return () => {
      if (html5QrCode.isScanning) {
        html5QrCode.stop().then(() => {
          html5QrCode.clear(); // Important: clears the video feed
          console.log("QR Code scanning stopped.");
        }).catch(err => console.error("Failed to stop scanning.", err));
      }
    };
  }, [isCameraOn, onScan]); // removed isProcessing

  const handleToggleCamera = () => {
    setIsCameraOn(prev => !prev);
    processingRef.current = false;
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

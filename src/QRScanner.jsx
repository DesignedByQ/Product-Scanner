import React, { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

function QRScanner({ onScan }) {
  const scannerRef = useRef(null); // Store the scanner instance
  const isScanning = useRef(false); // Track scanning state

  useEffect(() => {
    const startScanner = async () => {
      if (!isScanning.current) {
        const html5QrCode = new Html5Qrcode('qr-scanner');
        scannerRef.current = html5QrCode;

        try {
          await html5QrCode.start(
            { facingMode: 'environment' }, // Use back camera
            {
              fps: 10,
              qrbox: { width: 250, height: 250 },
            },
            (decodedText) => {
              onScan(decodedText); // Pass decoded text to parent
            },
            (errorMessage) => {
              console.error('QR scan error:', errorMessage);
            }
          );
          isScanning.current = true;
        } catch (error) {
          console.error('Camera start failed:', error);
        }
      }
    };

    startScanner();

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch((err) => console.error('Stop error:', err));
      }
    };
  }, [onScan]);

  return <div id="qr-scanner"></div>;
}

export default QRScanner;

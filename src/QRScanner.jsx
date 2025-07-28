import React, { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

function QRScanner({ onScan }) {
  const scannerRef = useRef(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('qr-scanner', {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    });

    scanner.render(
      (decodedText) => {
        onScan(decodedText);
      },
      (errorMessage) => {
        console.error('QR scan error:', errorMessage);
      }
    );

    scannerRef.current = scanner;
    return () => {
      scanner.clear();
    };
  }, [onScan]);

  return <div id="qr-scanner"></div>;
}

export default QRScanner;
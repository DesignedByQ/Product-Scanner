import React, { useEffect, useRef } from 'react';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';

function QRScanner({ onScan }) {
  const scannerRef = useRef(null);
  const html5QrCode = useRef(null);

  useEffect(() => {
    html5QrCode.current = new Html5Qrcode("qr-scanner");

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

  const startCamera = () => {
    html5QrCode.current.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      (decodedText) => {
        onScan(decodedText);
      }
    ).catch(err => console.error("Camera start error: ", err));
  };

  const stopCamera = () => {
    html5QrCode.current.stop().catch(err => console.error("Camera stop error: ", err));
  };

  return (
    <div>
      <div id="qr-scanner"></div>
    </div>
  );
}

export default QRScanner;

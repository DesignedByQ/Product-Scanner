import React, { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

function QRScanner({ onScan }) {
  const scannerRef = useRef(null);

  useEffect(() => {
    const html5QrCode = new Html5Qrcode('qr-scanner');
    scannerRef.current = html5QrCode;

    const startScanner = async () => {
      try {
        await html5QrCode.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            onScan(decodedText); // Handle scanned text

            // Pause and restart to allow continuous scanning
            html5QrCode.pause();
            setTimeout(() => {
              html5QrCode.resume().catch((err) => {
                console.error('Resume failed:', err);
              });
            }, 500); // Adjust delay for smoother scanning
          },
          (errorMessage) => {
            console.error('QR scan error:', errorMessage);
          }
        );
      } catch (err) {
        console.error('Camera start failed:', err);
      }
    };

    startScanner();

    return () => {
      html5QrCode.stop().catch((err) => {
        console.error('Stop failed:', err);
      });
    };
  }, [onScan]);

  return <div id="qr-scanner"></div>;
}

export default QRScanner;

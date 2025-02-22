import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

function QRScanner({ onScan }) {
  const html5QrCode = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);

  useEffect(() => {
    html5QrCode.current = new Html5Qrcode("qr-scanner");
    return () => {
      // Cleanup on component unmount
      if (cameraActive) {
        html5QrCode.current.stop().catch(err => console.error("Camera stop error: ", err));
      }
    };
  }, [cameraActive]);

  const startCamera = () => {
    html5QrCode.current
      .start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          onScan(decodedText);
        },
        (errorMessage) => {
          console.error('QR scan error:', errorMessage);
        }
      )
      .then(() => {
        setCameraActive(true);
      })
      .catch(err => console.error("Camera start error: ", err));
  };

  const stopCamera = () => {
    html5QrCode.current
      .stop()
      .then(() => {
        setCameraActive(false);
      })
      .catch(err => console.error("Camera stop error: ", err));
  };

  return (
    <div>
      <div id="qr-scanner"></div>
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

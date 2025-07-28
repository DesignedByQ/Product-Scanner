import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

const QR_READER_ID = "qr-code-reader";

function QRScanner({ onScan }) {
  const scannerRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);

  useEffect(() => {
    if (!isCameraOn) return;

    const html5QrCode = new Html5Qrcode(QR_READER_ID);
    scannerRef.current = html5QrCode;

    const config = { fps: 10, qrbox: { width: 250, height: 250 } };

    const onScanSuccess = (decodedText) => {
      console.log("Decoded text:", decodedText);
      onScan(decodedText);
    };

    const onScanError = (err) => {
      // You can log errors if needed
    };

    // Delay ensures the <div> is mounted
    setTimeout(() => {
      html5QrCode.start({ facingMode: "environment" }, config, onScanSuccess, onScanError)
        .catch(err => {
          console.error("Camera start failed:", err);
          setIsCameraOn(false);
        });
    }, 200);

    return () => {
      if (html5QrCode.isScanning) {
        html5QrCode.stop().then(() => {
          html5QrCode.clear();
        });
      }
    };
  }, [isCameraOn, onScan]);

  return (
    <div>
      <button onClick={() => setIsCameraOn(prev => !prev)}>
        {isCameraOn ? "Stop Scanning" : "Start Scanning"}
      </button>
      <div
        id={QR_READER_ID}
        style={{ width: "100%", maxWidth: "500px", marginTop: "10px" }}
      ></div>
    </div>
  );
}

export default QRScanner;

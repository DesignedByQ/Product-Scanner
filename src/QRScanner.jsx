import React, { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

function QRScanner({ onScan }) {
  const scannerRef = useRef(null);
  const isScanning = useRef(false);

  useEffect(() => {
    const html5QrCode = new Html5Qrcode("qr-scanner");
    scannerRef.current = html5QrCode;

    const startScanner = async () => {
      if (!isScanning.current) {
        try {
          await html5QrCode.start(
            { facingMode: "environment" }, // back camera
            {
              fps: 10,
              qrbox: { width: 250, height: 250 },
            },
            (decodedText) => {
              onScan(decodedText);

              // For continuous scanning: pause, then resume after delay
              html5QrCode.pause();
              setTimeout(() => {
                html5QrCode.resume().catch((err) => {
                  console.error("Resume failed:", err);
                });
              }, 500); // adjust delay as needed
            },
            (errorMessage) => {
              console.warn("QR scan error:", errorMessage);
            }
          );
          isScanning.current = true;
        } catch (error) {
          console.error("Camera start failed:", error);
        }
      }
    };

    startScanner();

    return () => {
      if (scannerRef.current && isScanning.current) {
        scannerRef.current
          .stop()
          .then(() => {
            scannerRef.current.clear();
            isScanning.current = false;
            console.log("QR scanner stopped cleanly.");
          })
          .catch((err) => console.error("Stop error:", err));
      }
    };
  }, [onScan]);

  return (
    <div
      id="qr-scanner"
      style={{ width: "100%", maxWidth: "500px", marginTop: "10px" }}
    ></div>
  );
}

export default QRScanner;

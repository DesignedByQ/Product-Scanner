import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

function QRScanner({ onScan }) {

  //const [scanResult, setScanResult] = useState(null);

  useEffect(() => {

    const scanner = new Html5QrcodeScanner(
    "qr-scanner", {
      qrbox: { width: 250, height: 250 },
      rememberLastUsedCamera: true,
      fps: 5,
    });

    function success(decodedText) {
      // Pass scanned data to parent
      if (onScan) {
        onScan(decodedText);
      }

            // Instead of clearing, just pause & resume after 1s
      scanner.pause();
      setTimeout(() => {
        scanner.resume().catch((err) => console.error("Resume failed:", err));
      }, 1000);

    }

  function error(err) {
    console.warn("QR Code scan error: ", err);
  }

  scanner.render(success, error);

  }, [])

    return <div id="qr-scanner"></div>;
}
 
  
export default QRScanner;
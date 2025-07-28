import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

function QRScanner({ onScan }) {

  useEffect(() => {

    const scanner = new Html5QrcodeScanner(
    "qr-scanner", {
      qrbox: { width: 250, height: 250 },
      rememberLastUsedCamera: true,
      fps: 5,
    });

    scanner.render(success, error);

    function success(decodedText) {
      // Pass scanned data to parent
      if (onScan) {
        onScan(decodedText);
      }
    }

  function error(err) {
    console.warn("QR Code scan error: ", err);
  }
 
  }, [])

    return <div id="qr-scanner"></div>;
}
 
  
export default QRScanner;
import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

function QRScanner({ onScan }) {

  const [scanResult, setScanResult] = useState(null);

  useEffect(() => {

        const scanner = new Html5QrcodeScanner(
    "qr-scanner", {
      qrbox: { width: 250, height: 250 },
      rememberLastUsedCamera: true,
      fps: 5,
  });

    scanner.render(success, error);

  function success(result) {
    //scanner.clear();
    setScanResult(result);
    console.log("QR Code scan result: ", result);
    console.log("QR Code scan result: ", scanResult);
    if (onScan) {
      onScan(result); // Pass scanned data to parent (App)
    }
  }

  function error(err) {
    console.warn("QR Code scan error: ", err);
  }
    return () => {
      scanner.clear(); // Clear the scanner when component unmounts
    };
  }, [])

    return <div id="qr-scanner"></div>;
}
 
  
export default QRScanner;
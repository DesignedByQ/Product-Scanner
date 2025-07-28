import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

function QRScanner({ onScan }) {

  const [scanResult, setScanResult] = useState(null);

  useEffect(() => {

    const scanner = new Html5QrcodeScanner(
    "qr-scanner", {
      qrbox: { width: 250, height: 250 },
      //rememberLastUsedCamera: true,
      fps: 2,
  });

  scanner.render(success, error);
  
  function success(result) {
    scanner.clear();
    setScanResult(result);
  }

  function error(err) {
    console.warn("QR Code scan error: ", err);
  }

  //console.log(scanResult)

  }, [])

    return <div id="qr-scanner"></div>;
}
 
  
export default QRScanner;
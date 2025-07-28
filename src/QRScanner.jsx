import { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

function QRScanner({ onScan }) {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-scanner",
      {
        qrbox: { width: 250, height: 250 },
        rememberLastUsedCamera: true,
        fps: 5, // bump fps for smoother scanning
      },
      false // verbose logging off
    );

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
      // Ignore not-found errors (they happen frequently)
      // console.warn("QR scan error: ", err);
    }

    scanner.render(success, error);

    // Cleanup when component unmounts
    return () => {
      scanner.clear().catch((err) => console.error("Scanner clear failed:", err));
    };
  }, [onScan]);

  return <div id="qr-scanner"></div>;
}

export default QRScanner;

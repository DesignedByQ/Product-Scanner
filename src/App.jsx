import React, { useState, useRef, useEffect } from 'react';
import './Styles.css';
import QRScanner from './QRScanner'; 

function App() {
  const [exProd] = useState([
    { id: '1', name: 'Scrub', qty: 0, price: 18000 },
    { id: '2', name: 'Face Wash', qty: 0, price: 20000 },
    { id: '3', name: 'Perfume', qty: 0, price: 30000 },
  ]);
  const [scannedProducts, setScannedProducts] = useState([]);
  const [manualProductId, setManualProductId] = useState('');
  const [manualQty, setManualQty] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');

  // Add useRef for the QRScanner component
  const qrScannerRef = useRef(null);

  // Function to handle when an input field is focused
  const handleFocus = () => {
    qrScannerRef.current.stopCamera();
  };

  // Function to handle when an input field loses focus
  const handleBlur = () => {
    qrScannerRef.current.startCamera();
  };

  useEffect(() => {
    // Get all input fields and add event listeners
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
      input.addEventListener('focus', handleFocus);
      input.addEventListener('blur', handleBlur);
    });

    // Cleanup event listeners on unmount
    return () => {
      inputs.forEach(input => {
        input.removeEventListener('focus', handleFocus);
        input.removeEventListener('blur', handleBlur);
      });
    };
  }, []);

//add a fall back to send from FE as an email if BE fails
  const handleScan = (data) => {
    if (data) {
      console.log("Data scanned: ", data);
      addToCart(data, 1);
    }
  };
  
  const addToCart = (scannedData, qty) => {
    try {
      // Parse the JSON string into an object
      const parsedData = JSON.parse(scannedData);
  
      // Confirm the structure of parsedData
      console.log('Parsed Data:', parsedData);
  
      // Check if the product exists in the inventory
      const productToAdd = exProd.find(
        (product) => product.id === parsedData.id
      );
  
      if (productToAdd) {
        // Check if it's already in the cart
        const existingCartProduct = scannedProducts.find(
          (product) => product.id === productToAdd.id
        );
  
        if (existingCartProduct) {
          // Create a new array with updated quantity
          const updatedProducts = scannedProducts.map((product) =>
            product.id === productToAdd.id
              ? { ...product, qty: product.qty + qty }
              : product
          );
          setScannedProducts(updatedProducts);
        } else {
          // If not in cart, add it with the initial quantity
          setScannedProducts([
            ...scannedProducts,
            {
              id: parsedData.id,
              name: parsedData.name,
              qty,
              price: parsedData.price,
            },
          ]);
        }
  
        // ✅ Allow for continuous scanning by temporarily disabling and re-enabling
        setTimeout(() => {
          console.log('Ready for next scan');
        }, 1000); // Adjust delay as needed
      } else {
        alert('Product not found');
        console.error('Product not found');
      }
    } catch (error) {
      alert('Invalid JSON scanned:', error);
      console.error('Invalid JSON scanned:', error);
    }
  }; 
  
  const manualAddToCart = (id, qty) => {
    // Check if the product exists in the inventory
    const productToAdd = exProd.find((product) => product.id === id);
  
    if (productToAdd) {
      // Check if it's already in the cart
      const existingCartProduct = scannedProducts.find(
        (product) => product.id === id
      );
  
      if (existingCartProduct) {
        // If it's already in the cart, update the quantity
        const updatedProducts = scannedProducts.map((product) =>
          product.id === id
            ? { ...product, qty: product.qty + qty }
            : product
        );
        setScannedProducts(updatedProducts);
      } else {
        // If not in cart, add it with the initial quantity
        setScannedProducts([
          ...scannedProducts,
          {
            id: productToAdd.id,
            name: productToAdd.name,
            qty,
            price: productToAdd.price,
          },
        ]);
      }
    } else {
      alert('Product not found in inventory');
    }
  };
  
  const handleManualAdd = (e) => {
    e.preventDefault(); // Prevents page reload
    if (manualProductId && manualQty > 0) {
      manualAddToCart(manualProductId, parseInt(manualQty));
      setManualProductId('');
      setManualQty(1);
    }
  };
  
  const calculateTotal = () => {
    return scannedProducts.reduce(
      (total, product) => total + product.qty * product.price,
      0
    );
  };

  const handleBuy = (e) => {
    e.preventDefault(); // Prevents page reload
    alert(`Purchase Successful! Total: ${calculateTotal()} TZS`);
    setScannedProducts([]);
    setPhoneNumber('');
  };

  const handleDelete = (index) => {
    const newProducts = [...scannedProducts];
    newProducts.splice(index, 1);
    setScannedProducts(newProducts);
  };

  // const handleFormSubmit = (e) => {
  //   e.preventDefault(); // Prevents page reload
  // };  

  return (
    <div className="container">
      
      <h1>
        <span className="brand-name">ELIXIR</span> <br />
        <span className="brand-subtitle">cosmetics</span>
      </h1>
      <h2>Scan the QR code of each item!</h2>
      <h3>Changanua msimbo wa QR wa kila kitu!</h3>

      <div className="qr-scanner-window">
      <h1>QR Code Scanner</h1>
      <QRScanner ref={qrScannerRef} onScan={handleScan} />
      </div>

      <div className="manual-input">
      
        <h3>Manual input</h3>
        <input
          type="text"
          placeholder="Product ID"
          value={manualProductId}
          onChange={(e) => setManualProductId(e.target.value)}
        />
        <input
          type="number"
          placeholder="Qty"
          value={manualQty}
          onChange={(e) => setManualQty(e.target.value)}
        />
        
        <button onClick={handleManualAdd}>Add to cart</button>
      </div>
      

      <h2>Cart</h2>
      <table className="cart-table">
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Name</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Undo</th>
          </tr>
        </thead>
        <tbody>
          {scannedProducts.map((item, index) => (
            <tr key={index}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.qty}</td>
              <td>{item.price}</td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(index)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="total-cost">Total Cost: {calculateTotal()} TZS</h3>

      <div className="manual-input">
      
        <label>Customers Phone No. </label>
        <input
          type="text"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        
      </div>

      <div>
        <button className="buy" onClick={handleBuy}>Buy</button>
      </div>
     
    </div>
    
  );
}

export default App;

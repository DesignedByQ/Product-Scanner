import React, { useState } from 'react';
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

//add a fall back to send from FE as an email if BE fails
  const handleScan = (data) => {
    if (data) {
      console.log("Data scanned: ", data);
      addToCart(data, 1);
    }
  };

  // const addToCart = (productId, qty) => {
  //   // Check if the product exists in the inventory
  //   const productToAdd = exProd.find((product) => product.id === productId);
  
  //   if (productToAdd) {
  //     // Check if it's already in the cart
  //     const existingProduct = scannedProducts.find(
  //       (product) => product.id === productId
  //     );
  
  //     if (existingProduct) {
  //       // Create a new array with updated quantity
  //       const updatedProducts = scannedProducts.map((product) =>
  //         product.id === productId
  //           ? { ...product, qty: product.qty + qty }
  //           : product
  //       );
  //       setScannedProducts(updatedProducts);
  //     } else {
  //       // If not in cart, add it with the initial quantity
  //       setScannedProducts([
  //         ...scannedProducts,
  //         { id: productToAdd.id, name: productToAdd.name, qty: qty, price: productToAdd.price },
  //       ]);
  //     }
  //   } else {
  //     console.error('Product not found');
  //   }
  // };
  
  const addToCart = (scannedData, qty) => {
    const existingCartProduct = exProd.find(
      (product) => product.id === scannedData.id
    );
 
    if (existingCartProduct) {
      existingCartProduct.qty += qty;
      setScannedProducts([...scannedProducts]);
    } else {
      //console.error('Product not found');
      setScannedProducts([
        ...scannedProducts,
        { id: scannedData.id, name: scannedData.name, qty, price: scannedData.price },
      ]);
    }
  };

  const handleManualAdd = () => {
    if (manualProductId && manualQty > 0) {
      addToCart(manualProductId, parseInt(manualQty));
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

  const handleBuy = () => {
    alert(`Purchase Successful! Total: ${calculateTotal()} TZS`);
    setScannedProducts([]);
    setPhoneNumber('');
  };

  const handleDelete = (index) => {
    const newProducts = [...scannedProducts];
    newProducts.splice(index, 1);
    setScannedProducts(newProducts);
  };

  return (
    <div className="container">
      <h1>
        <span className="brand-name">ELIXIR</span> <br />
        <span className="brand-subtitle">cosmetics</span>
      </h1>
      <h2>Scan the QR code of each item!</h2>
      <h3>Changanua msimbo wa QR wa kila kitu!</h3>

      {/* <div className="qr-scanner-window">
 
      </div> */}

      <div className="qr-scanner-window">
      <h1>QR Code Scanner</h1>
      <QRScanner onScan={handleScan} />
      <h2>Scanned Products</h2>
      <ul>
        {scannedProducts.map((item, index) => (
          <li key={index}>{item.id} {item.product} - Qty: {item.qty}</li>
        ))}
      </ul>
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

      <div>
        <label>Customers Phone No.</label>
        <input
          type="text"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </div>
      <button className="buy" onClick={handleBuy}>Buy</button>
    </div>
  );
}

export default App;

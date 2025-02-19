import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';  // Use this import for QR Reader
import './Styles.css';

function App() {
  const [scannedProducts, setScannedProducts] = useState([]);
  const [manualProductId, setManualProductId] = useState('');
  const [manualQty, setManualQty] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleScan = (data) => {
    if (data) {
      addToCart(data, 1);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  const addToCart = (productId, qty) => {
    const existingProduct = scannedProducts.find(
      (product) => product.id === productId
    );

    if (existingProduct) {
      existingProduct.qty += qty;
      setScannedProducts([...scannedProducts]);
    } else {
      setScannedProducts([
        ...scannedProducts,
        { id: productId, name: `Product ${productId}`, qty, price: 10000 },
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

      <div className="qr-scanner-window">
        <QrReader
          delay={300}
          onError={handleError}
          onResult={(result, error) => {
            if (result) {
              handleScan(result?.text);
            }
            if (error) {
              console.error(error);
            }
          }}
          style={{ width: '100%' }}
        />
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

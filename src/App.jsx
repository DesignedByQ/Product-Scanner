import React, { useState } from 'react';
import './Styles.css';
import QRScanner from './QRScanner'; 

function App() {
  const [exProd] = useState([
    { prod_id: '1', name: 'Scrub', qty: 0, act_ingredient: 'Coffee', millilitres: 300, brand: 'Brembo', price: 18000 },
    { prod_id: '2', name: 'Face Wash', qty: 0, act_ingredient: 'Tea Tree', millilitres: 250, brand: 'Elixir', price: 20000 },
    { prod_id: '3', name: 'Perfume', qty: 0, act_ingredient: 'Fragrance Oil', millilitres: 150, brand: 'Elixir', price: 30000 },
    //{ prod_id: '3', name: 'Perfume', qty: 0, act_ingredient: 'Fragrance Oil', millilitres: 150, brand: 'Elixir', price: 30000 },
  ]);
  const [errorMessage, setErrorMessage] = useState('');
  const [scannedProducts, setScannedProducts] = useState([]);
  const [manualProductId, setManualProductId] = useState('');
  const [manualQty, setManualQty] = useState(1);
  const [customer, setCustomer] = useState({
    phone: "", 
    name: "", 
    email: "",
    area: "" 
  });
  const [delivery, setDelivery] = useState('N');
  const [payment, setPayment] = useState('Cash');
  const [location, setLocation] = useState('Sinza');
  const [discount, setDiscount] = useState(0);

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
        (product) => product.prod_id === parsedData.prod_id
      );
  
      if (productToAdd) {
        // Check if it's already in the cart
        const existingCartProduct = scannedProducts.find(
          (product) => product.prod_id === productToAdd.prod_id
        );
  
        if (existingCartProduct) {
          // Create a new array with updated quantity
          const updatedProducts = scannedProducts.map((product) =>
            product.prod_id === productToAdd.prod_id
              ? { ...product, qty: product.qty + qty }
              : product
          );
          setScannedProducts(updatedProducts);
        } else {
          // If not in cart, add it with the initial quantity
          setScannedProducts([
            ...scannedProducts,
            {
              prod_id: parsedData.prod_id,
              name: parsedData.name,
              qty,
              price: parsedData.price,
              act_ingredient: parsedData.act_ingredient,
              millilitres: parsedData.millilitres,
              brand: parsedData.brand,
            },
          ]);
        }
  
        // ✅ Allow for continuous scanning by temporarily disabling and re-enabling
        setTimeout(() => {
          console.log('Ready for next scan');
        }, 1000); // Adjust delay as needed
      } else {
        console.error('Product not found');
      }
    } catch (error) {
      console.error('Invalid JSON scanned:', error);
    }
  }; 
  
  const manualAddToCart = (prod_id, qty) => {
    // Check if the product exists in the inventory
    const productToAdd = exProd.find((product) => product.prod_id === prod_id);
  
    if (productToAdd) {
      // Check if it's already in the cart
      const existingCartProduct = scannedProducts.find(
        (product) => product.prod_id === prod_id
      );
  
      if (existingCartProduct) {
        // If it's already in the cart, update the quantity
        const updatedProducts = scannedProducts.map((product) =>
          product.prod_id === prod_id
            ? { ...product, qty: product.qty + qty }
            : product
        );
        setScannedProducts(updatedProducts);
      } else {
        // If not in cart, add it with the initial quantity
        setScannedProducts([
          ...scannedProducts,
          {
            prod_id: productToAdd.prod_id,
            name: productToAdd.name,
            qty,
            price: productToAdd.price,
            act_ingredient: productToAdd.act_ingredient,
            millilitres: productToAdd.millilitres,
            brand: productToAdd.brand,
          },
        ]);
      }
    } else {
      alert('Product not found in inventory');
      console.error('Product not found');
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
      (total, product) => total + (product.qty * product.price) - (product.qty * product.price * discount / 100),
      0
    );
  };

  const convertJsonToCsv = (data) => {
    // Define the CSV headers
    const headers = ['Phone', 'Product ID', 'Product Name', 'Quantity', 'Price', 'Total Cost'];
    //console.log('Data:', data.products.map(product =>product.name));
    // Map JSON to CSV rows
    const rows = data.products.map(product => [
      data.customer.phone,
      product.prod_id,
      product.name,
      product.qty,
      product.price,
      data.total,
      data.delivery,
      data.payment,
      data.location,
      data.discount
    ]);
  
    // Combine headers and rows
    const csvContent = [
      headers.join(','), 
      ...rows.map(row => row.join(','))
    ].join('\n');
  
    return csvContent;
  };  

  const handleBuy = async (e) => {
    e.preventDefault(); // Prevents page reload
  
    const purchaseData = {
      customer: customer,
      products: scannedProducts,
      total: calculateTotal(),//.toString(), // Ensure it's a string
      delivery: delivery,
      payment: payment,
      date: new Date().toISOString(),
      location: location,
      discount: parseInt(discount)
    };

    console.log('Purchase Data:', purchaseData);

    // The regex checks for a Tanzanian phone number starting with '0' followed by 9 digits
    // Example: 0751234567
    const phoneRegex = /^0[0-9]{9}$/;

    // Check if the input matches the required format
    if (phoneRegex.test(customer.phone)) {

  // http://localhost:2000/brownskincosmetics/scanner
      try {
        const response = await fetch('https://product-scanner-be-production.up.railway.app/brownskincosmetics/scanner', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(purchaseData),
        });
    
        if (!response.ok) {

          throw new Error('Network response was not ok');

        }
    
        const data = await response.json();
        console.log('Success:', data);
        setErrorMessage('');
        alert(`Purchase Successful! Total: ${calculateTotal()} TZS`);
    
        // Clear the form after a successful purchase
        setScannedProducts([]);
        setCustomer({
          phone: "", 
          name: "", 
          email: "",
          area: "" 
        });
    
      } catch (error) {
        // Convert JSON to CSV
        const csvData = convertJsonToCsv(purchaseData);

        // Create a Blob and download the file
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('href', url);
        const filename = `purchase_${Date.now()}.csv`;
        a.setAttribute('download', filename);
        a.click();

        console.error('Error:', error);

        alert(`Purchase details failed to send but has been saved to your phone as ${filename}.Please send this to Majna via WhatsApp or email.`);
      }

    }
    else {
      setErrorMessage("Invalid phone number format. Please enter a valid phone number");
      console.error(errorMessage);
      alert('Invalid phone number. Please enter a valid phone number');
    }
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
      <h1>QR Code Scanner</h1>
      <QRScanner onScan={handleScan} />
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
              <td>{item.prod_id}</td>
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
          value={customer.phone}
          onChange={(e) =>
            setCustomer((prevCustomer) => ({
              ...prevCustomer,
              phone: e.target.value
            }))
          }
        />
      </div>
      {errorMessage && <p className='errorMsg'>{errorMessage}</p>}

      <div className="manual-input">
        <label>Delivery Option: </label>
        <select
          value={delivery}
          onChange={(e) => setDelivery(e.target.value)}
        >
          <option value="N">Shop</option>
          <option value="Y">Boda</option>
        </select>
      </div>
      
      <div className="manual-input">
        <label>Payment Option: </label>
        <select
          value={payment}
          onChange={(e) => setPayment(e.target.value)}
        >
          <option value="Cash">Cash</option>
          <option value="Mpesa">Mpesa</option>
        </select>
      </div>

      <div className="manual-input">
        <label>Location Option: </label>
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        >
          <option value="Sinza">Sinza</option>
          <option value="TBC">TBC</option>
        </select>
      </div>

      <div className="manual-input">
        <label>Discount Option: </label>
        <select
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
        >
          <option value="0">0</option>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>

      <div>
        <button className="buy" onClick={handleBuy}>Buy</button>
      </div>
     
    </div>
    
  );
}

export default App;

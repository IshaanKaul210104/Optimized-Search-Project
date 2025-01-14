import "./App.css";
import React, { useState, useEffect } from "react";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Cart from "./components/Cart";
import AddProduct from "./components/AddProduct";
import Product from "./components/Product";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./Context/Context";
import UpdateProduct from "./components/UpdateProduct";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import axios from "./axios"; // Ensure correct axios setup

function App() {
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [data, setData] = useState([]); // Store products globally

  // Refresh data from backend
  const refreshData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/products");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Fetch data on app load
  useEffect(() => {
    refreshData();
  }, []);

  // Handle category selection from Navbar
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    console.log("Selected category:", category);
  };

  // Add product to cart
  const addToCart = (product) => {
    const existingProduct = cart.find((item) => item.id === product.id);
    if (existingProduct) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // Remove product from cart
  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  return (
    <AppProvider
      value={{
        data,
        cart,
        addToCart,
        removeFromCart,
        refreshData,
      }}
    >
      <BrowserRouter>
        <Navbar onSelectCategory={handleCategorySelect} />
        <Routes>
          <Route
            path="/"
            element={
              <Home
                addToCart={addToCart}
                selectedCategory={selectedCategory}
              />
            }
          />
          <Route path="/add_product" element={<AddProduct />} />
          <Route path="/products/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/products/update/:id" element={<UpdateProduct />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;

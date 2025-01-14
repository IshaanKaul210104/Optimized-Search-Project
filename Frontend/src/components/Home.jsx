import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../axios";
import AppContext from "../Context/Context";
import unplugged from "../assets/unplugged.png";

const Home = ({ selectedCategory }) => {
  const { data, isError, addToCart, refreshData } = useContext(AppContext);
  const [products, setProducts] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);

  // Fetch data and refresh once
  useEffect(() => {
    if (!isDataFetched) {
      const fetchData = async () => {
        try {
          await refreshData(); // Ensure data is refreshed
          setIsDataFetched(true); // Mark data as fetched
        } catch (error) {
          console.error("Error refreshing data:", error);
        }
      };
      fetchData();
    }
  }, [refreshData, isDataFetched]);

  // Fetch product images when data changes
  useEffect(() => {
    if (data?.length > 0) {
      const fetchImagesAndUpdateProducts = async () => {
        try {
          const updatedProducts = await Promise.all(
            data.map(async (product) => {
              try {
                const response = await axios.get(
                  `http://localhost:8080/api/products/${product.id}/image`,
                  { responseType: "blob" }
                );
                const imageUrl = URL.createObjectURL(response.data);
                return { ...product, imageUrl };
              } catch (error) {
                console.error("Error fetching image for product ID:", product.id, error);
                return { ...product, imageUrl: unplugged }; // Fallback to unplugged.png for image errors
              }
            })
          );
          setProducts(updatedProducts);
        } catch (error) {
          console.error("Error updating products with images:", error);
        }
      };
      fetchImagesAndUpdateProducts();
    }
  }, [data]);

  // Filter products by selected category
  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  // Render error message
  if (isError || products.length === 0) {
    return (
      <div className="error-message" style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>Error fetching products or no products available.</h2>
        <img src={unplugged} alt="Error" style={{ width: "150px", height: "150px", objectFit: "contain" }} />
      </div>
    );
  }

  // Render products
  return (
    <div
      className="grid"
      style={{
        marginTop: "64px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "20px",
        padding: "20px",
      }}
    >
      {filteredProducts.map((product) => {
        const { id, brand, name, price, productAvailable, imageUrl } = product;

        return (
          <div
            className="card mb-3"
            key={id}
            style={{
              width: "250px",
              height: "360px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              borderRadius: "10px",
              overflow: "hidden",
              backgroundColor: productAvailable ? "#fff" : "#f7f7f7",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Link
              to={`/products/${id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <img
                src={imageUrl}
                alt={name}
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "10px 10px 0 0",
                }}
              />
            </Link>
            <div
              className="card-body"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "10px",
              }}
            >
              <div>
                <h5 style={{ fontSize: "1.2rem", marginBottom: "5px" }}>
                  {name.toUpperCase()}
                </h5>
                <p style={{ fontStyle: "italic", fontSize: "0.9rem" }}>
                  ~ {brand}
                </p>
              </div>
              <div style={{ marginTop: "10px" }}>
                <h5 style={{ fontSize: "1.1rem", fontWeight: "600" }}>
                  <i className="bi bi-currency-rupee"></i>
                  {price}
                </h5>
              </div>
              <button
                className="btn-hover color-9"
                style={{
                  marginTop: "10px",
                  padding: "8px",
                  fontSize: "0.9rem",
                  borderRadius: "5px",
                  backgroundColor: productAvailable ? "#28a745" : "#ccc",
                  color: "#fff",
                  border: "none",
                  cursor: productAvailable ? "pointer" : "not-allowed",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  addToCart(product);
                }}
                disabled={!productAvailable}
              >
                {productAvailable ? "Add to Cart" : "Out of Stock"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Home;

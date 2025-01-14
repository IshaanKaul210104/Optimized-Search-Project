import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AppContext from "../Context/Context";
import axios from "../axios";

const Product = () => {
  const { id } = useParams();
  const { addToCart, removeFromCart, cart, refreshData } = useContext(AppContext);
  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch product details and image
  useEffect(() => {
    const fetchProductAndImage = async () => {
      try {
        // Fetch product details
        const productResponse = await axios.get(`http://localhost:8080/api/products/${id}`); // Added `/api`
        setProduct(productResponse.data);

        // Fetch product image
        if (productResponse.data.imageName) {
          const imageResponse = await axios.get(`http://localhost:8080/api/products/${id}/image`, { // Added `/api`
            responseType: "blob",
          });
          setImageUrl(URL.createObjectURL(imageResponse.data));
        } else {
          // Fallback to placeholder image
          setImageUrl("https://via.placeholder.com/300x300?text=No+Image");
        }
      } catch (error) {
        console.error("Error fetching product or image:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndImage();
  }, [id]);

  // Handle product deletion
  const deleteProduct = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/products/${id}`); // Added `/api`
      removeFromCart(id);
      alert("Product deleted successfully.");
      refreshData();
      navigate("/");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product. Please try again.");
    }
  };

  // Navigate to product update page
  const handleEditClick = () => navigate(`/products/update/${id}`);

  // Add product to cart
  const handleAddToCart = () => {
    addToCart(product);
    alert("Product added to cart.");
  };

  // Loading or error fallback
  if (loading) {
    return <h2 className="text-center" style={{ padding: "10rem" }}>Loading...</h2>;
  }

  if (!product) {
    return <h2 className="text-center" style={{ padding: "10rem" }}>Product not found.</h2>;
  }

  // Render the product details
  return (
    <div className="container" style={{ display: "flex", margin: "2rem auto" }}>
      {/* Product Image */}
      <img
        className="product-image"
        src={imageUrl}
        alt={product.imageName || "Product Image"}
        style={{ width: "50%", height: "auto", objectFit: "cover" }}
      />

      {/* Product Details */}
      <div className="product-details" style={{ width: "50%", padding: "0 1rem" }}>
        {/* Description Section */}
        <div className="product-description">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
            <span style={{ fontSize: "1.2rem", fontWeight: "lighter" }}>{product.category}</span>
            <h6>
              Listed:{" "}
              <span>
                <i>{new Date(product.releaseDate).toLocaleDateString()}</i>
              </span>
            </h6>
          </div>
          <h1 style={{ fontSize: "2rem", textTransform: "capitalize", letterSpacing: "1px" }}>
            {product.name}
          </h1>
          <i>{product.brand}</i>
          <p style={{ fontWeight: "bold", fontSize: "1rem", marginTop: "1rem" }}>PRODUCT DESCRIPTION:</p>
          <p>{product.description}</p>
        </div>

        {/* Price and Cart Actions */}
        <div className="product-price" style={{ margin: "1rem 0" }}>
          <span style={{ fontSize: "2rem", fontWeight: "bold" }}>${product.price}</span>
          <button
            className={`cart-btn ${!product.productAvailable ? "disabled-btn" : ""}`}
            onClick={handleAddToCart}
            disabled={!product.productAvailable}
            style={{
              padding: "1rem 2rem",
              fontSize: "1rem",
              backgroundColor: product.productAvailable ? "#007bff" : "#d3d3d3",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: product.productAvailable ? "pointer" : "not-allowed",
              marginBottom: "1rem",
              marginLeft: "1rem",
            }}
          >
            {product.productAvailable ? "Add to Cart" : "Out of Stock"}
          </button>
          <h6>
            Stock Available:{" "}
            <i style={{ color: "green", fontWeight: "bold" }}>{product.stockQuantity}</i>
          </h6>
        </div>

        {/* Action Buttons */}
        <div className="product-actions" style={{ display: "flex", gap: "1rem" }}>
          <button
            className="btn btn-primary"
            type="button"
            onClick={handleEditClick}
            style={{
              padding: "1rem 2rem",
              fontSize: "1rem",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Update
          </button>
          <button
            className="btn btn-danger"
            type="button"
            onClick={deleteProduct}
            style={{
              padding: "1rem 2rem",
              fontSize: "1rem",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;

import React, { useState, useContext } from "react";  //Hi
import axios from "../axios"; // Ensure you use the custom Axios instance
import AppContext from "../Context/Context"; // Import context

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    brand: "",
    description: "",
    price: "",
    category: "",
    stockQuantity: "",
    releaseDate: "",
    productAvailable: false,
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const { refreshData } = useContext(AppContext); // Get refreshData from context

  const categories = [
    "Laptop",
    "Headphone",
    "Mobile",
    "Electronics",
    "Toys",
    "Fashion",
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct({
      ...product,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    const allowedTypes = ["image/jpeg", "image/png"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!selectedFile) {
      alert("Please select an image file.");
      return;
    }

    if (!allowedTypes.includes(selectedFile.type)) {
      alert("Only JPG and PNG images are allowed.");
      return;
    }
    if (selectedFile.size > maxSize) {
      alert("File size should be less than 5MB.");
      return;
    }

    setImage(selectedFile);
  };

  const resetForm = () => {
    setProduct({
      name: "",
      brand: "",
      description: "",
      price: "",
      category: "",
      stockQuantity: "",
      releaseDate: "",
      productAvailable: false,
    });
    setImage(null);
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    if (!product.name || !product.brand || !product.category || !image) {
      alert("Please fill out all required fields and upload an image.");
      return;
    }

    if (product.price < 0 || product.stockQuantity < 0) {
      alert("Price and stock quantity must be non-negative.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("imageFile", image); // Add the image file
    formData.append("productJson", JSON.stringify(product)); // Add the product data as JSON

    try {
      const response = await axios.post("http://localhost:8080/api/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Product added successfully:", response.data);
      alert("Product added successfully!");
      refreshData(); // Trigger re-fetch of products
      resetForm();
    } catch (error) {
      console.error("Error adding product:", error.response?.data || error);
      alert(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="center-container">
        <h3 className="text-center mb-4">Add a New Product</h3>
        <form className="row g-3" onSubmit={submitHandler}>
          <div className="col-md-6">
            <label className="form-label">
              <h6>Name</h6>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Product Name"
              onChange={handleInputChange}
              value={product.name}
              name="name"
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">
              <h6>Brand</h6>
            </label>
            <input
              type="text"
              name="brand"
              className="form-control"
              placeholder="Enter Brand"
              value={product.brand}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-12">
            <label className="form-label">
              <h6>Description</h6>
            </label>
            <textarea
              className="form-control"
              placeholder="Add product description"
              value={product.description}
              name="description"
              onChange={handleInputChange}
              rows="3"
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">
              <h6>Price</h6>
            </label>
            <input
              type="number"
              className="form-control"
              placeholder="Eg: $1000"
              onChange={handleInputChange}
              value={product.price}
              name="price"
              min="0"
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">
              <h6>Category</h6>
            </label>
            <select
              className="form-select"
              value={product.category}
              onChange={handleInputChange}
              name="category"
              required
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label">
              <h6>Stock Quantity</h6>
            </label>
            <input
              type="number"
              className="form-control"
              placeholder="Stock Remaining"
              onChange={handleInputChange}
              value={product.stockQuantity}
              name="stockQuantity"
              min="0"
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">
              <h6>Release Date</h6>
            </label>
            <input
              type="date"
              className="form-control"
              value={product.releaseDate}
              name="releaseDate"
              onChange={handleInputChange}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">
              <h6>Image</h6>
            </label>
            <input
              className="form-control"
              type="file"
              onChange={handleImageChange}
              required
            />
          </div>
          <div className="col-12">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                name="productAvailable"
                id="productAvailable"
                checked={product.productAvailable}
                onChange={(e) =>
                  setProduct({ ...product, productAvailable: e.target.checked })
                }
              />
              <label className="form-check-label">Product Available</label>
            </div>
          </div>
          <div className="col-12">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;

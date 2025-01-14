import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = ({ onSelectCategory }) => {
  const getInitialTheme = () => localStorage.getItem("theme") || "light-theme";

  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [theme, setTheme] = useState(getInitialTheme());
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const handleChange = async (value) => {
    setInput(value);
    if (value.trim().length > 0) {
      setShowSearchResults(true);
      try {
        console.log("Searching for:", value); // Debugging line
        const response = await axios.get(
          `http://localhost:8080/api/products/search?keyword=${value}`
        );
        console.log("Search results:", response.data); // Debugging line
        setSearchResults(response.data);
        setNoResults(response.data.length === 0);
      } catch (error) {
        console.error("Error searching:", error);
        setSearchResults([]);
        setNoResults(true);
      }
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
      setNoResults(false);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    onSelectCategory(category);
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark-theme" ? "light-theme" : "dark-theme";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const categories = [
    "Laptop",
    "Headphone",
    "Mobile",
    "Electronics",
    "Toys",
    "Fashion",
  ];

  return (
    <header>
      <nav className="navbar navbar-expand-lg fixed-top">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/add_product">
                  Add Product
                </Link>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Categories
                </a>
                <ul className="dropdown-menu">
                  {categories.map((category) => (
                    <li key={category}>
                      <button
                        className="dropdown-item"
                        onClick={() => handleCategorySelect(category)}
                      >
                        {category}
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>

            <button className="theme-btn" onClick={toggleTheme}>
              {theme === "dark-theme" ? (
                <i className="bi bi-moon-fill"></i>
              ) : (
                <i className="bi bi-sun-fill"></i>
              )}
            </button>

            <div className="d-flex align-items-center cart">
              <Link to="/cart" className="nav-link text-dark">
                <i className="bi bi-cart me-2">Cart</i>
              </Link>

              <div className="search-bar position-relative">
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  value={input}
                  onChange={(e) => handleChange(e.target.value)}
                  onFocus={() => setShowSearchResults(true)}
                  onBlur={() => setTimeout(() => setShowSearchResults(false), 200)} // Delay to allow click on results
                />

                {showSearchResults && (
                  <ul
                    className="list-group position-absolute"
                    style={{ top: "100%", zIndex: 10, maxHeight: "200px", overflowY: "auto" }}
                  >
                    {searchResults.length > 0 ? (
                      searchResults.map((result) => (
                        <li key={result.id} className="list-group-item">
                          <Link
                            to={`/products/${result.id}`}
                            className="search-result-link"
                          >
                            {result.name}
                          </Link>
                        </li>
                      ))
                    ) : (
                      noResults && (
                        <li className="list-group-item">No Product with such Name</li>
                      )
                    )}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

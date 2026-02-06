import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "all", name: "All Products", icon: "fas fa-th-large" },
    { id: "traditional", name: "Traditional", icon: "fas fa-landmark" },
    { id: "modern", name: "Modern", icon: "fas fa-cube" },
    { id: "hanging", name: "Hanging", icon: "fas fa-anchor" },
    { id: "specialty", name: "Specialty", icon: "fas fa-gem" },
    { id: "miniature", name: "Miniature", icon: "fas fa-dot-circle" },
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("in_stock", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // Demo products
  const demoProducts = [
    {
      id: 1,
      name: "Classic Round Pot",
      category: "traditional",
      description:
        "Timeless design with a smooth finish, perfect for any plant.",
      image: "fas fa-circle",
      colors: ["Gray", "White", "Terracotta"],
      sizes: ["Small", "Medium", "Large"],
      price: 599,
      in_stock: true,
    },
    {
      id: 2,
      name: "Modern Square Pot",
      category: "modern",
      description: "Clean lines and geometric shape for modern gardens.",
      image: "fas fa-square",
      colors: ["Black", "White", "Concrete"],
      sizes: ["Medium", "Large", "Extra Large"],
      price: 799,
      in_stock: true,
    },
    {
      id: 3,
      name: "Hanging Basket",
      category: "hanging",
      description: "Beautiful hanging design to maximize vertical space.",
      image: "fas fa-basket-shopping",
      colors: ["Brown", "Gray", "White"],
      sizes: ["Medium", "Large"],
      price: 449,
      in_stock: true,
    },
    {
      id: 4,
      name: "Herb Garden Kit",
      category: "specialty",
      description: "Complete herb garden system with multiple compartments.",
      image: "fas fa-seedling",
      colors: ["Terracotta", "Gray"],
      sizes: ["Medium"],
      price: 999,
      in_stock: true,
    },
    {
      id: 5,
      name: "Tall Planter",
      category: "modern",
      description: "Elegant tall planters for statement plants.",
      image: "fas fa-arrow-up",
      colors: ["Black", "White", "Concrete"],
      sizes: ["Large", "Extra Large"],
      price: 1299,
      in_stock: true,
    },
    {
      id: 6,
      name: "Succulent Mini Pots",
      category: "miniature",
      description:
        "Adorable mini pots perfect for succulents and small plants.",
      image: "fas fa-leaf",
      colors: ["Multi-color", "Pastel"],
      sizes: ["Small"],
      price: 299,
      in_stock: true,
    },
    {
      id: 7,
      name: "Decorative Bowl",
      category: "traditional",
      description: "Shallow bowl perfect for succulents and arrangements.",
      image: "fas fa-circle",
      colors: ["White", "Terracotta", "Gray"],
      sizes: ["Small", "Medium"],
      price: 399,
      in_stock: true,
    },
    {
      id: 8,
      name: "Tiered Stand",
      category: "specialty",
      description: "Three-tier stand for displaying multiple plants.",
      image: "fas fa-layer-group",
      colors: ["Black", "White"],
      sizes: ["One Size"],
      price: 1899,
      in_stock: true,
    },
  ];

  const displayProducts =
    products.length > 0
      ? products.map((p) => ({
          ...p,
          image: p.image_url ? null : "fas fa-box",
          colors: [],
          sizes: [],
        }))
      : demoProducts;

  // Filter products
  const filteredProducts = displayProducts.filter((product) => {
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="hero-gradient text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-40 h-40 bg-white rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-10 left-20 w-60 h-60 bg-white rounded-full filter blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fadeInUp">
            Our Products
          </h1>
          <p className="text-xl text-blue-100 animate-fadeInUp animation-delay-200">
            Explore our collection of handcrafted cement pots
          </p>
        </div>
        {/* Wave Decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
          >
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="#f9fafb"
            />
          </svg>
        </div>
      </section>

      {/* Filter & Search Section */}
      <section className="py-8 bg-white border-b border-gray-100 sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category.id
                      ? "bg-primary text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <i className={`${category.icon} mr-2`}></i>
                  {category.name}
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input pl-10 pr-4 py-2 w-full md:w-64"
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500">Loading products...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-exclamation-triangle text-red-500 text-2xl"></i>
              </div>
              <p className="text-red-500">{error}</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-search text-gray-400 text-2xl"></i>
              </div>
              <p className="text-gray-500 mb-4">No products found</p>
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                }}
                className="text-primary font-medium hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <p className="text-gray-500 mb-8">
                Showing {filteredProducts.length} products
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="product-card group"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="product-card-image relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary-light/10"></div>
                      <div className="absolute inset-0 flex items-center justify-center p-6">
                        <div className="w-20 h-20 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-full h-full object-cover rounded-2xl"
                            />
                          ) : (
                            <i
                              className={`${product.image} text-3xl text-primary`}
                            ></i>
                          )}
                        </div>
                      </div>
                      <span className="absolute top-3 left-3 badge badge-primary">
                        {product.category}
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {product.description}
                      </p>

                      {product.price && (
                        <p className="text-xl font-bold text-primary mb-3">
                          ₱{product.price.toLocaleString()}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-1 mb-4">
                        {product.colors &&
                          product.colors.slice(0, 3).map((color, i) => (
                            <span
                              key={i}
                              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                            >
                              {color}
                            </span>
                          ))}
                        {product.colors && product.colors.length > 3 && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            +{product.colors.length - 3}
                          </span>
                        )}
                      </div>

                      <button className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2">
                        <i className="fas fa-eye text-sm"></i>
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-2 block">
              Browse By
            </span>
            <h2 className="section-title">Product Categories</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.slice(1).map((category, index) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`bg-white rounded-2xl p-6 text-center card-hover transition-all duration-300 ${
                  selectedCategory === category.id
                    ? "ring-2 ring-primary shadow-lg"
                    : ""
                }`}
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:scale-110">
                  <i
                    className={`${category.icon} text-primary text-2xl`}
                  ></i>
                </div>
                <h3 className="text-lg font-semibold mb-1">{category.name}</h3>
                <p className="text-gray-500 text-sm">
                  {
                    displayProducts.filter((p) => p.category === category.id)
                      .length
                  }{" "}
                  items
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Looking for Custom Designs?
          </h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            We offer custom cement pot designs tailored to your specific
            requirements. Contact us to discuss your project and bring your
            vision to life.
          </p>
          <Link
            to="/contact"
            className="btn-primary inline-flex items-center gap-2"
          >
            <span>Request Custom Quote</span>
            <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Products;

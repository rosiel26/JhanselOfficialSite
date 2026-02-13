import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

// Available product images from public folder
const availableImages = [
  "/1.png",
  "/2.png",
  "/3.png",
  "/b174943b676c10089baa1595d0ce6f45.jpg",
  "/ab7b312109bf6a0810fcdc2a1c8d4f6d.jpg",
];

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [viewMode, setViewMode] = useState("grid");
  const [currentImageIndices, setCurrentImageIndices] = useState({});

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
        .order("name", { ascending: true });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // Demo products with real images
  const demoProducts = [
    {
      id: 1,
      name: "Classic Round Pot",
      category: "traditional",
      description:
        "Timeless design with a smooth finish, perfect for any plant. Handcrafted by skilled artisans.",
      image: availableImages[0],
      colors: ["Gray", "White", "Black"],
      sizes: ["Small", "Medium", "Large"],
      price: 599,
      in_stock: true,
    },
    {
      id: 2,
      name: "Modern Square Pot",
      category: "modern",
      description: "Clean lines and geometric shape for modern gardens and urban spaces.",
      image: availableImages[1],
      colors: ["Black", "White", "Gray"],
      sizes: ["Medium", "Large", "Extra Large"],
      price: 799,
      in_stock: true,
    },
    {
      id: 3,
      name: "Hanging Basket",
      category: "hanging",
      description: "Beautiful hanging design to maximize vertical space and add dimension.",
      image: availableImages[2],
      colors: ["Black", "White", "Gray"],
      sizes: ["Medium", "Large"],
      price: 449,
      in_stock: true,
    },
    {
      id: 4,
      name: "Speckled Planter",
      category: "specialty",
      description: "Elegant speckled design that adds texture and visual interest to any setting.",
      image: availableImages[3],
      colors: ["White", "Black", "Gray"],
      sizes: ["Medium", "Large"],
      price: 899,
      in_stock: true,
    },
    {
      id: 5,
      name: "Rustic Garden Pot",
      category: "traditional",
      description: "Rustic charm with natural textures, perfect for cottage and country gardens.",
      image: availableImages[4],
      colors: ["Black", "White", "Gray"],
      sizes: ["Large", "Extra Large"],
      price: 999,
      in_stock: true,
    },
    {
      id: 6,
      name: "Succulent Mini Pots",
      category: "miniature",
      description: "Adorable mini pots perfect for succulents and small plants on windowsills.",
      image: availableImages[0],
      colors: ["Black", "White"],
      sizes: ["Small"],
      price: 299,
      in_stock: true,
    },
    {
      id: 7,
      name: "Decorative Bowl",
      category: "traditional",
      description: "Shallow bowl perfect for succulents, arrangements, and decorative displays.",
      image: availableImages[1],
      colors: ["White", "Black", "Gray"],
      sizes: ["Small", "Medium"],
      price: 399,
      in_stock: true,
    },
    {
      id: 8,
      name: "Tiered Planter Stand",
      category: "specialty",
      description: "Three-tier stand for displaying multiple plants and creating vertical gardens.",
      image: availableImages[2],
      colors: ["Black", "White"],
      sizes: ["One Size"],
      price: 1899,
      in_stock: true,
    },
  ];

  // Display products (from Supabase or demo products)
  const displayProducts = useMemo(() => {
    if (products.length > 0) {
      return products.map((p, index) => {
        // Parse image_url as comma-separated string if it contains multiple images
        let images = [];
        if (p.image_url) {
          // Check if it's a comma-separated string (multiple images)
          if (p.image_url.includes(',')) {
            images = p.image_url.split(',').map(url => url.trim()).filter(url => url);
          } else {
            images = [p.image_url];
          }
        } else {
          images = [availableImages[index % availableImages.length]];
        }
        return {
          ...p,
          images: images,
          colors: [],
          sizes: [],
        };
      });
    }
    return demoProducts;
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return displayProducts.filter((product) => {
      const matchesCategory =
        selectedCategory === "all" ||
        product.category?.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [displayProducts, selectedCategory, searchQuery]);

  // Modal navigation functions
  const handlePreviousImage = () => {
    if (selectedProduct && selectedProduct.images && selectedProduct.images.length > 0) {
      const newIndex = selectedImageIndex > 0 ? selectedImageIndex - 1 : selectedProduct.images.length - 1;
      setSelectedImageIndex(newIndex);
      setSelectedImage(selectedProduct.images[newIndex]);
    }
  };

  const handleNextImage = () => {
    if (selectedProduct && selectedProduct.images && selectedProduct.images.length > 0) {
      const newIndex = selectedImageIndex < selectedProduct.images.length - 1 ? selectedImageIndex + 1 : 0;
      setSelectedImageIndex(newIndex);
      setSelectedImage(selectedProduct.images[newIndex]);
    }
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
    setSelectedProduct(null);
    setSelectedImageIndex(0);
  };

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="hero-gradient text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-48 h-48 bg-white rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-10 left-20 w-64 h-64 bg-green-500 rounded-full filter blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fadeInUp font-display text-white">
            Our Products
          </h1>
          <p className="text-lg md:text-xl text-white/90 animate-fadeInUp animation-delay-200">
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
              fill="#ffffff"
            />
          </svg>
        </div>
      </section>

      {/* Filter & Search Section */}
      <section className="py-6 bg-white border-b border-gray-200 sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`category-pill ${
                    selectedCategory === category.id ? "active" : ""
                  }`}
                >
                  <i className={`${category.icon} mr-2`}></i>
                  {category.name}
                </button>
              ))}
            </div>

            {/* Search & View Toggle */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-input pl-10 pr-4 py-2 w-full md:w-64"
                />
               
              </div>
              {/* View Mode Toggle */}
              <div className="hidden md:flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-all duration-300 ${
                    viewMode === "grid"
                      ? "bg-white shadow-sm text-black"
                      : "text-gray-500 hover:text-black"
                  }`}
                >
                  <i className="fas fa-th-large"></i>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-all duration-300 ${
                    viewMode === "list"
                      ? "bg-white shadow-sm text-black"
                      : "text-gray-500 hover:text-black"
                  }`}
                >
                  <i className="fas fa-list"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Products Grid */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mb-4"></div>
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
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-search text-gray-400 text-2xl"></i>
              </div>
              <p className="text-gray-500 mb-4">No products found</p>
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                }}
                className="text-green-600 font-medium hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <>
              {/* Header with count and note */}
              <div className="flex justify-between items-start mb-8">
                <p className="text-gray-500">
                  Showing {filteredProducts.length} products
                </p>
                <p className="text-xs text-gray-500 italic max-w-md text-right">
                  * The size and price varies on your preference. Make sure to visit the site for actual product details. This is a show room for design and range price.
                </p>
              </div>

              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-6"
                }
              >
                {filteredProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className={`product-card group ${
                      viewMode === "list" ? "flex" : "flex-col"
                    }`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    {/* Product Image */}
                    <div
                      className={`${
                        viewMode === "list" ? "w-48 h-48 flex-shrink-0" : "aspect-square"
                      } product-card-image relative cursor-pointer overflow-hidden`}
                      onClick={() => {
                        if (product.images && product.images.length > 0) {
                          setSelectedImage(product.images[currentImageIndices[product.id] || 0]);
                          setSelectedProduct(product);
                          setSelectedImageIndex(currentImageIndices[product.id] || 0);
                        }
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-black/5 z-10"></div>
                       
                      {/* Image Carousel */}
                      {product.images && product.images.length > 0 ? (
                        <>
                          <img
                            src={product.images[currentImageIndices[product.id] || 0]}
                            alt={product.name}
                            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                           
                          {/* Image Navigation */}
                          {product.images.length > 1 && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCurrentImageIndices(prev => ({
                                    ...prev,
                                    [product.id]: Math.max(0, (prev[product.id] || 0) - 1)
                                  }));
                                }}
                                className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center z-30 transition-colors"
                              >
                                <i className="fas fa-chevron-left text-xs"></i>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCurrentImageIndices(prev => ({
                                    ...prev,
                                    [product.id]: Math.min(product.images.length - 1, (prev[product.id] || 0) + 1)
                                  }));
                                }}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center z-30 transition-colors"
                              >
                                <i className="fas fa-chevron-right text-xs"></i>
                              </button>
                              {/* Image Indicators */}
                              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1 z-20">
                                {product.images.map((_, idx) => (
                                  <div
                                    key={idx}
                                    className={`w-2 h-2 rounded-full transition-colors ${
                                      idx === (currentImageIndices[product.id] || 0)
                                        ? "bg-white"
                                        : "bg-white/50"
                                    }`}
                                  />
                                ))}
                              </div>
                            </>
                          )}
                        </>
                      ) : (
                        <div className="w-full h-full items-center justify-center bg-gray-200">
                          <i className="fas fa-seedling text-4xl text-black/30"></i>
                        </div>
                      )}
                       
                      <span className="absolute top-3 left-3 badge badge-primary z-20">
                        {product.category}
                      </span>
                      {product.price && (
                        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-black font-bold px-3 py-1 rounded-lg shadow-md z-20">
                          ₱{product.price.toLocaleString()}
                        </span>
                      )}
                      {/* Quick View Overlay */}
                     
                    </div>

                    {/* Product Info */}
                    <div className="p-5 flex flex-col flex-grow">
                      <h3 className="text-lg font-semibold mb-2 text-black">
                        {product.name}
                      </h3>
                      <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                        {product.description}
                      </p>

                      {/* Colors */}
                      {product.colors && product.colors.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {product.colors.slice(0, 3).map((color, i) => (
                            <span
                              key={i}
                              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                            >
                              {color}
                            </span>
                          ))}
                          {product.colors.length > 3 && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                              +{product.colors.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

     
      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4 font-display text-black">
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
            <i className="fas fa-pencil-alt"></i>
            <span>Request Custom Quote</span>
            <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="modal-backdrop"
          onClick={handleCloseModal}
        >
          <button
            className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 bg-black/50 rounded-full w-10 h-10 flex items-center justify-center transition-colors z-50"
            onClick={handleCloseModal}
          >
            <i className="fas fa-times"></i>
          </button>
          
          {/* Previous Image Button */}
          {selectedProduct && selectedProduct.images && selectedProduct.images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePreviousImage();
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-3xl hover:text-gray-300 bg-black/50 rounded-full w-12 h-12 flex items-center justify-center transition-colors z-50"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
          )}
          
          <img
            src={selectedImage}
            alt="Full size"
            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          
          {/* Next Image Button */}
          {selectedProduct && selectedProduct.images && selectedProduct.images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNextImage();
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-3xl hover:text-gray-300 bg-black/50 rounded-full w-12 h-12 flex items-center justify-center transition-colors z-50"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          )}
          
          {/* Image Counter */}
          {selectedProduct && selectedProduct.images && selectedProduct.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm z-50">
              {selectedImageIndex + 1} / {selectedProduct.images.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Products;

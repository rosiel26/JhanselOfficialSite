import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase, getServiceRoleClient } from "../lib/supabase";

const AdminDashboard = () => {
  const { isAuthenticated, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    in_stock: true,
  });
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
      return;
    }
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [isAuthenticated, authLoading, navigate]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
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

  const compressImage = (file, maxSizeKB = 150, maxWidth = 800) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          let quality = 0.8;
          let dataUrl = canvas.toDataURL("image/jpeg", quality);

          while (dataUrl.length / 1024 > maxSizeKB && quality > 0.1) {
            quality -= 0.1;
            dataUrl = canvas.toDataURL("image/jpeg", quality);
          }

          resolve(dataUrl);
        };
      };
    });
  };

  const handleFileSelect = async (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    try {
      setUploading(true);
      setError("");

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);

      const compressedImage = await compressImage(file, 150, 800);
      setSelectedImage(compressedImage);
    } catch (err) {
      console.error("Error processing image:", err);
      setError("Failed to process image");
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDropZoneClick = () => {
    if (!imagePreview) {
      fileInputRef.current?.click();
    }
  };

  const uploadImage = async (imageData, productId) => {
    const fileName = `product/${productId}-${Date.now()}.jpg`;
    const base64Data = imageData.split(",")[1];
    const byteCharacters = decode(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    const { error } = await supabase.storage
      .from("product")
      .upload(fileName, byteArray, {
        contentType: "image/jpeg",
      });

    if (error) throw error;

    const publicUrl = `https://zzznvekcjvixcggkfqwe.supabase.co/storage/v1/object/public/product/${fileName}`;
    return publicUrl;
  };

  const decode = (str) => {
    return window.atob(str);
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.category || !newProduct.description) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setError("");
      setUploading(true);
      const supabaseAdmin = getServiceRoleClient();

      let imageUrl = null;
      if (selectedImage) {
        const tempId = Date.now();
        imageUrl = await uploadImage(selectedImage, tempId);
      }

      const productData = {
        name: newProduct.name,
        category: newProduct.category,
        description: newProduct.description,
        price: newProduct.price ? parseFloat(newProduct.price) : null,
        in_stock: newProduct.in_stock,
        image_url: imageUrl,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabaseAdmin
        .from("products")
        .insert([productData])
        .select();

      if (error) throw error;

      setProducts([data[0], ...products]);

      setNewProduct({
        name: "",
        category: "",
        description: "",
        price: "",
        in_stock: true,
      });
      setSelectedImage(null);
      setImagePreview(null);
      setIsAddingProduct(false);
      setShowSuccessModal(true);
    } catch (err) {
      console.error("Error adding product:", err);
      setError("Failed to add product: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    try {
      setError("");
      const supabaseAdmin = getServiceRoleClient();

      if (productToDelete.image_url) {
        try {
          const urlParts = productToDelete.image_url.split(
            "/storage/v1/object/public/product/",
          );
          if (urlParts.length === 2) {
            const fileName = urlParts[1];
            await supabase.storage.from("product").remove([fileName]);
          }
        } catch (imgErr) {
          console.error("Error deleting image from storage:", imgErr);
        }
      }

      const { error } = await supabaseAdmin
        .from("products")
        .delete()
        .eq("id", productToDelete.id);

      if (error) throw error;
      setProducts(products.filter((p) => p.id !== productToDelete.id));
      setShowDeleteModal(false);
      setProductToDelete(null);
    } catch (err) {
      console.error("Error deleting product:", err);
      setError("Failed to delete product: " + err.message);
    }
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (authLoading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <span className="fas fa-spinner fa-spin text-primary text-3xl"></span>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-100">
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <span className="fas fa-exclamation-triangle text-red-500 text-5xl mb-4 block"></span>
              <h3 className="text-xl font-bold mb-2">Delete Product</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{productToDelete?.name}"? This
                action cannot be undone.
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setProductToDelete(null);
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <header className="bg-dark text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            <span className="fas fa-exclamation-circle mr-2"></span>
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Manage Products</h2>
            <button
              onClick={() => setIsAddingProduct(!isAddingProduct)}
              className="bg-primary hover:bg-blue-800 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {isAddingProduct ? (
                <>
                  <span className="fas fa-times mr-2"></span>
                  Cancel
                </>
              ) : (
                <>
                  <span className="fas fa-plus mr-2"></span>
                  Add New Product
                </>
              )}
            </button>
          </div>

          {isAddingProduct && (
            <div className="border-t pt-6 mt-6">
              <h3 className="text-lg font-semibold mb-4">Add New Product</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter product name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={newProduct.category}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, category: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select category</option>
                    <option value="Traditional">Traditional</option>
                    <option value="Contemporary">Contemporary</option>
                    <option value="Hanging">Hanging</option>
                    <option value="Specialty">Specialty</option>
                    <option value="Modern">Modern</option>
                    <option value="Miniature">Miniature</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, price: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows="3"
                  placeholder="Enter product description"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Image
                </label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${
                    dragActive
                      ? "border-primary bg-primary/5"
                      : "border-gray-300 hover:border-primary"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={handleDropZoneClick}
                >
                  {imagePreview ? (
                    <div className="relative inline-block">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-w-[200px] max-h-[200px] object-contain rounded-lg"
                      />
                      <button
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                      >
                        <span className="fas fa-times text-xs"></span>
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-2 block"></span>
                      <p className="text-gray-600 mb-2">
                        Click or drag and drop to upload image
                      </p>
                      <p className="text-sm text-gray-500">
                        Images will be automatically compressed
                      </p>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileSelect(e.target.files[0])}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newProduct.in_stock}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        in_stock: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="ml-2 text-sm text-gray-700">In Stock</span>
                </label>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleAddProduct}
                  disabled={uploading}
                  className="bg-primary hover:bg-blue-800 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <span className="fas fa-spinner fa-spin mr-2"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <span className="fas fa-check mr-2"></span>
                      Save Product
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Products Table */}
          <div className="overflow-x-auto mt-6">
            {loading ? (
              <div className="text-center py-8">
                <span className="fas fa-spinner fa-spin text-primary text-3xl"></span>
                <p className="text-gray-500 mt-4">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-8">
                <span className="fas fa-box text-gray-400 text-5xl mb-4 block"></span>
                <p className="text-gray-500">No products found</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                      Image
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                      Name
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                      Category
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                      Price
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="border-t border-gray-200 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        ) : (
                          <span className="fas fa-image text-gray-400 text-2xl"></span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">
                        {product.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {product.category}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">
                        {product.price ? `₱${product.price.toFixed(2)}` : "-"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            product.in_stock
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {product.in_stock ? "In Stock" : "Out of Stock"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDeleteClick(product)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <span className="fas fa-trash"></span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Messages Section */}
        <MessagesSection />
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <span className="fas fa-check text-green-600 text-xl"></span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Success!</h3>
              <p className="text-gray-600 mb-6">Product added successfully!</p>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-800 transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Messages Section Component
const MessagesSection = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from("contact_messages")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;
      setMessages(
        messages.map((m) => (m.id === id ? { ...m, status: newStatus } : m)),
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleDeleteClick = (message) => {
    setMessageToDelete(message);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!messageToDelete) return;

    try {
      const { error } = await supabase
        .from("contact_messages")
        .delete()
        .eq("id", messageToDelete.id);

      if (error) throw error;
      setMessages(messages.filter((m) => m.id !== messageToDelete.id));
      setShowDeleteModal(false);
      setMessageToDelete(null);
      setSelectedMessage(null);
    } catch (err) {
      console.error("Error deleting message:", err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "read":
        return "bg-blue-100 text-blue-700";
      case "replied":
        return "bg-green-100 text-green-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Contact Messages</h2>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <span className="fas fa-exclamation-triangle text-red-500 text-5xl mb-4 block"></span>
              <h3 className="text-xl font-bold mb-2">Delete Message</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this message? This action cannot
                be undone.
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setMessageToDelete(null);
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <span className="fas fa-spinner fa-spin text-primary text-3xl"></span>
          <p className="text-gray-500 mt-4">Loading messages...</p>
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-8">
          <span className="fas fa-envelope-open text-gray-400 text-5xl mb-4 block"></span>
          <p className="text-gray-500">No messages found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedMessage?.id === message.id
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedMessage(message)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {message.name}
                      </h3>
                      <p className="text-sm text-gray-500">{message.email}</p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                        message.status,
                      )}`}
                    >
                      {message.status}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    {message.subject}
                  </p>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {message.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(message.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-1">
            {selectedMessage ? (
              <div className="border border-gray-200 rounded-lg p-6 sticky top-24">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-lg">Message Details</h3>
                  <button
                    onClick={() => handleDeleteClick(selectedMessage)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <span className="fas fa-trash"></span>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-500">From</label>
                    <p className="font-medium">{selectedMessage.name}</p>
                    <p className="text-sm text-gray-600">
                      {selectedMessage.email}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-500">Subject</label>
                    <p className="font-medium">{selectedMessage.subject}</p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-500">Message</label>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {selectedMessage.message}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-500">Status</label>
                    <div className="mt-2">
                      <select
                        value={selectedMessage.status}
                        onChange={(e) =>
                          handleStatusChange(
                            selectedMessage.id,
                            e.target.value,
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="unread">Unread</option>
                        <option value="read">Read</option>
                        <option value="replied">Replied</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-500">Received</label>
                    <p className="text-gray-700">
                      {new Date(selectedMessage.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg p-6 text-center text-gray-500 sticky top-24">
                <span className="fas fa-hand-pointer text-4xl mb-4 block"></span>
                <p>Select a message to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

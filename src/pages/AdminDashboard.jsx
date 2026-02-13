import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { validateProductForm } from "../lib/security";
import Draggable, { DraggableFrame } from "../components/Draggable";

const AdminDashboard = () => {
  const { isAuthenticated, isAdmin, loading: authLoading, logout } = useAuth();
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
  const [showAddModal, setShowAddModal] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  // Image framing state
  const [imageFrame, setImageFrame] = useState({
    x: 0,
    y: 0,
    scale: 1,
  });
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageContainerRef = useRef(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    in_stock: true,
  });
  const [editImagePreview, setEditImagePreview] = useState(null);
  // Edit image upload state
  const [editSelectedImage, setEditSelectedImage] = useState(null);
  const [editImagePreviews, setEditImagePreviews] = useState([]);
  const [editSelectedImages, setEditSelectedImages] = useState([]);
  const [editDragActive, setEditDragActive] = useState(false);
  const editFileInputRef = useRef(null);
  // Image dimensions for constraint calculations
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [editImageDimensions, setEditImageDimensions] = useState({ width: 0, height: 0 });
  // Edit image framing state
  const [editImageFrame, setEditImageFrame] = useState({
    x: 0,
    y: 0,
    scale: 1,
  });
  const [isDraggingEditImage, setIsDraggingEditImage] = useState(false);
  const [editDragStart, setEditDragStart] = useState({ x: 0, y: 0 });
  const editImageContainerRef = useRef(null);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  // Search state
  const [searchQuery, setSearchQuery] = useState("");

   

useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
      return;
    }
    // Check if user has admin role
    if (isAuthenticated && !isAdmin) {
      navigate("/");
      return;
    }
    if (isAuthenticated && isAdmin) {
      fetchProducts();
    }
  }, [isAuthenticated, isAdmin, authLoading, navigate]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
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

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const query = searchQuery.toLowerCase();
      return (
        product.name?.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query)
      );
    });
  }, [products, searchQuery]);

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

 const handleFileSelect = async (files) => {
  if (!files || files.length === 0) return;

  const fileArray = Array.from(files);
  const validFiles = fileArray.filter(file => file.type.startsWith("image/"));

  if (validFiles.length === 0) {
    setError("Please select image files");
    return;
  }

  try {
    setUploading(true);
    setError("");

    const newPreviews = [];
    const newImages = [];

    for (const file of validFiles) {
      const reader = new FileReader();
      const previewPromise = new Promise((resolve) => {
        reader.onload = (e) => {
          newPreviews.push(e.target.result);
          resolve();
        };
        reader.readAsDataURL(file);
      });
      await previewPromise;

      const compressedImage = await compressImage(file, 150, 800);
      newImages.push(compressedImage);
    }

    setImagePreviews([...imagePreviews, ...newPreviews]);
    setSelectedImages([...selectedImages, ...newImages]);
  } catch (err) {
    console.error("Error processing images:", err);
    setError("Failed to process images");
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

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleDropZoneClick = () => {
    fileInputRef.current?.click();
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

    // Use Supabase's getPublicUrl method instead of hardcoded URL
    const { data: { publicUrl } } = supabase.storage
      .from("product")
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const decode = (str) => {
    return window.atob(str);
  };

  const handleAddProduct = async () => {
    // Validate and sanitize form data
    const validation = validateProductForm(newProduct);

    if (!validation.valid) {
      // Show the first error message
      const firstError = Object.values(validation.errors)[0];
      setError(firstError);
      return;
    }

    try {
      setError("");
      setUploading(true);

      let imageUrls = [];
      if (selectedImages.length > 0) {
        const tempId = Date.now();
        for (let i = 0; i < selectedImages.length; i++) {
          const imageUrl = await uploadImage(selectedImages[i], `${tempId}-${i}`);
          imageUrls.push(imageUrl);
        }
      }

      const productData = {
        name: validation.sanitized.name,
        category: validation.sanitized.category,
        description: validation.sanitized.description,
        price: validation.sanitized.price,
        in_stock: validation.sanitized.in_stock,
        image_url: imageUrls.length > 0 ? imageUrls.join(',') : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
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
      setSelectedImages([]);
      setImagePreviews([]);
      setShowAddModal(false);
      setShowSuccessModal(true);
    } catch (err) {
      console.error("Error adding product:", err);
      setError("Failed to add product. Please try again.");
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

      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productToDelete.id);

      if (error) throw error;
      setProducts(products.filter((p) => p.id !== productToDelete.id));
      setShowDeleteModal(false);
      setProductToDelete(null);
    } catch (err) {
      console.error("Error deleting product:", err);
      setError("Failed to delete product. Please try again.");
    }
  };

  const handleRemoveImage = (index) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Image framing controls
  const FRAME_WIDTH = 280;
  const FRAME_HEIGHT = 256;

  const handleImageDragStart = (e) => {
    if (!imagePreviews || imagePreviews.length === 0) return;
    
    // Get pointer position (mouse or touch)
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    setIsDraggingImage(true);
    setDragStart({
      x: clientX - imageFrame.x,
      y: clientY - imageFrame.y,
    });
  };

  const handleImageDrag = useCallback(
    (e) => {
      if (!isDraggingImage || !imagePreviews || imagePreviews.length === 0 || !imageDimensions.width) return;
      if (e.cancelable) e.preventDefault();
      
      // Get pointer position (mouse or touch)
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      
      const newX = clientX - dragStart.x;
      const newY = clientY - dragStart.y;

      // Calculate scaled dimensions
      const imgRatio = imageDimensions.width / imageDimensions.height;
      const frameRatio = FRAME_WIDTH / FRAME_HEIGHT;

      let scaledWidth, scaledHeight;
      if (imgRatio > frameRatio) {
        scaledHeight = FRAME_HEIGHT * imageFrame.scale;
        scaledWidth = scaledHeight * imgRatio;
      } else {
        scaledWidth = FRAME_WIDTH * imageFrame.scale;
        scaledHeight = scaledWidth / imgRatio;
      }

      // Constrain to keep image within viewport
      const maxX = 0;
      const maxY = 0;
      const minX = FRAME_WIDTH - scaledWidth;
      const minY = FRAME_HEIGHT - scaledHeight;

      setImageFrame((prev) => ({
        ...prev,
        x: Math.min(Math.max(newX, minX), maxX),
        y: Math.min(Math.max(newY, minY), maxY),
      }));
    },
    [isDraggingImage, dragStart, imagePreviews, imageFrame.scale, imageDimensions],
  );

  const handleImageDragEnd = () => {
    setIsDraggingImage(false);
  };

  const handleZoomIn = () => {
    setImageFrame((prev) => ({
      ...prev,
      scale: Math.min(prev.scale + 0.25, 3),
    }));
  };

  const handleZoomOut = () => {
    setImageFrame((prev) => ({
      ...prev,
      scale: Math.max(prev.scale - 0.25, 0.5),
    }));
  };

  const handleResetFrame = () => {
    setImageFrame({ x: 0, y: 0, scale: 1 });
  };

  // Edit image framing controls
  const handleEditImageDragStart = (e) => {
    if (!editImagePreview) return;
    
    // Get pointer position (mouse or touch)
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    setIsDraggingEditImage(true);
    setEditDragStart({
      x: clientX - editImageFrame.x,
      y: clientY - editImageFrame.y,
    });
  };

  const handleEditImageDrag = useCallback(
    (e) => {
      if (!isDraggingEditImage || !editImagePreview || !editImageDimensions.width) return;
      if (e.cancelable) e.preventDefault();
      
      // Get pointer position (mouse or touch)
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      
      const newX = clientX - editDragStart.x;
      const newY = clientY - editDragStart.y;

      // Calculate scaled dimensions
      const imgRatio = editImageDimensions.width / editImageDimensions.height;
      const frameRatio = FRAME_WIDTH / FRAME_HEIGHT;

      let scaledWidth, scaledHeight;
      if (imgRatio > frameRatio) {
        scaledHeight = FRAME_HEIGHT * editImageFrame.scale;
        scaledWidth = scaledHeight * imgRatio;
      } else {
        scaledWidth = FRAME_WIDTH * editImageFrame.scale;
        scaledHeight = scaledWidth / imgRatio;
      }

      // Constrain to keep image within viewport
      const maxX = 0;
      const maxY = 0;
      const minX = FRAME_WIDTH - scaledWidth;
      const minY = FRAME_HEIGHT - scaledHeight;

      setEditImageFrame((prev) => ({
        ...prev,
        x: Math.min(Math.max(newX, minX), maxX),
        y: Math.min(Math.max(newY, minY), maxY),
      }));
    },
    [isDraggingEditImage, editDragStart, editImagePreview, editImageFrame.scale, editImageDimensions],
  );

  const handleEditImageDragEnd = () => {
    setIsDraggingEditImage(false);
  };

  const handleEditZoomIn = () => {
    setEditImageFrame((prev) => ({
      ...prev,
      scale: Math.min(prev.scale + 0.25, 3),
    }));
  };

  const handleEditZoomOut = () => {
    setEditImageFrame((prev) => ({
      ...prev,
      scale: Math.max(prev.scale - 0.25, 0.5),
    }));
  };

  const handleEditResetFrame = () => {
    setEditImageFrame({ x: 0, y: 0, scale: 1 });
  };

  // Global mouse/touch event listeners for dragging
  useEffect(() => {
    if (isDraggingImage) {
      window.addEventListener("mousemove", handleImageDrag);
      window.addEventListener("mouseup", handleImageDragEnd);
      window.addEventListener("touchmove", handleImageDrag, { passive: false });
      window.addEventListener("touchend", handleImageDragEnd);
      return () => {
        window.removeEventListener("mousemove", handleImageDrag);
        window.removeEventListener("mouseup", handleImageDragEnd);
        window.removeEventListener("touchmove", handleImageDrag);
        window.removeEventListener("touchend", handleImageDragEnd);
      };
    }
  }, [isDraggingImage, handleImageDrag]);

  useEffect(() => {
    if (isDraggingEditImage) {
      window.addEventListener("mousemove", handleEditImageDrag);
      window.addEventListener("mouseup", handleEditImageDragEnd);
      window.addEventListener("touchmove", handleEditImageDrag, { passive: false });
      window.addEventListener("touchend", handleEditImageDragEnd);
      return () => {
        window.removeEventListener("mousemove", handleEditImageDrag);
        window.removeEventListener("mouseup", handleEditImageDragEnd);
        window.removeEventListener("touchmove", handleEditImageDrag);
        window.removeEventListener("touchend", handleEditImageDragEnd);
      };
    }
  }, [isDraggingEditImage, handleEditImageDrag]);

  const handleSelectProduct = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  };

  const handleSelectAll = () => {
    const productsToSelect = searchQuery ? filteredProducts : products;
    if (selectedProducts.length === productsToSelect.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(productsToSelect.map((p) => p.id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return;

    try {
      setError("");

      // Delete images and records for selected products
      const productsToDelete = products.filter((p) => selectedProducts.includes(p.id));

      for (const product of productsToDelete) {
        if (product.image_url) {
          try {
            const urlParts = product.image_url.split(
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
      }

      const { error } = await supabase
        .from("products")
        .delete()
        .in("id", selectedProducts);

      if (error) throw error;

      setProducts(products.filter((p) => !selectedProducts.includes(p.id)));
      setSelectedProducts([]);
      setShowBulkDeleteModal(false);
    } catch (err) {
      console.error("Error deleting products:", err);
      setError("Failed to delete products: " + err.message);
    }
  };
const getCoverSize = (imgW, imgH, frameW, frameH, scale = 1) => {
  const imgRatio = imgW / imgH;
  const frameRatio = frameW / frameH;

  let w, h;
  if (imgRatio > frameRatio) {
    h = frameH * scale;
    w = h * imgRatio;
  } else {
    w = frameW * scale;
    h = w / imgRatio;
  }
  return { w, h };
};



  const handleEditClick = (product) => {
  setEditingProduct(product);

  setEditForm({
    name: product.name,
    category: product.category,
    description: product.description,
    price: product.price ? product.price.toString() : "",
    in_stock: product.in_stock,
  });

  // Parse multiple images from comma-separated string
  let images = [];
  if (product.image_url) {
    if (product.image_url.includes(',')) {
      images = product.image_url.split(',').map(url => url.trim()).filter(url => url);
    } else {
      images = [product.image_url];
    }
  }

  setEditImagePreviews(images);
  setEditSelectedImages([]);
  setEditSelectedImage(null);
  setEditImageFrame({ x: 0, y: 0, scale: 1 });

  // Set the first image as the preview for the framing controls
  if (images.length > 0) {
    setEditImagePreview(images[0]);
    const img = new Image();
    img.src = images[0];
    img.onload = () => {
      const dims = { width: img.width, height: img.height };
      setEditImageDimensions(dims);

      // center it (cover-size centered)
      const { w, h } = getCoverSize(dims.width, dims.height, FRAME_WIDTH, FRAME_HEIGHT, 1);
      setEditImageFrame({ x: (FRAME_WIDTH - w) / 2, y: (FRAME_HEIGHT - h) / 2, scale: 1 });
    };
  } else {
    setEditImagePreview(null);
    setEditImageDimensions({ width: 0, height: 0 });
  }

  setShowEditModal(true);
};


  const handleUpdateProduct = async () => {
    // Validate and sanitize form data
    const validation = validateProductForm(editForm);

    if (!validation.valid) {
      // Show the first error message
      const firstError = Object.values(validation.errors)[0];
      setError(firstError);
      return;
    }

    try {
      setError("");
      setUploading(true);

      let imageUrls = [...editImagePreviews];

      // Upload new images if selected
      if (editSelectedImages.length > 0) {
        // Delete old images if exists
        if (editingProduct.image_url) {
          try {
            const oldImages = editingProduct.image_url.includes(',')
              ? editingProduct.image_url.split(',').map(url => url.trim())
              : [editingProduct.image_url];
             
            for (const oldImageUrl of oldImages) {
              const urlParts = oldImageUrl.split("/storage/v1/object/public/product/");
              if (urlParts.length === 2) {
                const fileName = urlParts[1];
                await supabase.storage.from("product").remove([fileName]);
              }
            }
          } catch (imgErr) {
            console.error("Error deleting old images:", imgErr);
          }
        }
        // Upload new images
        const tempId = Date.now();
        for (let i = 0; i < editSelectedImages.length; i++) {
          const imageUrl = await uploadImage(editSelectedImages[i], `${tempId}-${i}`);
          imageUrls.push(imageUrl);
        }
      }

      const productData = {
        name: validation.sanitized.name,
        category: validation.sanitized.category,
        description: validation.sanitized.description,
        price: validation.sanitized.price,
        in_stock: validation.sanitized.in_stock,
        image_url: imageUrls.length > 0 ? imageUrls.join(',') : null,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("products")
        .update(productData)
        .eq("id", editingProduct.id);

      if (error) throw error;

      setProducts(
        products.map((p) =>
          p.id === editingProduct.id ? { ...p, ...productData } : p,
        ),
      );
      setShowEditModal(false);
      setEditingProduct(null);
      setEditSelectedImages([]);
      setEditImagePreviews([]);
      setEditSelectedImage(null);
      setShowSuccessModal(true);
    } catch (err) {
      console.error("Error updating product:", err);
      setError("Failed to update product: " + err.message);
    } finally {
      setUploading(false);
    }
  };

const handleEditImageChange = async (e) => {
  const files = e.target.files;
  if (!files || files.length === 0) return;

  const fileArray = Array.from(files);
  const validFiles = fileArray.filter(file => file.type.startsWith("image/"));

  if (validFiles.length === 0) {
    setError("Please select image files");
    return;
  }

  try {
    setError("");

    const newPreviews = [];
    const newImages = [];

    for (const file of validFiles) {
      // Preview + dimensions
      const reader = new FileReader();
      const previewPromise = new Promise((resolve) => {
        reader.onload = (ev) => {
          newPreviews.push(ev.target.result);
          resolve();
        };
        reader.readAsDataURL(file);
      });
      await previewPromise;

      // Compressed image used for upload
      const compressedImage = await compressImage(file, 150, 800);
      newImages.push(compressedImage);
    }

    setEditImagePreviews([...editImagePreviews, ...newPreviews]);
    setEditSelectedImages([...editSelectedImages, ...newImages]);

    // Set the first new image as the preview for framing controls
    if (newPreviews.length > 0) {
      setEditImagePreview(newPreviews[0]);
      const img = new Image();
      img.src = newPreviews[0];
      img.onload = () => {
        const dims = { width: img.width, height: img.height };
        setEditImageDimensions(dims);

        // center it
        const { w, h } = getCoverSize(dims.width, dims.height, FRAME_WIDTH, FRAME_HEIGHT, 1);
        setEditImageFrame({ x: (FRAME_WIDTH - w) / 2, y: (FRAME_HEIGHT - h) / 2, scale: 1 });
      };
    }
  } catch (err) {
    console.error("Error processing images:", err);
    setError("Failed to process images");
  }
};


  const handleEditRemoveImage = () => {
  setEditSelectedImages([]);
  setEditImagePreviews([]);
  setEditSelectedImage(null);
  setEditImagePreview(null);

  // ✅ reset frame + scale + drag state
  setEditImageFrame({ x: 0, y: 0, scale: 1 });
  setEditImageDimensions({ width: 0, height: 0 });
  setIsDraggingEditImage(false);
  setEditDragStart({ x: 0, y: 0 });

  if (editFileInputRef.current) {
    editFileInputRef.current.value = "";
  }
};

  const handleEditRemoveSingleImage = (index) => {
    setEditImagePreviews(editImagePreviews.filter((_, i) => i !== index));
    setEditSelectedImages(editSelectedImages.filter((_, i) => i !== index));
    
    // Update the preview if there are still images
    if (editImagePreviews.length > 1) {
      const newIndex = index >= editImagePreviews.length - 1 ? 0 : index;
      setEditImagePreview(editImagePreviews[newIndex]);
      const img = new Image();
      img.src = editImagePreviews[newIndex];
      img.onload = () => {
        const dims = { width: img.width, height: img.height };
        setEditImageDimensions(dims);

        // center it
        const { w, h } = getCoverSize(dims.width, dims.height, FRAME_WIDTH, FRAME_HEIGHT, 1);
        setEditImageFrame({ x: (FRAME_WIDTH - w) / 2, y: (FRAME_HEIGHT - h) / 2, scale: 1 });
      };
    } else {
      setEditImagePreview(null);
      setEditImageDimensions({ width: 0, height: 0 });
    }
  };


  const handleEditDropZoneClick = () => {
    editFileInputRef.current?.click();
  };

  const handleEditDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setEditDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleEditImageChange({ target: { files: e.dataTransfer.files } });
    }
  };

  const handleEditDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setEditDragActive(true);
    } else if (e.type === "dragleave") {
      setEditDragActive(false);
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
              <span className="fas fa-exclamation-triangle text-black text-5xl mb-4 block"></span>
              <h3 className="text-xl font-bold mb-2 text-black">Delete Product</h3>
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
                  className="bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {showBulkDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <span className="fas fa-exclamation-triangle text-black text-5xl mb-4 block"></span>
              <h3 className="text-xl font-bold mb-2 text-black">Delete {selectedProducts.length} Products</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete {selectedProducts.length} products? This
                action cannot be undone.
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setShowBulkDeleteModal(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Delete All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-black">Edit Product</h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingProduct(null);
                }}
                className="text-gray-500 hover:text-black"
              >
                <span className="fas fa-times text-xl"></span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Category *
                </label>
                <select
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
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
                <label className="block text-sm font-medium text-black mb-2">
                  Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editForm.price}
                  onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-black mb-2">
                Description *
              </label>
              <textarea
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                rows="3"
                placeholder="Enter product description"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-black mb-2">
                Product Image
              </label>
              <div className="border-2 border-gray-200 rounded-lg p-4">
                {editImagePreviews.length > 0 ? (
                  <div className="space-y-4">
                    {/* Image Grid */}
                    <div className="grid grid-cols-3 gap-3">
                      {editImagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-gray-300"
                          />
                          <button
                            onClick={() => handleEditRemoveSingleImage(index)}
                            className="absolute top-1 right-1 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <span className="fas fa-times text-xs"></span>
                          </button>
                          <span className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                            {index + 1}
                          </span>
                        </div>
                      ))}
                      {/* Add More Images Button */}
                      <div
                        onClick={handleEditDropZoneClick}
                        className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-black transition-colors"
                      >
                        <div className="text-center">
                          <span className="fas fa-plus text-gray-400 text-xl block mb-1"></span>
                          <span className="text-xs text-gray-500">Add More</span>
                        </div>
                      </div>
                    </div>

                    {/* Instructions */}
                    <p className="text-xs text-gray-500 text-center">
                      {editImagePreviews.length} image{editImagePreviews.length !== 1 ? 's' : ''} uploaded • Click "Add More" to upload additional images
                    </p>

                    {/* Image Actions */}
                    <div className="flex justify-center gap-3 pt-2 border-t border-gray-200">
                      <button
                        onClick={handleEditRemoveImage}
                        className="inline-flex items-center px-3 py-1.5 text-sm bg-gray-200 hover:bg-gray-300 text-black rounded-lg transition-colors"
                      >
                        <span className="fas fa-trash mr-1.5"></span>
                        Remove All
                      </button>
                      <button
                        onClick={() => {
                          // Replace: clear existing and add new
                          setEditImagePreviews([]);
                          setEditSelectedImages([]);
                          setEditImagePreview(null);
                          setEditSelectedImage(null);
                          setEditImageFrame({ x: 0, y: 0, scale: 1 });
                          setEditImageDimensions({ width: 0, height: 0 });
                          // Trigger file input click
                          editFileInputRef.current?.click();
                        }}
                        className="inline-flex items-center px-3 py-1.5 text-sm bg-black hover:bg-gray-800 text-white rounded-lg transition-colors"
                      >
                        <span className="fas fa-exchange-alt mr-1.5"></span>
                        Replace Image
                      </button>
                      <div
                        className={`border-2 border-dashed rounded-lg px-4 py-1.5 cursor-pointer transition-colors ${
                          editDragActive
                            ? "border-black bg-gray-100"
                            : "border-gray-300 hover:border-black"
                        }`}
                        onDragEnter={handleEditDrag}
                        onDragLeave={handleEditDrag}
                        onDragOver={handleEditDrag}
                        onDrop={handleEditDrop}
                        onClick={handleEditDropZoneClick}
                      >
                        <span className="fas fa-upload text-sm mr-1.5 text-gray-500"></span>
                        <span className="text-sm text-gray-600">Add More</span>
                      </div>
                    </div>
                    <input
                      ref={editFileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleEditImageChange}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                      editDragActive
                        ? "border-black bg-gray-100"
                        : "border-gray-300 hover:border-black"
                    }`}
                    onDragEnter={handleEditDrag}
                    onDragLeave={handleEditDrag}
                    onDragOver={handleEditDrag}
                    onDrop={handleEditDrop}
                    onClick={handleEditDropZoneClick}
                  >
                    <span className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-2 block"></span>
                    <p className="text-gray-600 mb-2">
                      Click or drag and drop to upload images
                    </p>
                    <p className="text-sm text-gray-500">
                      You can upload multiple images at once
                    </p>
                    <input
                      ref={editFileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleEditImageChange}
                      className="hidden"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={editForm.in_stock}
                  onChange={(e) => setEditForm({ ...editForm, in_stock: e.target.checked })}
                  className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                />
                <span className="ml-2 text-sm text-gray-700">In Stock</span>
              </label>
            </div>

            <div className="flex gap-4 justify-end">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingProduct(null);
                  setEditImagePreviews([]);
                  setEditSelectedImages([]);
                  setEditSelectedImage(null);
                  setEditImagePreview(null);
                  setEditImageFrame({ x: 0, y: 0, scale: 1 });
                  setEditImageDimensions({ width: 0, height: 0 });
                }}
                className="bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateProduct}
                className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-lg transition-colors"
              >
                <span className="fas fa-check mr-2"></span>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-black">Add New Product</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-black"
              >
                <span className="fas fa-times text-xl"></span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Category *
                </label>
                <select
                  value={newProduct.category}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, category: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
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
                <label className="block text-sm font-medium text-black mb-2">
                  Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, price: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-black mb-2">
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                rows="3"
                placeholder="Enter product description"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-black mb-2">
                Product Image
              </label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${
                  dragActive
                    ? "border-black bg-gray-100"
                    : "border-gray-300 hover:border-black"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={handleDropZoneClick}
              >
                {imagePreviews.length > 0 ? (
                  <div className="space-y-4">
                    {/* Image Grid */}
                    <div className="grid grid-cols-3 gap-3">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-gray-300"
                          />
                          <button
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-1 right-1 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <span className="fas fa-times text-xs"></span>
                          </button>
                          <span className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                            {index + 1}
                          </span>
                        </div>
                      ))}
                      {/* Add More Images Button */}
                      <div
                        onClick={handleDropZoneClick}
                        className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-black transition-colors"
                      >
                        <div className="text-center">
                          <span className="fas fa-plus text-gray-400 text-xl block mb-1"></span>
                          <span className="text-xs text-gray-500">Add More</span>
                        </div>
                      </div>
                    </div>

                    {/* Instructions */}
                    <p className="text-xs text-gray-500 text-center">
                      {imagePreviews.length} image{imagePreviews.length !== 1 ? 's' : ''} uploaded • Click "Add More" to upload additional images
                    </p>
                  </div>
                ) : (
                  <>
                    <span className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-2 block"></span>
                    <p className="text-gray-600 mb-2">
                      Click or drag and drop to upload images
                    </p>
                    <p className="text-sm text-gray-500">
                      You can upload multiple images at once
                    </p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFileSelect(e.target.files)}
                  className="hidden"
                />
              </div>
            </div>

            <div className="mb-6">
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
                  className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                />
                <span className="ml-2 text-sm text-gray-700">In Stock</span>
              </label>
            </div>

            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowAddModal(false)}
                className="bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProduct}
                disabled={uploading}
                className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
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
        </div>
      )}

      <header className="bg-black text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-gray-100 border border-gray-300 text-black px-4 py-3 rounded-lg mb-6">
            <span className="fas fa-exclamation-circle mr-2"></span>
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 className="text-xl font-bold text-black">Manage Products</h2>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              {/* Search Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1); // Reset to first page when searching
                  }}
                  className="w-full sm:w-64 px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
                <span className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></span>
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setCurrentPage(1);
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <span className="fas fa-times"></span>
                  </button>
                )}
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
              >
                <span className="fas fa-plus mr-2"></span>
                Add New Product
              </button>
            </div>
          </div>

          {/* Products Table */}
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-600">
              Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredProducts.length)} to {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products
              {searchQuery && ` (filtered from ${products.length} total)`}
            </div>
            {selectedProducts.length > 0 && (
              <button
                onClick={() => setShowBulkDeleteModal(true)}
                className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <span className="fas fa-trash mr-2"></span>
                Delete Selected ({selectedProducts.length})
              </button>
            )}
          </div>
          <div className="overflow-x-auto mt-2">
            {loading ? (
              <div className="text-center py-8">
                <span className="fas fa-spinner fa-spin text-primary text-3xl"></span>
                <p className="text-gray-500 mt-4">Loading products...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-8">
                <span className="fas fa-box text-gray-400 text-5xl mb-4 block"></span>
                <p className="text-gray-500">
                  {searchQuery ? "No products match your search" : "No products found"}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setCurrentPage(1);
                    }}
                    className="mt-4 text-black hover:underline"
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <>
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="px-4 py-3 text-sm font-semibold text-black w-12">
                        <input
                          type="checkbox"
                          checked={filteredProducts.length > 0 && selectedProducts.length === filteredProducts.length}
                          onChange={handleSelectAll}
                          className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black cursor-pointer"
                        />
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold text-black">
                        Image
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold text-black">
                        Name
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold text-black">
                        Category
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold text-black">
                        Price
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold text-black">
                        Status
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold text-black">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts
                      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                      .map((product) => (
                        <tr
                          key={product.id}
                          className={`border-t border-gray-200 hover:bg-gray-50 ${
                            selectedProducts.includes(product.id) ? "bg-gray-100" : ""
                          }`}
                        >
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={selectedProducts.includes(product.id)}
                              onChange={() => handleSelectProduct(product.id)}
                              className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black cursor-pointer"
                            />
                          </td>
                          <td className="px-4 py-3">
                            {product.image_url ? (
                              <img
                                src={product.image_url.split(',')[0]}
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded-lg"
                              />
                            ) : (
                              <span className="fas fa-image text-gray-400 text-2xl"></span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-black">
                            {product.name}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {product.category}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-black">
                            {product.price ? `₱${product.price.toFixed(2)}` : "-"}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                product.in_stock
                                  ? "bg-black text-white"
                                  : "bg-gray-300 text-black"
                              }`}
                            >
                              {product.in_stock ? "In Stock" : "Out of Stock"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditClick(product)}
                                className="text-black hover:text-gray-600 transition-colors"
                                title="Edit"
                              >
                                <span className="fas fa-edit"></span>
                              </button>
                              <button
                                onClick={() => handleDeleteClick(product)}
                                className="text-black hover:text-gray-600 transition-colors"
                                title="Delete"
                              >
                                <span className="fas fa-trash"></span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>

                {/* Pagination Controls */}
                {filteredProducts.length > itemsPerPage && (
                  <div className="flex justify-center items-center mt-6 gap-2">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors text-black"
                    >
                      <span className="fas fa-chevron-left"></span>
                    </button>
                    {Array.from({ length: Math.ceil(filteredProducts.length / itemsPerPage) }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-lg transition-colors ${
                          currentPage === page
                            ? "bg-black text-white"
                            : "bg-gray-200 hover:bg-gray-300 text-black"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(filteredProducts.length / itemsPerPage)))}
                      disabled={currentPage === Math.ceil(filteredProducts.length / itemsPerPage)}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors text-black"
                    >
                      <span className="fas fa-chevron-right"></span>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Messages Section */}
        <MessagesSection />

        {/* Draggable Component Demo Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Draggable Widget Demo</h2>
          <p className="text-gray-600 mb-4">
            Drag the colored widgets within the frame below. They will stay fully visible and never extend beyond the boundary.
          </p>
          
          <DraggableFrame
            width="100%"
            height="400px"
            border="2px solid #3b82f6"
            backgroundColor="#f0f9ff"
            showBoundary={true}
            className="relative"
          >
            {(frameRef) => (
              <>
                {/* Draggable Widget 1 - Blue */}
                <Draggable
                  frameRef={frameRef}
                  initialPosition={{ x: 20, y: 20 }}
                  boundary="contain"
                  cursor="grab"
                  activeCursor="grabbing"
                  highlightOnDrag={true}
                  onDragStart={(data) => console.log('Widget 1 drag started:', data)}
                  onDrag={(data) => console.log('Widget 1 position:', data.position)}
                  onDragEnd={(data) => console.log('Widget 1 drag ended:', data)}
                >
                  <div className="bg-blue-500 text-white p-4 rounded-lg shadow-lg w-40 text-center">
                    <span className="fas fa-arrows-alt mr-2"></span>
                    Drag Me!
                    <div className="text-xs opacity-75 mt-1">Widget 1</div>
                  </div>
                </Draggable>

                {/* Draggable Widget 2 - Green */}
                <Draggable
                  frameRef={frameRef}
                  initialPosition={{ x: 200, y: 100 }}
                  boundary="contain"
                  cursor="grab"
                  activeCursor="grabbing"
                  highlightOnDrag={true}
                  onDragStart={(data) => console.log('Widget 2 drag started:', data)}
                  onDrag={(data) => console.log('Widget 2 position:', data.position)}
                  onDragEnd={(data) => console.log('Widget 2 drag ended:', data)}
                >
                  <div className="bg-green-500 text-white p-4 rounded-lg shadow-lg w-40 text-center">
                    <span className="fas fa-hand-paper mr-2"></span>
                    Touch Me!
                    <div className="text-xs opacity-75 mt-1">Widget 2</div>
                  </div>
                </Draggable>

                {/* Draggable Widget 3 - Purple */}
                <Draggable
                  frameRef={frameRef}
                  initialPosition={{ x: 380, y: 180 }}
                  boundary="contain"
                  cursor="grab"
                  activeCursor="grabbing"
                  highlightOnDrag={true}
                  onDragStart={(data) => console.log('Widget 3 drag started:', data)}
                  onDrag={(data) => console.log('Widget 3 position:', data.position)}
                  onDragEnd={(data) => console.log('Widget 3 drag ended:', data)}
                >
                  <div className="bg-purple-500 text-white p-4 rounded-lg shadow-lg w-40 text-center">
                    <span className="fas fa-mobile-alt mr-2"></span>
                    Mobile Ready!
                    <div className="text-xs opacity-75 mt-1">Widget 3</div>
                  </div>
                </Draggable>

                {/* Static Reference Point */}
                <div className="absolute bottom-4 right-4 bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm">
                  <span className="fas fa-info-circle mr-1"></span>
                  Widgets are constrained within the blue frame
                </div>
              </>
            )}
          </DraggableFrame>
        </div>
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

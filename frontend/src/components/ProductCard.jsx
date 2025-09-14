import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart } from "../store/Cart";
import "react-toastify/dist/ReactToastify.css";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { add } = useCart();

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent card click navigation

    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem("user")); // normal user
    const admin = localStorage.getItem("admin_token");    // admin login

    if (!user && !admin) {
      // Neither user nor admin is logged in
      toast.error("You need to login first!", {
        position: "top-right",
        autoClose: 2000,
      });
      navigate("/login");
      return;
    }

    if (admin) {
      // Admin cannot add products to cart
      toast.error("Admin cannot add products to cart", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    // Add to cart if logged in as normal user
    add(product);
    toast(`${product.name} added to cart`, {
      position: "top-right",
      autoClose: 2000,
      style: {
        background: "#FFF3E0",
        color: "#BF360C",
        fontWeight: "500",
        border: "1px solid #FFCC80",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
      },
    });
  };

  const handleView = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <div
      onClick={handleView}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 cursor-pointer flex flex-col overflow-hidden"
    >
      {product.image ? (
        <img
          src={product.image}
          alt={product.name}
          className="h-48 w-full object-cover rounded-t-xl"
        />
      ) : (
        <div className="h-48 bg-gray-100 flex items-center justify-center text-gray-400 rounded-t-xl">
          No Image
        </div>
      )}

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-lg text-gray-800 truncate">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 mt-2 line-clamp-3">
          {product.description || "No description available"}
        </p>

        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="font-bold text-lg text-green-700">₹{product.price}</span>
          <button
            onClick={handleAddToCart}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition shadow hover:shadow-md"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

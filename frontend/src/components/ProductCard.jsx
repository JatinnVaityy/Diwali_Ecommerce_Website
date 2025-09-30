import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart } from "../store/Cart";
import "react-toastify/dist/ReactToastify.css";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { add, items, increase, decrease } = useCart();

  const cartItem = items.find(i => i._id === product._id);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    const admin = localStorage.getItem("admin_token");

    if (!token && !admin) {
      toast.error("You need to login first!", { autoClose: 2000 });
      navigate("/login");
      return;
    }
    if (admin) {
      toast.error("Admin cannot add products to cart", { autoClose: 2000 });
      return;
    }

    add(product);
    toast(`${product.name} added to cart`, { autoClose: 2000 });
  };

  const handleView = () => navigate(`/product/${product._id}`);

  return (
    <div
      onClick={handleView}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 cursor-pointer flex flex-col overflow-hidden"
    >
      {product.image ? (
        <img src={product.image} alt={product.name} className="h-48 w-full object-cover rounded-t-xl" />
      ) : (
        <div className="h-48 bg-gray-100 flex items-center justify-center text-gray-400 rounded-t-xl">No Image</div>
      )}

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-lg text-gray-800 truncate">{product.name}</h3>
        <p className="text-sm text-gray-600 mt-2 line-clamp-3">{product.description || "No description available"}</p>

        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="font-bold text-lg text-green-700">₹{product.price}</span>

          {cartItem ? (
            <div className="flex items-center space-x-2">
              <button
                onClick={(e) => { e.stopPropagation(); decrease(product._id); }}
                className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
              >
                -
              </button>
              <span>{cartItem.qty}</span>
              <button
                onClick={(e) => { e.stopPropagation(); increase(product._id); }}
                className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              className="px-2 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition shadow hover:shadow-md"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

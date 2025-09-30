import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import { useCart } from "../store/Cart";
import { ArrowLeft } from "lucide-react"; // icon library

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [p, setP] = useState(null);
  const { add, items, increase, decrease } = useCart();

  useEffect(() => {
    API.get(`/products/${id}`)
      .then((res) => setP(res.data))
      .catch(console.error);
  }, [id]);

  if (!p)
    return (
      <div className="flex justify-center items-center h-screen text-lg font-medium text-gray-600">
        Loading product...
      </div>
    );

  const cartItem = items.find((i) => i._id === p._id);

  return (
    <div className="min-h-screen bg-[#fff7ed] py-10 px-4 sm:px-6 lg:px-12">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-orange-600 font-medium mb-6 hover:text-orange-700 transition"
      >
        <ArrowLeft size={20} /> Back
      </button>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 bg-white rounded-2xl shadow-lg overflow-hidden border border-orange-100">
        
        {/* Product Image */}
        <div className="flex items-center justify-center bg-orange-50 p-6">
          {p.image ? (
            <img
              src={p.image}
              alt={p.name}
              className="w-full max-h-[450px] object-contain rounded-xl transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <div className="w-full h-[300px] sm:h-[400px] flex items-center justify-center text-gray-400 bg-gray-100 rounded-lg">
              No Image
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-between p-6 sm:p-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
              {p.name}
            </h1>
            <p className="text-gray-600 leading-relaxed mb-6 text-sm sm:text-base">
              {p.description}
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 mb-4">
              <p className="text-2xl font-semibold text-orange-600 mb-2 sm:mb-0">
                ₹{p.price}
              </p>
              <p
                className={`text-sm font-medium ${
                  p.stock > 0 ? "text-green-600" : "text-red-500"
                }`}
              >
                {p.stock > 0 ? `In Stock (${p.stock})` : "Out of Stock"}
              </p>
            </div>
          </div>

          {/* Cart Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            {cartItem ? (
              <>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden w-fit">
                  <button
                    onClick={() => decrease(p._id)}
                    className="px-3 py-2 text-lg font-bold bg-gray-100 hover:bg-gray-200"
                  >
                    -
                  </button>
                  <span className="px-5 py-2 text-lg font-medium">
                    {cartItem.qty}
                  </span>
                  <button
                    onClick={() => increase(p._id)}
                    className="px-3 py-2 text-lg font-bold bg-gray-100 hover:bg-gray-200"
                  >
                    +
                  </button>
                </div>

                {/* Checkout button */}
                <button
                  onClick={() => navigate("/cart")}
                  className="px-6 py-3 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-medium shadow-md transition duration-300"
                >
                  Checkout
                </button>
              </>
            ) : (
              <button
                onClick={() => add(p, 1)}
                disabled={p.stock === 0}
                className={`px-6 py-3 rounded-lg text-white font-medium shadow-md transition duration-300 transform hover:-translate-y-0.5 ${
                  p.stock === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-orange-600 hover:bg-orange-700"
                }`}
              >
                {p.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

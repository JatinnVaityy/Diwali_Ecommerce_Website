import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";
import { useCart } from "../store/Cart";

export default function ProductPage() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const { add } = useCart();

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

  return (
    <div className="min-h-screen bg-[#fff7ed] py-12 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 bg-white rounded-2xl shadow-xl overflow-hidden border border-orange-100">
        {/* Product Image */}
        <div className="flex items-center justify-center bg-orange-50 p-6">
          {p.image ? (
            <img
              src={p.image}
              alt={p.name}
              className="w-full h-96 object-contain rounded-xl transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <div className="w-full h-96 flex items-center justify-center text-gray-400 bg-gray-100 rounded-lg">
              No Image
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-between p-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-3">{p.name}</h1>
            <p className="text-gray-600 leading-relaxed mb-6">{p.description}</p>

            <div className="flex items-center gap-6 mb-4">
              <p className="text-2xl font-semibold text-orange-600">₹{p.price}</p>
              <p
                className={`text-sm font-medium ${
                  p.stock > 0 ? "text-green-600" : "text-red-500"
                }`}
              >
                {p.stock > 0 ? `In Stock (${p.stock})` : "Out of Stock"}
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => add(p, 1)}
              disabled={p.stock === 0}
              className={`px-6 py-3 rounded-lg text-white font-medium shadow-md transition-transform transform hover:-translate-y-1 ${
                p.stock === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-orange-600 hover:bg-orange-700"
              }`}
            >
              {p.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>

            
          </div>
        </div>
      </div>
    </div>
  );
}

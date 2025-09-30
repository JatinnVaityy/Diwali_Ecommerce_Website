import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../store/Cart";

export default function CartPage() {
  const { items, remove, total, increase, decrease, clear } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#fff7ed] px-4">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Your cart is empty.</h2>
        <Link
          to="/"
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
        >
          Shop now
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff7ed] px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 text-center sm:text-left">Your Cart</h2>

        <ul className="space-y-4">
          {items.map((i) => (
            <li
              key={i._id}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 sm:p-6 rounded-2xl shadow-md transition hover:shadow-lg"
            >
              <div className="flex-1 w-full sm:w-auto">
                <div className="font-semibold text-gray-800">{i.name}</div>
                <div className="flex items-center space-x-2 mt-2">
                  <button
                    onClick={() => decrease(i._id)}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                  >
                    -
                  </button>
                  <span className="px-2">{i.qty}</span>
                  <button
                    onClick={() => increase(i._id)}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="mt-3 sm:mt-0 text-right flex flex-col items-end">
                <div className="font-semibold text-gray-800">₹{i.price * i.qty}</div>
                <button
                  onClick={() => remove(i._id)}
                  className="text-red-600 text-sm mt-2 hover:underline"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center border-t border-gray-300 pt-4">
          <div className="text-xl sm:text-2xl font-bold mb-4 sm:mb-0">Total: ₹{total}</div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={clear}
              className="px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition w-full sm:w-auto"
            >
              Clear Cart
            </button>
            <button
              onClick={() => navigate("/checkout")}
              className="px-5 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition w-full sm:w-auto"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

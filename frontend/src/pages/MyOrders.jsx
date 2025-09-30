import React, { useEffect, useState } from "react";
import API from "../api";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/orders/my")
      .then((res) => setOrders(res.data))
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600">Loading your orders...</div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-lg font-semibold">No orders yet.</h2>
        <p className="text-gray-600">
          Start shopping and your orders will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>

      <div className="space-y-6">
        {orders.map((o) => (
          <div
            key={o._id}
            className="border rounded-lg shadow-sm bg-white p-5 hover:shadow-md transition"
          >
            {/* Order Header */}
            <div className="flex justify-between items-center border-b pb-3 mb-3">
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-semibold text-gray-800">{o._id}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Order Status</p>
                <span
  className={`px-3 py-1 text-sm rounded-full ${
    o.status === "cancelled"
      ? "bg-red-100 text-red-700"
      : o.status === "delivered"
      ? "bg-green-100 text-green-700"
      : o.status === "accepted"
      ? "bg-blue-100 text-blue-700"
      : "bg-yellow-100 text-yellow-700"
  }`}
>
  {o.status?.toUpperCase() || "PENDING"}
</span>

              </div>
            </div>

            {/* Items */}
            <div className="space-y-2">
              <p className="font-semibold">Items:</p>
              <ul className="space-y-1">
                {o.items.map((it) => (
                  <li
                    key={String(it.productId)}
                    className="flex justify-between text-sm text-gray-700"
                  >
                    <span>
                      {it.name}{" "}
                      <span className="text-gray-500">x {it.qty}</span>
                    </span>
                    <span>₹{it.price * it.qty}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer */}
            <div className="mt-4 flex justify-between items-center border-t pt-3">
              <span className="font-semibold text-lg text-gray-800">
                Total: ₹{o.totalAmount}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

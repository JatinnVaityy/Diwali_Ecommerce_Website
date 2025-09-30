import React, { useEffect, useState } from "react";
import API from "../api";

function adminHeaders() {
  const token = localStorage.getItem("admin_token");
  return { Authorization: `Bearer ${token}` };
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [confirmCancelId, setConfirmCancelId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch orders from backend
  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders", { headers: adminHeaders() });
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleAccept = async (id) => {
  try {
    await API.put(`/orders/${id}/accept`, {}, { headers: adminHeaders() });
    setOrders((prev) =>
      prev.map((order) =>
        order._id === id ? { ...order, status: "accepted" } : order
      )
    );
  } catch (err) {
    console.error(err);
  }
};

  // Cancel order
  const handleCancel = async (id) => {
    try {
      await API.put(`/orders/${id}/cancel`, {}, { headers: adminHeaders() });
      // Update the order status locally without refetching
      setOrders((prev) =>
        prev.map((order) =>
          order._id === id ? { ...order, status: "cancelled" } : order
        )
      );
      setConfirmCancelId(null); // hide confirmation
    } catch (err) {
      console.error("Error cancelling order:", err);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600">Loading orders...</div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="p-6 text-center text-gray-600">
        <h2 className="text-lg font-semibold">No orders found.</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff7ed] p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">All Orders</h2>

      <div className="space-y-6">
        {orders.map((o) => (
          <div
            key={o._id}
            className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition"
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-semibold text-gray-800">{o._id}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="text-lg font-bold text-orange-600">
                  ₹{o.totalAmount}
                </p>
              </div>
            </div>

            {/* Customer Info */}
            <div className="mb-4">
              <p className="text-sm text-gray-500">Customer Name</p>
              <p className="font-medium text-gray-800">{o.customerName}</p>

              <p className="text-sm text-gray-500 mt-2">Customer Email</p>
              <p className="font-medium text-gray-800">{o.customerEmail}</p>

              <p className="text-sm text-gray-500 mt-2">Shipping Address</p>
              <p className="font-medium text-gray-800">{o.address}</p>
            </div>

            {/* Linked User */}
            {o.user && (
              <div className="mb-4">
                <p className="text-sm text-gray-500">Linked User</p>
                <p className="font-medium text-gray-800">
                  {o.user.name}{" "}
                  <span className="text-gray-500">({o.user.email})</span>
                </p>
              </div>
            )}

            {/* Order Items */}
            <div>
              <p className="text-sm text-gray-500 mb-2">Items</p>
              <ul className="space-y-2">
                {o.items.map((it, idx) => (
                  <li
                    key={String(it.productId) + idx}
                    className="flex justify-between items-center bg-gray-50 p-2 rounded-lg"
                  >
                    <span className="font-medium text-gray-700">{it.name}</span>
                    <span className="text-gray-600">
                      x {it.qty} | ₹{it.price * it.qty}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
{/* Status & Actions */}
<div className="mt-4 flex justify-between items-center">
  <div>
    <p className="text-sm text-gray-500">Order Status</p>
    <p
      className={`font-medium ${
        o.status === "cancelled"
          ? "text-red-600"
          : o.status === "delivered"
          ? "text-green-600"
          : o.status === "accepted"
          ? "text-blue-600"
          : "text-gray-700"
      }`}
    >
      {o.status?.toUpperCase() || "PENDING"}
    </p>
  </div>

  <div className="flex items-center gap-2">
    {/* Accept Button */}
    {o.status === "pending" && (
      <button
        onClick={() => handleAccept(o._id)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Accept Order
      </button>
    )}

    {/* Cancel Button */}
    {o.status !== "cancelled" &&
      (confirmCancelId === o._id ? (
        <>
          <button
            onClick={() => handleCancel(o._id)}
            className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Confirm
          </button>
          <button
            onClick={() => setConfirmCancelId(null)}
            className="px-3 py-1 bg-gray-300 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
        </>
      ) : (
        <button
          onClick={() => setConfirmCancelId(o._id)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Cancel Order
        </button>
      ))}
  </div>
</div>
          </div>
        ))}
      </div>
    </div>  
  );
}

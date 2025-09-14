import React from "react";
import { Link } from "react-router-dom";
import { FaBoxOpen, FaClipboardList, FaTools } from "react-icons/fa";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Admin Dashboard
        </h2>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Manage Products */}
          <Link
            to="/admin/products"
            className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition flex flex-col items-center text-center group"
          >
            <FaBoxOpen className="text-orange-600 text-4xl mb-3 group-hover:scale-110 transition" />
            <h3 className="text-lg font-semibold text-gray-700 group-hover:text-orange-600">
              Manage Products
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              Add, edit, or remove products
            </p>
          </Link>

          {/* View Orders */}
          <Link
            to="/admin/orders"
            className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition flex flex-col items-center text-center group"
          >
            <FaClipboardList className="text-green-600 text-4xl mb-3 group-hover:scale-110 transition" />
            <h3 className="text-lg font-semibold text-gray-700 group-hover:text-green-600">
              View Orders
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              Track and manage customer orders
            </p>
          </Link>

          {/* Other Tools */}
          <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition flex flex-col items-center text-center group cursor-pointer">
            <FaTools className="text-blue-600 text-4xl mb-3 group-hover:scale-110 transition" />
            <h3 className="text-lg font-semibold text-gray-700 group-hover:text-blue-600">
              Other Tools
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              Analytics, reports & more
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

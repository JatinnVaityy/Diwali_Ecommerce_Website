import React from "react";
import { Link } from "react-router-dom";
import { FaBoxOpen, FaClipboardList, FaTools } from "react-icons/fa";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-[#fff7ed] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-10 text-center">
          Admin Dashboard
        </h2>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-8">
          {/* Manage Products */}
          <Link
            to="/admin/products"
            className="flex flex-col items-center bg-white p-8 rounded-3xl shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1 hover:scale-105 text-center"
          >
            <FaBoxOpen className="text-orange-500 text-5xl mb-4 transition-transform transform group-hover:scale-110" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Manage Products
            </h3>
            <p className="text-gray-500 text-sm">
              Add, edit, or remove products
            </p>
          </Link>

          {/* View Orders */}
          <Link
            to="/admin/orders"
            className="flex flex-col items-center bg-white p-8 rounded-3xl shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1 hover:scale-105 text-center"
          >
            <FaClipboardList className="text-green-500 text-5xl mb-4 transition-transform transform group-hover:scale-110" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              View Orders
            </h3>
            <p className="text-gray-500 text-sm">
              Track and manage customer orders
            </p>
          </Link>

          {/* Other Tools */}
          
        </div>
      </div>
    </div>
  );
}

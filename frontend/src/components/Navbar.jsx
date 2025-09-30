import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaShoppingCart,
  FaUser,
  FaSignOutAlt,
  FaBox,
  FaClipboardList,
  FaUserShield,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useCart } from "../store/Cart";

export default function Navbar() {
  const navigate = useNavigate();
  const isUser = !!localStorage.getItem("token");
  const isAdmin = !!localStorage.getItem("admin_token");
  const { items } = useCart();

  const [menuOpen, setMenuOpen] = useState(false);
const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  navigate("/");
};

const logoutAdmin = () => {
  localStorage.removeItem("admin_token");
  navigate("/");
};

  // total quantity instead of just length
  const cartCount = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <nav className="bg-yellow-100 shadow p-4 relative z-50 sticky top-0">
      <div className="container mx-auto flex justify-between items-center">
        {/* Brand */}
        <Link to="/" className="font-bold text-xl text-orange-700">
          गोड आठवणी
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="flex items-center gap-1 hover:text-orange-700">
            <FaHome /> Home
          </Link>

          <Link
            to="/cart"
            className="relative flex items-center gap-1 hover:text-orange-700"
          >
            <FaShoppingCart /> Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs px-1.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {isUser ? (
            <Link
              to="/orders"
              className="flex items-center gap-1 hover:text-orange-700"
            >
              <FaClipboardList /> My Orders
            </Link>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1 hover:text-orange-700"
            >
              <FaUser /> Login
            </Link>
          )}

          {!isAdmin ? (
            <Link
              to="/admin"
              className="flex items-center gap-1 hover:text-orange-700"
            >
              <FaUserShield /> Admin
            </Link>
          ) : (
            <>
              <Link
                to="/admin/products"
                className="flex items-center gap-1 hover:text-orange-700"
              >
                <FaBox /> Products
              </Link>
              <Link
                to="/admin/orders"
                className="flex items-center gap-1 hover:text-orange-700"
              >
                <FaClipboardList /> Orders
              </Link>
            </>
          )}

          {isUser && (
            <button
              onClick={logoutUser}
              className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800"
            >
              <FaSignOutAlt /> Logout
            </button>
          )}
          {isAdmin && (
            <button
              onClick={logoutAdmin}
              className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800"
            >
              <FaSignOutAlt /> Admin Logout
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl text-orange-700"
          onClick={() => setMenuOpen(true)}
        >
          <FaBars />
        </button>
      </div>

      {/* Overlay backdrop */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-yellow-50 shadow-lg z-50 transform transition-transform ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="font-bold text-lg text-orange-700">गोड आठवणी</h2>
          <button onClick={() => setMenuOpen(false)} className="text-2xl">
            <FaTimes />
          </button>
        </div>

        <div className="flex flex-col gap-4 p-4">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2"
          >
            <FaHome /> Home
          </Link>

          <Link
            to="/cart"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 relative"
          >
            <FaShoppingCart /> Cart
            {cartCount > 0 && (
              <span className="absolute left-20 bg-red-600 text-white text-xs px-1.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {isUser ? (
            <Link
              to="/orders"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2"
            >
              <FaClipboardList /> My Orders
            </Link>
          ) : (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2"
            >
              <FaUser /> Login
            </Link>
          )}

          {!isAdmin ? (
            <Link
              to="/admin"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2"
            >
              <FaUserShield /> Admin
            </Link>
          ) : (
            <>
              <Link
                to="/admin/products"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2"
              >
                <FaBox /> Products
              </Link>
              <Link
                to="/admin/orders"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2"
              >
                <FaClipboardList /> Orders
              </Link>
            </>
          )}

          {isUser && (
            <button
              onClick={() => {
                logoutUser();
                setMenuOpen(false);
              }}
              className="flex items-center gap-2 text-red-600"
            >
              <FaSignOutAlt /> Logout
            </button>
          )}
          {isAdmin && (
            <button
              onClick={() => {
                logoutAdmin();
                setMenuOpen(false);
              }}
              className="flex items-center gap-2 text-red-600"
            >
              <FaSignOutAlt /> Admin Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

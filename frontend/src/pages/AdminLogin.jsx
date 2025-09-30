import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"; // import eye icons

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false); // state to toggle password
  const navigate = useNavigate();
const submit = async (e) => {
  e.preventDefault();

  // Prevent admin login if user is already logged in
  if (localStorage.getItem("token")) {
    toast.error(
      "A user is already logged in. Logout first to login as admin.",
      { autoClose: 3000 }
    );
    return;
  }

  try {
    const res = await API.post("/admin/login", form);
    localStorage.setItem("admin_token", res.data.token);
    toast.success("Admin login successful", { autoClose: 2000 });
    navigate("/admin/dashboard");
  } catch (err) {
    toast.error(err.response?.data?.message || "Login failed", {
      autoClose: 3000,
    });
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fff7ed]">
      <form
        onSubmit={submit}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-orange-700">Admin Login</h2>

        <div className="flex flex-col space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            required
          />

          {/* Password field with eye icon */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
              required
            />
            <div
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-medium shadow-md transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}

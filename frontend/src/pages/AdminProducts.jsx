import React, { useEffect, useState } from "react";
import API from "../api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Helper to get admin token header
function adminHeaders() {
  const token = localStorage.getItem("admin_token");
  return { Authorization: `Bearer ${token}` };
}

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: "",
    category: "",
  });
  const [editing, setEditing] = useState(null);

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products", { headers: adminHeaders() });
      setProducts(res.data);
    } catch (err) {
      toast.error("Failed to fetch products ❌");
      console.error(err);
    }
  };

  // Submit product (add or update)
  const submit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      };

      if (editing) {
        const res = await API.put(`/products/${editing}`, payload, {
          headers: adminHeaders(),
        });
        setProducts((prev) =>
          prev.map((p) => (p._id === res.data._id ? res.data : p))
        );
        toast.success("Product updated successfully ✅");
      } else {
        const res = await API.post("/products", payload, {
          headers: adminHeaders(),
        });
        setProducts((prev) => [res.data, ...prev]);
        toast.success("Product added successfully 🎉");
      }

      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error ❌");
      console.error(err);
    }
  };

  // Edit product
  const edit = (product) => {
    setEditing(product._id);
    setForm({
      name: product.name,
      description: product.description || "",
      price: product.price,
      stock: product.stock,
      image: product.image || "",
      category: product.category || "",
    });
  };

  // Delete product
  const remove = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await API.delete(`/products/${id}`, { headers: adminHeaders() });
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Product deleted successfully 🗑️");
    } catch (err) {
      toast.error("Failed to delete product ❌");
      console.error(err);
    }
  };

  // Reset form
  const resetForm = () => {
    setEditing(null);
    setForm({ name: "", description: "", price: "", stock: "", image: "", category: "" });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Manage Products</h2>

      {/* Product Form */}
      <form
        onSubmit={submit}
        className="bg-white p-6 rounded-2xl shadow-md mb-8 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Product Name"
          className="p-3 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none transition"
        />
        <input
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          placeholder="Category"
          className="p-3 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none transition"
        />
        <input
          required
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          placeholder="Price"
          className="p-3 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none transition"
        />
        <input
          required
          type="number"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
          placeholder="Stock"
          className="p-3 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none transition"
        />
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Description"
          className="p-3 border rounded-lg md:col-span-2 focus:ring-2 focus:ring-orange-400 focus:outline-none transition"
        />
        <input
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
          placeholder="Image URL or Base64"
          className="p-3 border rounded-lg md:col-span-2 focus:ring-2 focus:ring-orange-400 focus:outline-none transition"
        />
        <div className="md:col-span-2 flex gap-3">
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium shadow-md transition"
          >
            {editing ? "Update Product" : "Add Product"}
          </button>
          {editing && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Product List */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <div
            key={p._id}
            className="bg-white p-4 rounded-2xl shadow hover:shadow-xl transition flex flex-col"
          >
            {p.image ? (
              <img
                src={p.image}
                alt={p.name}
                className="h-40 w-full object-cover rounded-xl mb-3"
              />
            ) : (
              <div className="h-40 w-full bg-gray-100 flex items-center justify-center text-gray-400 rounded-xl mb-3">
                No Image
              </div>
            )}
            <div className="font-semibold text-lg text-gray-800 truncate">{p.name}</div>
            <div className="text-gray-600">Category: {p.category || "N/A"}</div>
            <div className="text-green-700 font-bold mt-1">₹{p.price}</div>
            <div className="text-gray-500">Stock: {p.stock}</div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => edit(p)}
                className="flex-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                Edit
              </button>
              <button
                onClick={() => remove(p._id)}
                className="flex-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

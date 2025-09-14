import React, { useEffect, useState, useRef } from "react";
import API from "../api";
import ProductCard from "../components/ProductCard";
import { useCart } from "../store/Cart";
import { FaSearch } from "react-icons/fa";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState(""); // search input
  const { add } = useCart();
  const productsRef = useRef(null);

  useEffect(() => {
    API.get("/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  const scrollToProducts = () => {
    if (productsRef.current) {
      productsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Filter products by name or description
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#fff7ed] text-gray-800">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-16 py-16 bg-gradient-to-b from-orange-50 to-[#fff7ed]">
        <div className="max-w-xl text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Celebrate Diwali with <br />
            <span className="text-orange-600">Delicious Snack Delights</span>
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            Treat yourself and your family to homemade snacks made with love 
            and authentic flavors. Perfect for celebrations and gifting!
          </p>
          <div className="flex justify-center md:justify-start gap-4">
            <button
              onClick={scrollToProducts}
              className="bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 transition transform hover:-translate-y-1 shadow-md hover:shadow-lg"
            >
              Shop Now
            </button>
          </div>
        </div>

        <div className="mt-10 md:mt-0 flex justify-center md:justify-end">
          <img
            src="https://www.shutterstock.com/image-vector/illustration-burning-diya-marigold-flowers-600nw-2211259253.jpg"
            alt="Diwali Snacks"
            className="w-[300px] sm:w-[400px] md:w-[500px] rounded-xl shadow-xl border border-gray-200 hover:scale-105 transition-transform duration-300"
          />
        </div>
      </section>

      {/* Products Section */}
      <section ref={productsRef} className="max-w-7xl mx-auto px-6 md:px-16 py-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Our Special Diwali Snacks Collection
        </h2>

        {/* Search Bar */}
        <div className="flex justify-center mb-8">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <p className="text-center text-gray-500">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProducts.map((p) => (
              <ProductCard key={p._id} product={p} onAdd={add} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

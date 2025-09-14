import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import { useCart } from '../store/Cart';

export default function ProductPage(){
  const { id } = useParams();
  const [p, setP] = useState(null);
  const { add } = useCart();

  useEffect(() => {
    API.get(`/products/${id}`).then(res => setP(res.data)).catch(console.error);
  }, [id]);

  if(!p) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      {p.image && <img src={p.image} alt={p.name} className="w-full h-64 object-cover rounded mb-4" />}
      <h1 className="text-2xl font-bold">{p.name}</h1>
      <p className="mt-2">{p.description}</p>
      <p className="mt-4 font-bold">₹{p.price}</p>
      <p className="text-sm text-gray-600">Stock: {p.stock}</p>
      <div className="mt-4">
        <button className="px-4 py-2 bg-green-600 text-white rounded mr-2" onClick={() => add(p,1)}>Add to cart</button>
      </div>
    </div>
  );
}

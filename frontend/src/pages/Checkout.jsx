import React, { useState } from 'react';
import { useCart } from '../store/Cart';
import API from '../api';
import { useNavigate } from 'react-router-dom';

export default function Checkout(){
  const { items, clear, total } = useCart();
  const [form, setForm] = useState({ customerName: '', customerEmail: '', address: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (!items.length) return alert('Cart empty');
    setLoading(true);
    try {
      const payload = { ...form, items: items.map(i => ({ productId: i._id, qty: i.qty }))};
      const res = await API.post('/orders', payload);
      clear();
      alert('Order placed. ID: ' + res.data.orderId);
      navigate('/orders');
    } catch (err) {
      alert(err.response?.data?.message || 'Error placing order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="max-w-md mx-auto bg-white p-6 rounded shadow space-y-3">
      <h2 className="text-xl font-bold">Checkout</h2>
      <input className="border p-2 w-full" placeholder="Full name" value={form.customerName} onChange={e => setForm({...form, customerName: e.target.value})} />
      <input className="border p-2 w-full" placeholder="Email" value={form.customerEmail} onChange={e => setForm({...form, customerEmail: e.target.value})} />
      <textarea className="border p-2 w-full" placeholder="Address" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
      <div className="flex justify-between items-center">
        <div>Total: <strong>₹{total}</strong></div>
        <button disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded">{loading ? 'Placing...' : 'Place order'}</button>
      </div>
    </form>
  );
}

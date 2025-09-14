import React, { useEffect, useState } from 'react';
import API from '../api';

function adminHeaders() {
  const t = localStorage.getItem('admin_token');
  return { Authorization: `Bearer ${t}` };
}

export default function AdminOrders(){
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    API.get('/orders', { headers: adminHeaders() }).then(res => setOrders(res.data)).catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2 className="text-2xl mb-4">All Orders</h2>
      {orders.map(o => (
        <div key={o._id} className="bg-white p-4 rounded shadow mb-3">
          <div><b>ID:</b> {o._id}</div>
          <div><b>User:</b> {o.user?.name} ({o.user?.email})</div>
          <div><b>Total:</b> ₹{o.totalAmount}</div>
          <div><b>Items:</b>
            <ul className="pl-4 list-disc">
              {o.items.map(it => <li key={String(it.productId)}>{it.name} x {it.qty}</li>)}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}

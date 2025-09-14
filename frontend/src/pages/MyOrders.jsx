import React, { useEffect, useState } from 'react';
import API from '../api';

export default function MyOrders(){
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    API.get('/orders/my').then(res => setOrders(res.data)).catch(err => {
      console.error(err);
      // if 401, user not logged in
    });
  }, []);

  return (
    <div>
   
      {orders.length === 0 ? <div>No orders yet.</div> : orders.map(o => (
        <div key={o._id} className="border p-4 rounded mb-3 bg-white">
          <div><b>Order ID:</b> {o._id}</div>
          <div><b>Total:</b> ₹{o.totalAmount}</div>
          <div><b>Status:</b> {o.paymentStatus}</div>
          <div className="mt-2">
            <b>Items:</b>
            <ul className="pl-4 list-disc">
              {o.items.map(it => <li key={String(it.productId)}>{it.name} x {it.qty}</li>)}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}

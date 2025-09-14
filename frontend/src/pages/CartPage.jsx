import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../store/Cart';

export default function CartPage(){
  const { items, remove, total } = useCart();
  const navigate = useNavigate();

  return (
    <div>
      
      {items.length === 0 ? <div>Your cart is empty. <Link to="/">Shop now</Link></div> : (
        <div>
          <ul className="space-y-2">
            {items.map(i => (
              <li key={i._id} className="flex justify-between bg-white p-3 rounded shadow">
                <div>
                  <div className="font-semibold">{i.name}</div>
                  <div className="text-sm">Qty: {i.qty}</div>
                </div>
                <div className="text-right">
                  <div>₹{i.price * i.qty}</div>
                  <button onClick={() => remove(i._id)} className="text-red-600 text-sm">Remove</button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between items-center">
            <div className="text-lg font-bold">Total: ₹{total}</div>
            <button onClick={() => navigate('/checkout')} className="px-4 py-2 bg-blue-600 text-white rounded">Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
}

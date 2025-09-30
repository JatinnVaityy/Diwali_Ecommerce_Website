import React, { useState } from 'react';
import { useCart } from '../store/Cart';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaWhatsapp } from 'react-icons/fa';

export default function Checkout() {
  const { items, clear, total } = useCart();
  const [form, setForm] = useState({ customerName: '', customerEmail: '', address: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const whatsappNumber = "+918291347493"; // your single number

  // check if form is valid
  const isFormValid = form.customerName && form.customerEmail && form.address && items.length > 0;

  // Create WhatsApp message with full details
  const whatsappMessage = encodeURIComponent(
    `New Order Request\n\n` +
    `Customer Details:\n` +
    `Name: ${form.customerName}\n` +
    `Email: ${form.customerEmail}\n` +
    `Address: ${form.address}\n\n` +
    `Products:\n${items.map(i => `- ${i.name} x ${i.qty} = ₹${i.price * i.qty}`).join('\n')}\n\n` +
    `Total: ₹${total}`
  );

  const submit = async (e) => {
    e.preventDefault();
    if (!items.length) {
      toast.error('Your cart is empty!');
      return;
    }
    if (!isFormValid) {
      toast.error('Please fill all details before placing order');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...form,
        items: items.map(i => ({ productId: i._id, qty: i.qty, price: i.price })),
      };
      const orderRes = await API.post('/orders', payload);
      const orderId = orderRes.data.orderId;

      const rzpRes = await API.post('/razorpay/create', { orderId });
      const { id, amount, currency, key } = rzpRes.data;

      const options = {
        key,
        amount,
        currency,
        name: 'गोड आठवणी',
        description: 'Order Payment',
        order_id: id,
        prefill: {
          name: form.customerName,
          email: form.customerEmail,
        },
        theme: { color: '#F97316' },
        handler: async function (response) {
          try {
            const verifyRes = await API.post('/razorpay/verify', {
              orderId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.success) {
              toast.success('Payment successful!', { autoClose: 3000 });
              clear();
              navigate('/orders');
            }
          } catch (err) {
            console.error(err);
            toast.error('Payment verification failed', { autoClose: 3000 });
          }
        },
        modal: {
          ondismiss: () => toast.info('Payment cancelled', { autoClose: 2000 }),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Error placing order', { autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#fff7ed] px-4 py-10">
      <form
        onSubmit={submit}
        className="w-full sm:w-full md:max-w-lg lg:max-w-xl bg-white p-6 sm:p-8 md:p-10 rounded-2xl shadow-lg space-y-5 border border-orange-200"
      >
        <button
          onClick={() => navigate(-1)}
          type="button"
          className="self-start px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
        >
          ←
        </button>

        <h2 className="text-2xl sm:text-3xl font-bold text-orange-700 text-center">Checkout</h2>

        <input
          className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
          placeholder="Full Name"
          value={form.customerName}
          onChange={e => setForm({ ...form, customerName: e.target.value })}
          required
        />

        <input
          type="email"
          className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
          placeholder="Email"
          value={form.customerEmail}
          onChange={e => setForm({ ...form, customerEmail: e.target.value })}
          required
        />

        <textarea
          className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition resize-none"
          placeholder="Address"
          value={form.address}
          onChange={e => setForm({ ...form, address: e.target.value })}
          required
        />

        {!isFormValid && (
          <p className="text-red-500 text-sm font-medium">⚠️ Fill all details to proceed</p>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="text-lg font-semibold">
            Total: <span className="text-green-600">₹{total}</span>
          </div>
          <button
            type="submit"
            disabled={loading || !isFormValid}
            className={`px-5 py-3 rounded-lg font-medium text-white shadow-md transition w-full sm:w-auto ${
              loading || !isFormValid
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-orange-600 hover:bg-orange-700'
            }`}
          >
            {loading ? 'Processing...' : 'Place Order'}
          </button>
        </div>

        {/* WhatsApp button */}
        <a
          href={
            isFormValid
              ? `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${whatsappMessage}`
              : undefined
          }
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center justify-center gap-2 mt-4 px-5 py-3 rounded-lg transition 
            ${isFormValid ? "bg-green-600 hover:bg-green-700 text-white cursor-pointer" : "bg-gray-300 text-gray-500 cursor-not-allowed"}
          `}
          onClick={(e) => {
            if (!isFormValid) {
              e.preventDefault();
              toast.error("Please fill all details before contacting on WhatsApp");
            }
          }}
        >
          <FaWhatsapp size={20} />
          Contact via WhatsApp
        </a>
      </form>
    </div>
  );
}

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import api from '../lib/api';
import { toast } from 'react-toastify';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';

const fetcher = (url) => api.get(url).then(res => res.data);

export default function Cart() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // محاكاة السلة المحفوظة في localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const cartItems = JSON.parse(savedCart);
      setItems(cartItems);
      calculateTotal(cartItems);
    }
  }, []);

  const calculateTotal = (cartItems) => {
    const sum = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    setTotal(sum);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedItems = items.map(item =>
      item._id === productId ? { ...item, quantity: newQuantity } : item
    );
    setItems(updatedItems);
    calculateTotal(updatedItems);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
  };

  const removeItem = (productId) => {
    const updatedItems = items.filter(item => item._id !== productId);
    setItems(updatedItems);
    calculateTotal(updatedItems);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
    toast.info('Item removed from cart');
  };

  const checkout = async () => {
    if (items.length === 0) {
      toast.warning('Cart is empty');
      return;
    }

    try {
      // Create order
      const orderResponse = await api.post('/orders', {
        items: items.map(item => ({ productId: item._id, quantity: item.quantity })),
        shippingAddress: {
          alias: 'Home',
          street: '123 Main St',
          city: 'Cairo',
          country: 'EG'
        },
        paymentMethod: 'card'
      });

      toast.success('Order created successfully!');
      localStorage.removeItem('cart');
      setItems([]);
      setTotal(0);
    } catch (error) {
      toast.error('Failed to create order');
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <Link href="/products" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {items.map((item) => (
              <div key={item._id} className="bg-white rounded-lg shadow-md p-6 mb-4 flex items-center gap-4">
                <img
                  src={item.image || '/placeholder.jpg'}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-blue-600 font-semibold">${item.price}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    className="p-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    <FaMinus />
                  </button>
                  <span className="w-8 text-center font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="p-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    <FaPlus />
                  </button>
                </div>

                <div className="text-lg font-semibold min-w-[100px] text-right">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>

                <button
                  onClick={() => removeItem(item._id)}
                  className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 h-fit">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${(total * 0.1).toFixed(2)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${(total * 1.1).toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={checkout}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold"
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
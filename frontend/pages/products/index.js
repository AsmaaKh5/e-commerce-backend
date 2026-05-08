import { useState, useEffect } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import api from '../../lib/api';
import { toast } from 'react-toastify';

const fetcher = (url) => api.get(url).then(res => res.data);

export default function Products() {
  const [page, setPage] = useState(1);
  const { data, error } = useSWR(`/products?page=${page}&limit=12`, fetcher);

  const addToCart = async (product) => {
    try {
      // احفظ في localStorage للآن
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItem = cart.find(item => item._id === product._id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }
      
      localStorage.setItem('cart', JSON.stringify(cart));
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  if (error) return <div className="container mx-auto px-4 py-8">Failed to load products</div>;
  if (!data) return <div className="container mx-auto px-4 py-8">Loading...</div>;

  const { products, pagination } = data.data;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Products</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products && products.map((product) => (
          <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
            <img
              src={product.images?.[0] || '/placeholder.jpg'}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-2 line-clamp-2">{product.name}</h2>
              <p className="text-gray-600 mb-2">${product.price}</p>
              <div className="flex gap-2">
                <Link href={`/products/${product._id}`} className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-center hover:bg-blue-700 text-sm">
                  Details
                </Link>
                <button
                  onClick={() => addToCart(product)}
                  className="flex-1 bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 text-sm"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {pagination && (
        <div className="mt-8 flex justify-center space-x-2">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
          >
            Previous
          </button>
          <span className="px-4 py-2">Page {page} of {pagination.totalPages}</span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === pagination.totalPages}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
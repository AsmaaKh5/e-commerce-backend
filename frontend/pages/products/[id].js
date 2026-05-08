import { useState } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import api from '../../lib/api';

const fetcher = (url) => api.get(url).then(res => res.data);

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { data, error } = useSWR(id ? `/products/${id}` : null, fetcher);
  const [quantity, setQuantity] = useState(1);

  if (error) return <div className="container mx-auto px-4 py-8">Failed to load product</div>;
  if (!data) return <div className="container mx-auto px-4 py-8">Loading...</div>;

  const product = data.data.product;

  const addToCart = async () => {
    try {
      await api.post('/cart/items', { productId: product._id, quantity });
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={product.images[0] || '/placeholder.jpg'}
            alt={product.name}
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl text-blue-600 font-semibold mb-4">${product.price}</p>
          <p className="text-gray-600 mb-6">{product.description}</p>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-20 px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <button
            onClick={addToCart}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 mr-4"
          >
            Add to Cart
          </button>

          <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">
            Add to Wishlist
          </button>
        </div>
      </div>
    </div>
  );
}
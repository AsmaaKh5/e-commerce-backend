import { useState, useEffect } from 'react';
import useSWR from 'swr';
import api from '../lib/api';
import { toast } from 'react-toastify';

const fetcher = (url) => api.get(url).then(res => res.data);

export default function Categories() {
  const { data, error } = useSWR('/categories', fetcher);

  if (error) return <div className="container mx-auto px-4 py-8">Failed to load categories</div>;
  if (!data) return <div className="container mx-auto px-4 py-8">Loading...</div>;

  const { categories } = data.data;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Categories</h1>

      {categories && categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category._id} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-2">{category.name}</h2>
              <p className="text-gray-600 mb-4">{category.description || 'No description'}</p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                View Products
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No categories available</p>
      )}
    </div>
  );
}
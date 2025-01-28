import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const Store = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  // Fetch products data
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params= new URLSearchParams(location.search);
        const response = await axios.get('http://localhost:3000/api/product',{params},{ withCredentials: true });
        setProducts(response.data);
        console.log(response.data);
      } catch (err) {
        setError('Error fetching products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // Empty dependency array means this effect runs once when the component mounts

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Product List</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white shadow-md rounded-lg overflow-hidden"
          >
            <img
              src={product.image} // Assuming your API sends an image URL for the product
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-gray-600">{product.description}</p>
              <p className="font-bold line-through mt-2">${product.price}</p>
              <p className="font-bold ">Discounted Price: {product.discountedPrice}</p>
              <p className="text-sm text-gray-500">Category: {product.category}</p>
              <p className="text-sm text-gray-500">Stock: {product.stock}</p>
              <p className="text-sm text-gray-500">Discount: {product.discount}%</p>
              
              <p className="text-sm text-gray-500">Tags: {product.tags.join(', ')}</p>
              <p className="text-sm text-gray-500">Brands: {product.brands}</p>
              
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Store;

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProducts } from '../../context/productContext';
import LoadingComponent from '../helper/loadingComponent';

const ProductDetails = () => {
  const { id } = useParams();
  const { getProductById } = useProducts();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      console.log(id)
      console.log(product)
      const foundProduct = await getProductById(id);
      setProduct(foundProduct);
      console.log(foundProduct)
      setLoading(false);
    };

    fetchProduct();
  }, [id, getProductById]);

  if (loading) return <LoadingComponent />;
  if (!product) return <p className="text-center text-red-500">Product not found</p>;

  return (
    <div className="max-w-4xl mx-auto p-5 bg-white shadow-lg rounded-xl">
      <img src={product.thumbnail} alt={product.title} className="w-full h-96 object-cover rounded-md" />
      <h1 className="text-3xl font-bold mt-4">{product.title}</h1>
      <p className="text-gray-600 mt-2">{product.description}</p>
      
      <div className="flex items-center gap-2 mt-4">
        <p className="text-gray-400 line-through text-sm">${product.price}</p>
        <p className="text-xl font-bold text-green-600">
          ${((1 - 0.01 * product.discountPercentage) * product.price).toFixed(2)}
        </p>
      </div>
      
      <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300">
        Add to Cart
      </button>
    </div>
  );
};

export default ProductDetails;

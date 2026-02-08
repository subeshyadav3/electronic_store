import React from 'react';
import { useNavigate } from 'react-router-dom';
import AddToCartButton from './productDetailsIndividual/AddToCartButton';

const ProductCard = ({ products }) => {
  const navigate = useNavigate();

  const truncateDescription = (description, wordLimit = 15) => {
    const words = description.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return description;
  };

  const handleProductClick = () => {
    navigate(`/store/${products._id}`);
  };

  return (
    <div
      key={products._id}
      onClick={handleProductClick}
      className="bg-white shadow-lg w-[350px] md:w-full mt-5 mr-5 mb-5 rounded-xl transform transition-transform duration-300 hover:scale-105 flex flex-col h-[500px]"
    >
      <img
        src={products.thumbnail}
        alt={products.title}
        className="w-full h-56 object-cover hover:opacity-90 transition-opacity duration-300 rounded-t-xl"
      />

      <div className="p-6 flex flex-col flex-1">
        <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
          {products.title}
        </h2>

        <p className="text-gray-600 text-sm mb-4 flex-1 line-clamp-3">
          {truncateDescription(products.description)}
        </p>


        <div className="flex items-center gap-2 mb-3">
          <p className="text-gray-400 line-through text-sm">${products.price}</p>
          <p className="text-lg font-bold text-green-600">
            ${((1 - 0.01 * products.discountPercentage) * products.price).toFixed(2)}
          </p>
        </div>

        <div onClick={(e) => e.stopPropagation()} className="mt-auto">
          <AddToCartButton productId={products._id} />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

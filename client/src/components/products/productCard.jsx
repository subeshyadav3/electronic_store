import React from 'react';
import { useNavigate } from 'react-router-dom';
import AddToCartButton from './productDetailsIndividual/AddToCartButton';
import { Star } from 'lucide-react';

const ProductCard = ({ products }) => {
  const navigate = useNavigate();

  const handleProductClick = () => {
    navigate(`/store/${products?._id}`);
  };

  const discountPrice = (
    (1 - 0.01 * (products?.discountPercentage || 0)) *
    (products?.price || 0)
  ).toFixed(2);

  const truncateDescription = (description, wordLimit = 15) => {
    if (!description) return '';
    const words = description.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return description;
  };

  return (
    <div
      onClick={handleProductClick}
      className="group bg-white shadow-lg w-[350px] md:w-full mt-5 mr-5 mb-5 rounded-xl transform transition-transform duration-300 hover:scale-105 flex flex-col h-[500px] overflow-hidden cursor-pointer"
    >

      <div className="relative h-56 w-full overflow-hidden bg-slate-50 rounded-t-xl">
        <img
          src={products?.thumbnail || '/placeholder.svg'}
          alt={products?.title || 'Product'}
          className="w-full h-full object-cover hover:opacity-90 transition-opacity duration-300"
        />
        {products?.discountPercentage > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
            -{Math.round(products.discountPercentage)}%
          </div>
        )}
      </div>


      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
          <span className="text-xs text-slate-500 font-medium">{products?.rating || '4.5'}</span>
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {products?.title || 'Untitled Product'}
        </h2>

        <p className="text-gray-600 text-sm mb-4 flex-1 line-clamp-3">
          {truncateDescription(products?.description)}
        </p>

        <div className="flex items-center gap-2 mb-3">
          <p className="text-gray-400 line-through text-sm">${products?.price || 0}</p>
          <p className="text-lg font-bold text-green-600">${discountPrice}</p>
        </div>

        <div onClick={(e) => e.stopPropagation()} className="mt-auto">
          <AddToCartButton productId={products?._id} />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
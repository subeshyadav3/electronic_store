import React from 'react';

const ProductCard = ({ products }) => {
  const truncateDescription = (description, wordLimit = 15) => {
    const words = description.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return description;
  };

  return (
    <div
      key={products._id}
      className="bg-white shadow-lg w-fit mb-5 rounded-xl transform transition-transform duration-300 hover:scale-105"
    >
 
      <img
        src={products.thumbnail}
        alt={products.title}
        className="w-full h-56 object-cover hover:opacity-90 transition-opacity duration-300"
      />

 
      <div className="p-6">

        <h2 className="text-xl font-bold text-gray-800 mb-2">{products.title}</h2>


        <p className="text-gray-600 text-sm mb-4">{truncateDescription(products.description)}</p>


        <div className="flex items-center gap-2 mb-3">
          <p className="text-gray-400 line-through text-sm">${products.price}</p>
          <p className="text-lg font-bold text-green-600">${((1-0.01*products.discountPercentage)*products.price).toFixed(2)}</p>
        </div>

    
        <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

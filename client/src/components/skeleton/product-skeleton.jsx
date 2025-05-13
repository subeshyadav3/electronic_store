import React from 'react';

const ProductSkeleton = () => {
  return (
    <div className="bg-white shadow-lg w-[350px] mt-5 md:w-full mr-5 mb-5 rounded-xl animate-pulse">

      <div className="w-full h-56 bg-gray-300 rounded-t-xl" />


      <div className="p-6">

        <div className="h-10 bg-gray-300 rounded w-3/4 mb-4"></div>


        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        </div>

    
        <div className="flex items-center gap-2 mb-3">
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          <div className="h-5 bg-gray-400 rounded w-1/3"></div>
        </div>

  
        <div className="h-10 bg-gray-300 rounded w-full"></div>
      </div>
    </div>
  );
};

export default ProductSkeleton;

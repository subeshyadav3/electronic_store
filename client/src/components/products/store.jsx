import React, { useState } from 'react';
import { useProducts } from '../../context/productContext';
import ProductCard from './productCard';
import SidebarComponent from './sideBarComponent';

const Store = () => {
  const { products, setFilter, setPriceRangeFilter } = useProducts();

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000000);

  const handlePriceRangeChange = (e) => {
    const { value } = e.target;
    if (e.target.name === 'min') {
      setMinPrice(value);
    }
    if (e.target.name === 'max') {
      setMaxPrice(value);
    }
    setPriceRangeFilter(`${minPrice}-${maxPrice}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-4">
      
      <div className="lg:w-[250px] bg-slate-100 p-4">
        <SidebarComponent 
          setFilter={setFilter} 
          setPriceRangeFilter={setPriceRangeFilter} 
          handlePriceRangeChange={handlePriceRangeChange} 
          minPrice={minPrice} 
          maxPrice={maxPrice} 
        />
      </div>


      <div className="flex flex-col items-center p-5">
      <div>
      <input type="text" name="title" placeholder="Search" className="p-2 mb-5 min-w-[300px] border border-gray-300 rounded-md " onChange={setFilter} />
      <button name='search' value='search' onClick={setFilter} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-300">Search</button>
      </div>
        <div className="grid grid-cols-1 ml-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          
          {products.map((product) => (
            <ProductCard key={product._id} products={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Store;

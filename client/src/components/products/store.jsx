import React, { useEffect } from 'react';
import {useProducts} from '../../context/productContext';
import ProductCard from './productCard';

const Store = () => {
  const { products, loading, error, setCategoryFilter, setPriceRangeFilter } = useProducts();

  // // Filter by category
  // const handleCategoryChange = (category) => {
  //   setCategoryFilter(category);
  // };

  // // Filter by price range
  // const handlePriceRangeChange = (min, max) => {
  //   setPriceRangeFilter(min, max);
  // };

  // useEffect(() => {
  //   // You can call the filter functions to apply default filters if needed
  //   // handleCategoryChange('Electronics'); // Example to set default category
  // }, []);

 

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Product List</h1>

      {/* Filters */}
      <div className="mb-4">
        <label>
          Category:
          <select onChange={(e) => handleCategoryChange(e.target.value)}>
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Fashion">Fashion</option>
            {/* Add more categories as needed */}
          </select>
        </label>

        <label>
          Price Range:
          <input
            type="number"
            placeholder="Min Price"
            onChange={(e) => handlePriceRangeChange(e.target.value, 1000)}
          />
          -
          <input
            type="number"
            placeholder="Max Price"
            onChange={(e) => handlePriceRangeChange(0, e.target.value)}
          />
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Store;

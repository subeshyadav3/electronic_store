import React, { useState, useEffect } from 'react';
import { useProducts } from '../../context/productContext';
import ProductCard from './productCard';
import SidebarComponent from './sideBarComponent';
import LoadingComponent from '../helper/loadingComponent';
import ProductSkeleton from '../skeleton/product-skeleton';

const Store = () => {
  const { products, setFilter, setPriceRangeFilter, loading } = useProducts();

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [page, setPage] = useState(1);

  console.log(products);

  useEffect(() => {
    setPriceRangeFilter(`${minPrice}-${maxPrice}`);
  }, [minPrice, maxPrice]);

  const handlePriceRangeChange = (e) => {
    const { name, value } = e.target;
    if (name === 'min') setMinPrice(value);
    if (name === 'max') setMaxPrice(value);
  };


  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= products.length / 12) {
      setPage(newPage);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6 min-h-screen">
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
        <div className="mb-5 w-full max-w-[500px] flex-col flex gap-2 sm:flex-row">
          <input
            type="text"
            name="title"
            placeholder="Search"
            className="p-2 mb-3 w-full border border-gray-300 rounded-md"
            onChange={setFilter}
          />
          <button
            name="search"
            value="search"
            onClick={setFilter}
            className="w-fit bg-blue-500 text-white px-4 py-2 h-fit rounded-md hover:bg-blue-600 transition-colors duration-300"
          >
            Search
          </button>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading && (
            Array.from({ length: 4 }).map((_, idx) => <ProductSkeleton key={idx} />)
          )}


          {!products || products.length === 0 ? (
            <h1 className="text-2xl text-red-500">No products found</h1>
          ) : (
            products.slice((page - 1) * 12, page * 12)
              .map((product) => (
                <ProductCard key={product._id} products={product} />
              ))
          )}
        </div>


        {/* Pagination Controls */}
        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-300 text-gray-600 rounded-md hover:bg-gray-400 disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-lg font-bold">{page} / {parseInt(products.length / 12)}</span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === 5}
            className="px-4 py-2 bg-gray-300 text-gray-600 rounded-md hover:bg-gray-400 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Store;

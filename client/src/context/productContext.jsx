import React, { createContext, useState, useEffect, useContext } from 'react';
import apiClient from '../components/helper/axios';

// Create Context
const ProductContext = createContext();

// Custom Hook to Use Product Context
export const useProducts = () => {
  return useContext(ProductContext);
};

// Product Provider Component
const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    priceRange: { min: 0, max: 1000 },
  });

  // Fetch products based on filters
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let query = '/product';
        
        // Apply filters to the query
        const { category, priceRange } = filters;
        if (category) query += `?category=${category}`;
        if (priceRange) query += `&minPrice=${priceRange.min}&maxPrice=${priceRange.max}`;

        const response = await apiClient.get(query);
        setProducts(response.data);
      } catch (err) {
        setError('Error fetching products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]); // Re-run whenever filters change

  // Set category filter
  const setCategoryFilter = (category) => {
    setFilters((prev) => ({ ...prev, category }));
  };

  // Set price range filter
  const setPriceRangeFilter = (min, max) => {
    setFilters((prev) => ({ ...prev, priceRange: { min, max } }));
  };

  // Set product by ID filter
  const getProductById = async (id) => {
    try {
      const response = await apiClient.get(`/product/${id}`);
      return response.data;
    } catch (err) {
      setError('Error fetching product by ID');
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        setCategoryFilter,
        setPriceRangeFilter,
        getProductById,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;

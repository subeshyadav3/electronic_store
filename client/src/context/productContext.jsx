import React, { createContext, useState, useEffect, useContext } from 'react';
import apiClient from '../components/helper/axios';
import { set } from 'mongoose';

const ProductContext = createContext();


export const useProducts = () => {
  return useContext(ProductContext);
};

const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    title:'',
    price:'',
    category:'',
    discount:null,
    tags:'',
    brands:'',    
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
       
        console.log(filters);
        const response = await apiClient.get('/product',{params:filters});
        
        setProducts(response.data);
        
      } catch (err) {
        setError('Error fetching products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]); 

  // const setCategoryFilter = (category) => {
  //   setFilters({...filters,category:category});
  // }

  useEffect(() => {
    // console.log("Product: ", products[5].title);
    console.log(products)
  }, [products,filters]);

  const setPriceRangeFilter = (price) => {
    
    setFilters({...filters,price:price});
  }

  const [isSelected, setIsSelected] = useState([]);
  
  // const setSearchFilter = (name) => {
  //   setFilters({...filters,name:name});
  // }

  // const setDiscountFilter = (discount) => {
  //   setFilters({...filters,discount:discount});
  // }

  // const setBrandsFilter = (brands) => {
  //   setFilters({...filters,brands:brands});
  // }

  // const setTagsFilter = (tags) => {
  //   setFilters({...filters,tags:tags});
  // }


  const setFilter = (e) => {
    const { name, value } = e.target;
    //remove on double tap
    if(isSelected.includes(value)){
      setIsSelected(isSelected.filter((item)=> item!=value));
      setFilters({...filters,[name]:''});
      return;
    }
    else{
      setIsSelected([...isSelected, value]);
    }
    console.log("Is selected value: ", isSelected);
    setFilters({ ...filters, [name]: value });
  };


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
        // setCategoryFilter,
        setPriceRangeFilter,
        // setSearchFilter,
        // setDiscountFilter,
        // setBrandsFilter,
        // setTagsFilter,
        setFilter,
        getProductById,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;

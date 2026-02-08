import React, { createContext, useState, useEffect, useContext } from 'react';
import apiClient from '../components/helper/axios';
import { use } from 'react';
import { useToast } from './toastContext';

const ProductContext = createContext();


export const useProducts = () => {
  return useContext(ProductContext);
};

const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showToast } = useToast();
  
  const [filters, setFilters] = useState({
    title:'',
    price:'',
    category:'',
    discount:null,
    tags:'',
    brands:'',
   
  });

  useEffect(() => {
    setFilters({
      title:'',
      price:'',
      category:'',
      discount:null,
      tags:'',
      brands:'',
    });

  }, [window.location.pathname]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
       
        // console.log(filters);
        const response = await apiClient.get('/product',{params:filters});
        setAdminProducts(response.data);
        setProducts(response.data);
        
      } catch (err) {
        setError('Error fetching products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]); 

  useEffect(() => {

  }, [products,filters]);

  const setPriceRangeFilter = (price) => {
    
    setFilters({...filters,price:price});
  }

  const [isSelected, setIsSelected] = useState([]);
  
  const homeFilterProduct=async(productType)=>{
    try {
        setFilter({
          title:'',
          price:'',
          category:productType,
          discount:null,
          tags:'',
          brands:'',    
        })
        return products
    }
     catch (error) {
      setError(`Error: ${error}`)
    }
  
  }

  const getHomeProducts = async (category) => {
    try {
      const response=await apiClient.get('/product',{params:{category}});

      return response.data;
    } catch (err) {
      setError('Error fetching products by category');
    }
  }

  const setFilter = (e) => {
   
    const { name, value } = e.target;
    // console.log("Name: ", e.target.name);
    // console.log("Value: ", value);
    //remove on double tap
    if(isSelected.includes(value)){
      setIsSelected(isSelected.filter((item)=> item!=value));
      setFilters({...filters,[name]:''});
      return;
    }
    else{
      setIsSelected([...isSelected, value]);
    }
    // console.log("Is selected value: ", isSelected);
    setFilters({ ...filters, [name]: value });
  };

  const addComment = async (id, comment,user,reply,parentId) => {
    try {
      const response = await apiClient.post(`/product/comment/${id}`, { comment,user,reply,parentId });
      showToast('Comment added successfully', 'success');
      // console.log(response);  
      // console.log(parentId,reply);
    } catch (err) {
      showToast('Error adding comment', 'error');
      setError('Error adding comment');
    }
  };


  const getProductById = async (id) => {
    try {
      const response = await apiClient.get(`/product/${id}`);
      return response.data;
    } catch (err) {
      setError('Error fetching product by ID');
    }
  };

  //for admin products manage
  const [adminProducts, setAdminProducts] = useState([]);

  const getAdminAllProducts = async () => {
    try {
      const response = await apiClient.get('/product');
      
      setAdminProducts(response.data);
      
    } catch (err) {
      setError('Error fetching products');
    }
  }
  
  const adminProductUpdate= async (id, data) => {
    try{
        const response=await apiClient.put(`/product/${id}`,data);
        // console.log(response);

    }
    catch(err){
      setError('Error updating product');
    }
  }

  const adminProductDelete = async (id) => {
      try{
        const response = await apiClient.delete(`/product/${id}`);
        console.log("resonse",response)
        showToast('Product deleted successfully', 'success');
        // return alert("Product deleted successfully"); //testing
      }
      catch(err){
        setError('Error deleting product');
      }

  }

  const adminCreateProduct = async (data) => {
    try{
      const response = await apiClient.post(`/product`,data);
      // console.log(response);
    }
    catch(err){
      setError('Error creating product');
    }
  }


  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        setLoading,
        setPriceRangeFilter,
        addComment,
        homeFilterProduct,
        getAdminAllProducts,
        adminProducts,
        adminProductDelete,
        adminProductUpdate,
        setFilter,
        getProductById,
        getHomeProducts,
        adminCreateProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;

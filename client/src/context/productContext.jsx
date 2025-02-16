import React, { createContext, useState, useEffect, useContext } from 'react';
import apiClient from '../components/helper/axios';
import LoadingComponent from '../components/helper/loadingComponent';


const ProductContext = createContext();


export const useProducts = () => {
  return useContext(ProductContext);
};

const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [filters, setFilters] = useState({
    title:'',
    price:'',
    category:'',
    discount:null,
    tags:'',
    brands:'',
    page,
    limit,    
  });

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

  // const setCategoryFilter = (category) => {
  //   setFilters({...filters,category:category});
  // }

  useEffect(() => {
    // console.log("Product: ", products[5].title);
    // console.log(products)
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

  // filtering to show products in home

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
    console.log("Name: ", e.target.name);
    console.log("Value: ", value);
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

  const addComment = async (id, comment,user) => {
    try {
      const response = await apiClient.post(`/product/comment/${id}`, { comment,user });
      console.log(response);  
    } catch (err) {
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
        console.log(response);

    }
    catch(err){
      setError('Error updating product');
    }
  }

  const adminProductDelete = async (id) => {
      try{
        const response = await apiClient.delete(`/product/${id}`);
        // setAdminProducts(prev => prev.filter(product => product._id !== id));
        // console.log(response);
        // getAdminAllProducts();  //testing

        return alert("Product deleted successfully"); //testing
      }
      catch(err){
        setError('Error deleting product');
      }

  }

  

  // if(loading) return <LoadingComponent />;

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        setLoading,
        // setCategoryFilter,
        setPriceRangeFilter,
        // setSearchFilter,
        // setDiscountFilter,
        // setBrandsFilter,
        // setTagsFilter,
        addComment,
        homeFilterProduct,
        getAdminAllProducts,
        adminProducts,
        adminProductDelete,
        adminProductUpdate,
        setFilter,
        getProductById,
        getHomeProducts
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;

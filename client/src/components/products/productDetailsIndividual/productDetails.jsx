// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { useProducts } from '../../../context/productContext';
// import LoadingComponent from '../../helper/loadingComponent';

// const ProductDetails = () => {
//   const { id } = useParams();
//   const { getProductById } = useProducts();
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchProduct = async () => {
//       setLoading(true);
//       console.log(id)
//       console.log(product)
//       const foundProduct = await getProductById(id);
//       setProduct(foundProduct);
//       console.log(foundProduct)
//       setLoading(false);
//     };

//     fetchProduct();
//   }, [id, getProductById]);

//   if (loading) return <LoadingComponent />;
//   if (!product) return <p className="text-center text-red-500">Product not found</p>;

//   return (
//     <div className="max-w-4xl mx-auto p-5 bg-white shadow-lg rounded-xl">
//       <img src={product.thumbnail} alt={product.title} className="w-full h-96 object-cover rounded-md" />
//       <h1 className="text-3xl font-bold mt-4">{product.title}</h1>
//       <p className="text-gray-600 mt-2">{product.description}</p>

//       <div className="flex items-center gap-2 mt-4">
//         <p className="text-gray-400 line-through text-sm">${product.price}</p>
//         <p className="text-xl font-bold text-green-600">
//           ${((1 - 0.01 * product.discountPercentage) * product.price).toFixed(2)}
//         </p>
//       </div>

//       <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300">
//         Add to Cart
//       </button>
//     </div>
//   );
// };

// export default ProductDetails;





import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import ImageGallery from "./ImageGallery"
import AddToCartButton from "./AddToCartButton"
import ReviewList from "./ReviewList"

import { useProducts } from '../../../context/productContext';

const ProductDetails = () => {
  const [product, setProduct] = useState(null)
  const { id } = useParams()
  const { getProductById, loading } = useProducts()
  const [products, setProducts] = useState(null);

  // useEffect(() => {
  //   // In a real application, you'd fetch the product data from an API
  //   // For this example, we'll use a mock product
  //   const mockProduct = {
  //     id: 78,
  //     title: "Apple MacBook Pro 14 Inch Space Grey",
  //     description:
  //       "The MacBook Pro 14 Inch in Space Grey is a powerful and sleek laptop, featuring Apple's M1 Pro chip for exceptional performance and a stunning Retina display.",
  //     category: "laptops",
  //     price: 1999.99,
  //     discountPercentage: 9.25,
  //     rating: 3.13,
  //     stock: 39,
  //     tags: ["laptops", "apple"],
  //     brand: "Apple",
  //     sku: "QDKO6NRJ",
  //     weight: 4,
  //     dimensions: {
  //       width: 12.38,
  //       height: 21.55,
  //       depth: 27.95,
  //     },
  //     warrantyInformation: "1 month warranty",
  //     shippingInformation: "Ships in 1 week",
  //     availabilityStatus: "In Stock",
  //     reviews: [
  //       {
  //         rating: 5,
  //         comment: "Would buy again!",
  //         date: "2024-05-23T08:56:21.622Z",
  //         reviewerName: "Hunter Gordon",
  //       },
  //       {
  //         rating: 5,
  //         comment: "Would buy again!",
  //         date: "2024-05-23T08:56:21.622Z",
  //         reviewerName: "Emma Wilson",
  //       },
  //       {
  //         rating: 5,
  //         comment: "Very pleased!",
  //         date: "2024-05-23T08:56:21.622Z",
  //         reviewerName: "David Martinez",
  //       },
  //     ],
  //     returnPolicy: "30 days return policy",
  //     minimumOrderQuantity: 1,
  //     images: [
  //       "https://cdn.dummyjson.com/products/images/laptops/Apple%20MacBook%20Pro%2014%20Inch%20Space%20Grey/1.png",
  //       "https://cdn.dummyjson.com/products/images/laptops/Apple%20MacBook%20Pro%2014%20Inch%20Space%20Grey/2.png",
  //       "https://cdn.dummyjson.com/products/images/laptops/Apple%20MacBook%20Pro%2014%20Inch%20Space%20Grey/3.png",
  //     ],
  //     thumbnail:
  //       "https://cdn.dummyjson.com/products/images/laptops/Apple%20MacBook%20Pro%2014%20Inch%20Space%20Grey/thumbnail.png",
  //   }

  //   setProduct(mockProduct)
  // }, [])




  useEffect(() => {
    const fetchProduct = async () => {
      const foundProduct = await getProductById(id);

      setProduct(foundProduct);
      console.log(foundProduct)
    };

    fetchProduct();
  }, [products])


  if (!product) {
    return <div>Loading...</div>
  }

  const discountedPrice = (product.price * (1 - product.discountPercentage / 100)).toFixed(2)

  return (
    <div className=" px-4 ">
      <div className=" px-2 grid grid-cols-1 md:grid-cols-2 shadow-lg border-2 border-slate-200 mb-5 ">
        <div className="flex flex-col items-center justify-center">
          <ImageGallery images={product.images} />
          <div className="w-full flex  justify-center items-center flex-col mb-5">
            <h2 className="text-xl font-semibold mb-3 ">Product Details</h2>
            <ul className="list-disc list-inside text-gray-600">
              <li>Weight: {product.weight} kg</li>
              <li>
                Dimensions: {product.dimensions.width}" x {product.dimensions.height}" x {product.dimensions.depth}"
              </li>
              <li>Warranty: {product.warrantyInformation}</li>
              <li>Return Policy: {product.returnPolicy}</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 min-w-[200px] max-w-[500px] w-full">
          <h1 className="md:text-2xl text-xl font-bold mb-4">{product.title}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <div className="flex items-center gap-2 mb-4">
            <p className="text-gray-400 line-through ">${product.price}</p>
            <p className="font-bold text-green-600">${discountedPrice}</p>
            <span className="bg-green-100 text-green-800  font-semibold px-2.5 py-0.5 rounded">
              {product.discountPercentage}% OFF
            </span>
          </div>
          <p className="text-gray-600 mb-2">Brand: {product.brand}</p>
          <p className="text-gray-600 mb-2">SKU: {product.sku}</p>
          <p className="text-gray-600 mb-2">Availability: {product.availabilityStatus}</p>
          <p className="text-gray-600 mb-4">Ships in: {product.shippingInformation}</p>
          <AddToCartButton productId={product.id} />

        </div>
      </div>


      <div className="mt-12 w-full border-none sm:max-w-[400px] sm:ml-10 border-2 shadow-lg border-slate-200 p-2">
        <div> <h2 className="text-xl font-semibold mb-4">Customer Reviews</h2>
        <ReviewList reviews={product.reviews} /></div>
        <div>
          
        </div>
      </div>
    </div>
  )
}

export default ProductDetails


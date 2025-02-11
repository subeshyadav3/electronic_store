import React, { useState } from "react";
import { useProducts } from "../context/productContext";
import ProductCard from "../components/products/productCard";
import LoadingComponent from "../components/helper/loadingComponent";

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { products ,loading,error,homeFilterProduct} = useProducts();
 

  const sliderImages = [
    "/banner/img3.jpg",
    "/banner/img4.jpg",
    "/banner/img5.webp",
  ];


  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === sliderImages.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? sliderImages.length - 1 : prev - 1));
  };


  return (
    <div className="min-h-screen  flex flex-col overflow-hidden">

      <div className="relative w-full h-96 overflow-hidden">
        {sliderImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
          >
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}

        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 p-2 rounded-full shadow-md hover:bg-opacity-100 transition duration-300"
        >
          &lt;
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 p-2 rounded-full shadow-md hover:bg-opacity-100 transition duration-300"
        >
          &gt;
        </button>
      </div>

      <div className={loading || error?"flex justify-center items-center mt-12":"  grid  grid-cols-1  sm:m-10 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2"}> 
        {error && "Some Error Occured!"}
        {loading? <LoadingComponent />:  products.map((product, index) => {
          if (index <= 3) {
            return <ProductCard key={product._id} products={product} />;
          }
          return null;
        })}
      </div>

    </div>
  );
};

export default Home;
import React, { useState } from "react";

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Dummy data for hero slider
  const sliderImages = [
    "https://via.placeholder.com/1200x400?text=Slide+1",
    "https://via.placeholder.com/1200x400?text=Slide+2",
    "https://via.placeholder.com/1200x400?text=Slide+3",
  ];

  // Dummy data for products
  const products = [
    {
      _id: 1,
      name: "Product 1",
      description: "High-quality product for everyday use.",
      price: 49.99,
      discountedPrice: 39.99,
      image: "https://via.placeholder.com/300x200?text=Product+1",
    },
    {
      _id: 2,
      name: "Product 2",
      description: "Stylish and durable design.",
      price: 79.99,
      discountedPrice: 69.99,
      image: "https://via.placeholder.com/300x200?text=Product+2",
    },
    {
      _id: 3,
      name: "Product 3",
      description: "Innovative features for modern living.",
      price: 99.99,
      discountedPrice: 89.99,
      image: "https://via.placeholder.com/300x200?text=Product+3",
    },
  ];

  // Function to handle slider navigation
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === sliderImages.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? sliderImages.length - 1 : prev - 1));
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Menu */}
      <nav className="bg-white shadow-md p-4 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">MyStore</h1>
          <ul className="flex space-x-6">
            <li>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition duration-300">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition duration-300">
                Shop
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition duration-300">
                About
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition duration-300">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Hero Section with Image Slider */}
      <div className="relative w-full h-96 overflow-hidden">
        {sliderImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}

        {/* Slider Controls */}
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

      {/* Product Showcase Section */}
      <div className="container mx-auto my-12 px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white shadow-lg rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold text-green-600">
                    ${product.discountedPrice}
                  </p>
                  <p className="text-sm text-gray-400 line-through">
                    ${product.price}
                  </p>
                </div>
                <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-auto">
        <div className="container mx-auto text-center">
          <p>&copy; 2023 MyStore. All rights reserved.</p>
          <p className="mt-2">
            Made with ❤️ by{" "}
            <a
              href="https://example.com"
              className="text-blue-400 hover:text-blue-300 transition duration-300"
            >
              Subesh Yadav
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
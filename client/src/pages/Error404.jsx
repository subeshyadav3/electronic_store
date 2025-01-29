const Error404 = () => {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center  p-6">
 
        <div className="bg-white shadow-2xl rounded-2xl p-8 md:p-12 max-w-2xl w-full text-center transform transition-transform duration-300 hover:scale-105">
         
          <div className="mb-6">
            <svg
              className="w-24 h-24 mx-auto text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            404 - Page Not Found
          </h1>
  
          <p className="text-lg text-gray-600 mb-8">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
  

          <a
            href="/"
            className="inline-block bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-300"
          >
            Go Back Home
          </a>
        </div>
      </div>
    );
  };
  
  export default Error404;
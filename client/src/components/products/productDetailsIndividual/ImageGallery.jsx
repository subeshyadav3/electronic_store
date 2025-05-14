import { useEffect, useState } from "react"

const ImageGallery = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(0)
  return (
    <div className="flex  flex-col  md:flex-row  items-center h-auto mt-2">
       <div className="flex gap-2  w-full  justify-center items-center sm:items-start mt-5 md:flex-col">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`flex-shrink-0 ${selectedImage === index ? "ring-2 ring-blue-300 w-fit" : ""}`}
          >
            <img
              src={image || "/placeholder.png"}
              alt={`Product thumbnail ${index + 1}`}
              className=" w-12 h-12  sm:w-12 md:h-15 object-cover rounded-md"
            />
          </button>
        ))}
      </div>
      <div className="">
        <img
          src={images[selectedImage] || "/example.svg"}
          alt="Product"
          className=" min-w-[300px]  max-w-[500px] w-full object-cover rounded-lg"
        /> 
      </div>
     
    </div>
  )
}

export default ImageGallery


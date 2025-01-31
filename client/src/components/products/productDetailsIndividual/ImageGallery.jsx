import { useState } from "react"

const ImageGallery = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(0)

  return (
    <div className="flex justify-center flex-col md:flex-row items-center">
       <div className="flex gap-2 w-[200px]  md:flex-col">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`flex-shrink-0 ${selectedImage === index ? "ring-2 ring-blue-500" : ""}`}
          >
            <img
              src={image || "/placeholder.svg"}
              alt={`Product thumbnail ${index + 1}`}
              className=" w-12 h-12  sm:w-15 md:h-15 object-cover rounded-md"
            />
          </button>
        ))}
      </div>
      <div className="m-4">
        <img
          src={images[selectedImage] || "/placeholder.svg"}
          alt="Product"
          className=" w-fit object-cover rounded-lg"
        /> 
      </div>
     
    </div>
  )
}

export default ImageGallery


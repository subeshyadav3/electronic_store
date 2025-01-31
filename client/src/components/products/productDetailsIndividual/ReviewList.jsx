const StarIcon = ({ filled }) => (
    <svg
      className={`h-5 w-5 flex-shrink-0 ${filled ? "text-yellow-400" : "text-gray-300"}`}
      fill="currentColor"
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  )
  
  const ReviewList = ({ reviews }) => {
    return (
      <div className="space-y-4">
        {reviews.map((review, index) => (
          <div key={index} className="border-b border-gray-200 pb-4">
            <div className="flex items-center mb-2">
              <div className="flex items-center">
                {[0, 1, 2, 3, 4].map((rating) => (
                  <StarIcon key={rating} filled={review.rating > rating} />
                ))}
              </div>
              <p className="ml-2 text-sm text-gray-600">{review.reviewerName}</p>
            </div>
            <p className="text-gray-600">{review.comment}</p>
            <p className="text-sm text-gray-500 mt-1">{new Date(review.date).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    )
  }
  
  export default ReviewList
  
  

import { useMemo } from "react"

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
  const { avgRating, ratingCounts, totalReviews } = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    let sum = 0
    reviews.forEach((review) => {
      sum += review.rating
      counts[review.rating]++   // eg if review 5 then counts[5]++
    })
    return {
      avgRating: sum / reviews.length,
      ratingCounts: counts,
      totalReviews: reviews.length,
    }
  }, [reviews])

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 flex md:flex-row flex-col md:space-x-10">
        <div className="flex items-center mb-4">
          <span className="text-3xl font-bold mr-2">{avgRating.toFixed(1)}</span>
          <div className="flex ">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon key={star} filled={avgRating >= star} />
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-500">{totalReviews} reviews</span>
        </div>
        <div className="space-y-2  md:w-[400px] w-[300px]">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center">
              <span className="w-4 text-sm text-gray-600">{rating}</span>
              <div className="w-full bg-gray-200 rounded-full h-2 ml-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full"
                  style={{ width: `${(ratingCounts[rating] / totalReviews) * 100}%` }}
                ></div>
              </div>
              <span className="ml-2 text-sm text-gray-500">{ratingCounts[rating]}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        {reviews.map((review, index) => (
          <div key={index} className="border-b border-gray-200 pb-4">
            <div className="flex items-center mb-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <StarIcon key={rating} filled={review.rating >= rating} />
                ))}
              </div>
              <p className="ml-2 text-sm text-gray-600">{review.reviewerName}</p>
            </div>
            <p className="text-gray-600">{review.comment}</p>
            <p className="text-sm text-gray-500 mt-1">{new Date(review.date).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ReviewList


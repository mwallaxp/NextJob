import React, { useState } from 'react';
import { Star, ThumbsUp } from 'lucide-react';
import { Card, Badge } from '../../components/DesignSystem';

const ReviewsRatings = ({ userId, userType = 'freelancer' }) => {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      author: 'Sarah Chen',
      company: 'TechStart Inc',
      rating: 5,
      title: 'Excellent work!',
      content: 'Delivered the project ahead of schedule with high-quality code. Very professional and responsive to feedback.',
      verified: true,
      helpful: 12,
      date: 'March 2024',
      project: 'React E-commerce Platform',
    },
    {
      id: 2,
      author: 'Mike Johnson',
      company: 'Design Studio',
      rating: 4,
      title: 'Great communication',
      content: 'Very communicative throughout the project. Minor revisions needed but overall great experience.',
      verified: true,
      helpful: 8,
      date: 'February 2024',
      project: 'UI/UX Redesign',
    },
  ]);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, title: '', content: '' });

  const averageRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);
  const ratingDistribution = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length,
  };

  const handleSubmitReview = () => {
    if (newReview.title && newReview.content) {
      const review = {
        id: reviews.length + 1,
        author: 'You',
        company: 'Your Company',
        rating: newReview.rating,
        title: newReview.title,
        content: newReview.content,
        verified: true,
        helpful: 0,
        date: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
        project: 'Recent Project',
      };
      setReviews([review, ...reviews]);
      setNewReview({ rating: 5, title: '', content: '' });
      setShowReviewForm(false);
    }
  };

  return (
    <div className="min-h-screen bg-black-50 py-8 px-4">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-black-900 mb-2">Ratings & Reviews</h1>
        <p className="text-black-600 mb-8">See what clients say about working with {userType === 'freelancer' ? 'this freelancer' : 'this company'}</p>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Rating Summary */}
          <Card className="md:col-span-1 bg-gradient-to-br from-orange-50 to-white">
            <div className="text-center mb-6">
              <div className="text-5xl font-bold text-orange-600 mb-2">{averageRating}</div>
              <div className="flex justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={i < Math.round(averageRating) ? 'fill-orange-500 text-orange-500' : 'text-black-300'}
                  />
                ))}
              </div>
              <p className="text-sm text-black-600">Based on {reviews.length} reviews</p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="flex items-center gap-3">
                  <span className="text-sm font-semibold w-12 text-right">{stars}★</span>
                  <div className="flex-1 h-2 bg-black-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-500 rounded-full"
                      style={{
                        width: `${(ratingDistribution[stars] / reviews.length) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm text-black-600 w-8">{ratingDistribution[stars]}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Write Review */}
          <div className="md:col-span-2 space-y-6">
            {showReviewForm ? (
              <Card className="bg-white">
                <h3 className="text-xl font-bold text-black-900 mb-4">Write a Review</h3>

                {/* Rating Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-black-900 mb-2">Your Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        className="p-1"
                      >
                        <Star
                          size={24}
                          className={star <= newReview.rating ? 'fill-orange-500 text-orange-500' : 'text-black-300'}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-black-900 mb-2">Review Title</label>
                  <input
                    type="text"
                    placeholder="e.g., Great work and communication"
                    value={newReview.title}
                    onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-black-100 focus:outline-none focus:border-orange-500"
                  />
                </div>

                {/* Content */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-black-900 mb-2">Your Review</label>
                  <textarea
                    placeholder="Share your experience working on this project..."
                    value={newReview.content}
                    onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border border-black-100 focus:outline-none focus:border-orange-500 resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleSubmitReview}
                    className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition"
                  >
                    Submit Review
                  </button>
                  <button
                    onClick={() => setShowReviewForm(false)}
                    className="flex-1 py-3 border-2 border-black-100 text-black-900 font-semibold rounded-lg hover:bg-black-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </Card>
            ) : (
              <Card>
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition"
                >
                  Write a Review
                </button>
              </Card>
            )}
          </div>
        </div>

        {/* Reviews List */}
        <div>
          <h2 className="text-2xl font-bold text-black-900 mb-6">All Reviews</h2>
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id} className="hover:shadow-medium transition">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div>
                        <p className="font-semibold text-black-900">{review.author}</p>
                        <p className="text-sm text-black-600">{review.company}</p>
                      </div>
                      {review.verified && (
                        <Badge variant="success" className="ml-auto">Verified</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={i < review.rating ? 'fill-orange-500 text-orange-500' : 'text-black-300'}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-black-900">{review.title}</span>
                    </div>
                  </div>
                  <p className="text-sm text-black-600">{review.date}</p>
                </div>

                <p className="text-black-700 mb-3">{review.content}</p>
                <p className="text-sm text-black-600 mb-4">Project: <span className="font-semibold">{review.project}</span></p>

                <div className="flex items-center pt-3 border-t border-black-100">
                  <button className="flex items-center gap-2 text-black-600 hover:text-orange-600 transition">
                    <ThumbsUp size={16} />
                    <span className="text-sm">Helpful ({review.helpful})</span>
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsRatings;

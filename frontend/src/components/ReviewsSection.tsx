import { useState } from 'react';
import { Star } from 'lucide-react';
import { useReviewsByProduct, useAddReview } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ReviewsSectionProps {
  productId: bigint;
  theme?: 'default' | 'female';
}

function StarRating({ rating, max = 5, interactive = false, onRate }: {
  rating: number;
  max?: number;
  interactive?: boolean;
  onRate?: (r: number) => void;
}) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onRate?.(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          className={`transition-colors ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
          style={{ minHeight: 'unset', minWidth: 'unset' }}
          aria-label={interactive ? `Rate ${star} star${star > 1 ? 's' : ''}` : undefined}
        >
          <Star
            className={`h-5 w-5 transition-colors ${
              star <= (hovered || rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-transparent text-muted-foreground/40'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function ReviewsSection({ productId, theme = 'default' }: ReviewsSectionProps) {
  const { data: reviews = [], isLoading } = useReviewsByProduct(productId);
  const addReviewMutation = useAddReview();

  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length
    : 0;

  const isFemale = theme === 'female';

  const accentClass = isFemale
    ? 'text-pink-400'
    : 'text-neon-blue';

  const borderClass = isFemale
    ? 'border-pink-400/30'
    : 'border-neon-blue/20';

  const bgClass = isFemale
    ? 'bg-pink-500/10'
    : 'bg-neon-blue/5';

  const btnClass = isFemale
    ? 'bg-pink-500 hover:bg-pink-400 text-white shadow-[0_0_12px_rgba(236,72,153,0.4)]'
    : 'bg-neon-blue text-background hover:bg-neon-blue-bright hover:shadow-neon';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    if (!comment.trim()) {
      toast.error('Please write a comment');
      return;
    }

    try {
      await addReviewMutation.mutateAsync({
        productId,
        reviewerName: name.trim(),
        rating: BigInt(rating),
        comment: comment.trim(),
      });
      toast.success('Review submitted! Thank you ✨');
      setName('');
      setRating(0);
      setComment('');
    } catch {
      toast.error('Failed to submit review. Please try again.');
    }
  };

  const formatDate = (timestamp: bigint) => {
    const ms = Number(timestamp) / 1_000_000;
    return new Intl.DateTimeFormat('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(ms));
  };

  return (
    <div className="mt-6 space-y-6">
      {/* Header */}
      <div className={`flex items-center gap-3 pb-3 border-b ${borderClass}`}>
        <h3 className={`text-lg font-bold ${accentClass}`}>
          {isFemale ? '💕 Reviews' : '⭐ Reviews'}
        </h3>
        {reviews.length > 0 && (
          <div className="flex items-center gap-2">
            <StarRating rating={Math.round(avgRating)} />
            <span className="text-sm text-muted-foreground">
              {avgRating.toFixed(1)} ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
            </span>
          </div>
        )}
      </div>

      {/* Reviews list */}
      {isLoading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-center text-muted-foreground text-sm py-4">
          No reviews yet. Be the first to review!
        </p>
      ) : (
        <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
          {[...reviews].reverse().map((review) => (
            <div
              key={review.id.toString()}
              className={`rounded-xl border ${borderClass} ${bgClass} p-4 space-y-2`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-foreground text-sm">{review.reviewerName}</p>
                  <StarRating rating={Number(review.rating)} />
                </div>
                <span className="text-xs text-muted-foreground shrink-0">
                  {formatDate(review.createdAt)}
                </span>
              </div>
              {review.comment && (
                <p className="text-sm text-foreground/80 leading-relaxed">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Write a review form */}
      <div className={`rounded-xl border ${borderClass} ${bgClass} p-4`}>
        <h4 className={`font-bold mb-4 ${accentClass}`}>
          {isFemale ? '✨ Write a Review' : '📝 Write a Review'}
        </h4>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-foreground text-sm">Your Name</Label>
            <Input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={addReviewMutation.isPending}
              className="bg-background border-border/40 text-foreground h-9 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-foreground text-sm">Rating</Label>
            <StarRating
              rating={rating}
              interactive
              onRate={setRating}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-foreground text-sm">Comment</Label>
            <Textarea
              placeholder="Share your experience with this product..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={addReviewMutation.isPending}
              className="bg-background border-border/40 text-foreground text-sm min-h-[80px] resize-none"
              rows={3}
            />
          </div>

          <Button
            type="submit"
            disabled={addReviewMutation.isPending}
            className={`w-full font-bold ${btnClass}`}
          >
            {addReviewMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Review'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

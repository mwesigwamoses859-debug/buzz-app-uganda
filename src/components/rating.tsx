import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingProps {
  rating: number;
  totalStars?: number;
  size?: number;
  className?: string;
  iconClassName?: string;
}

export function Rating({
  rating,
  totalStars = 5,
  size = 16,
  className,
  iconClassName
}: RatingProps) {
  const fullStars = Math.floor(rating);
  const partialStar = rating % 1;
  const emptyStars = totalStars - Math.ceil(rating);

  return (
    <div className={cn("flex items-center", className)}>
      {[...Array(fullStars)].map((_, i) => (
        <Star
          key={`full-${i}`}
          size={size}
          className={cn("text-accent fill-accent", iconClassName)}
        />
      ))}
      {partialStar > 0 && (
        <div className="relative">
          <Star
            key="partial"
            size={size}
            className={cn("text-accent", iconClassName)}
          />
          <div
            className="absolute top-0 left-0 h-full overflow-hidden"
            style={{ width: `${partialStar * 100}%` }}
          >
            <Star
              size={size}
              className={cn("text-accent fill-accent", iconClassName)}
            />
          </div>
        </div>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star
          key={`empty-${i}`}
          size={size}
          className={cn("text-muted-foreground/30", iconClassName)}
        />
      ))}
    </div>
  );
}

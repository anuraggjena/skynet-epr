import { Star } from "lucide-react"

type Props = {
  value: number
  max?: number
  size?: number
  className?: string
}

export default function RatingStars({ 
  value, 
  max = 5, 
  size = 16,
  className = "" 
}: Props) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[...Array(max)].map((_, i) => {
        const fillPercentage = Math.max(0, Math.min(100, (value - i) * 100))
        
        return (
          <div key={i} className="relative" style={{ width: size, height: size }}>
            
            <Star 
              size={size} 
              className="absolute top-0 left-0 text-muted/30 dark:text-muted/20" 
              strokeWidth={2.5}
            />
            
            <div 
              className="absolute top-0 left-0 overflow-hidden" 
              style={{ width: `${fillPercentage}%` }}
            >
              <Star 
                size={size} 
                className="fill-amber-400 text-amber-400 drop-shadow-sm" 
                strokeWidth={2.5}
              />
            </div>

          </div>
        )
      })}
    </div>
  )
}
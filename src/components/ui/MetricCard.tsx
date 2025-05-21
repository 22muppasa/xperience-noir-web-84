
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: number;
  suffix?: string;
  prefix?: string;
  description: string;
  duration?: number;
  className?: string;
}

const MetricCard = ({
  title,
  value,
  suffix = '',
  prefix = '',
  description,
  duration = 2000,
  className
}: MetricCardProps) => {
  const [count, setCount] = useState(0);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = document.querySelector(`#metric-${title.replace(/\s+/g, '-').toLowerCase()}`);
    
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [title]);

  useEffect(() => {
    let animationFrame: number;
    let startTime: number;
    
    if (isInView) {
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;
        const percentage = Math.min(progress / duration, 1);
        const currentCount = Math.floor(percentage * value);
        
        setCount(currentCount);

        if (percentage < 1) {
          animationFrame = requestAnimationFrame(animate);
        }
      };

      animationFrame = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isInView, value, duration]);

  return (
    <div 
      id={`metric-${title.replace(/\s+/g, '-').toLowerCase()}`}
      className={cn(
        "bg-white border border-border p-6 rounded-lg transition-all hover-scale",
        className
      )}
    >
      <h3 className="text-lg font-medium text-gray-600 mb-1">{title}</h3>
      <div className="flex items-baseline">
        {prefix && <span className="text-xl mr-1">{prefix}</span>}
        <span className="text-4xl font-bold">{count}</span>
        {suffix && <span className="text-xl ml-1">{suffix}</span>}
      </div>
      <p className="mt-2 text-gray-500">{description}</p>
    </div>
  );
};

export default MetricCard;

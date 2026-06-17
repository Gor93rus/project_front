import React, { useState, useEffect, useRef, type HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

// Define the type for a single gallery item
export interface GalleryItem {
  id: string;
  name: string;
  subtitle: string;
  image: {
    url: string;
    text: string;
    pos?: string;
  };
  badge?: string;
  price?: string;
  jackpot?: string;
  gradient?: [string, string];
}

// Define the props for the CircularGallery component
interface CircularGalleryProps extends HTMLAttributes<HTMLDivElement> {
  items: GalleryItem[];
  /** Controls how far the items are from the center. */
  radius?: number;
  /** Controls the speed of auto-rotation when not scrolling. */
  autoRotateSpeed?: number;
  /** Card width in pixels */
  cardWidth?: number;
  /** Card height in pixels */
  cardHeight?: number;
}

const CircularGallery = React.forwardRef<HTMLDivElement, CircularGalleryProps>(
  ({ items, className, radius = 600, autoRotateSpeed = 0.02, cardWidth = 280, cardHeight = 380, ...props }, ref) => {
    const [rotation, setRotation] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);
    const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    // Effect to handle scroll-based rotation
    useEffect(() => {
      const handleScroll = () => {
        setIsScrolling(true);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }

        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
        const scrollRotation = scrollProgress * 360;
        setRotation(scrollRotation);

        scrollTimeoutRef.current = setTimeout(() => {
          setIsScrolling(false);
        }, 150);
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        window.removeEventListener('scroll', handleScroll);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
      };
    }, []);

    // Effect for auto-rotation when not scrolling
    useEffect(() => {
      const autoRotate = () => {
        if (!isScrolling) {
          setRotation(prev => prev + autoRotateSpeed);
        }
        animationFrameRef.current = requestAnimationFrame(autoRotate);
      };

      animationFrameRef.current = requestAnimationFrame(autoRotate);

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }, [isScrolling, autoRotateSpeed]);

    const anglePerItem = 360 / items.length;
    
    return (
      <div
        ref={ref}
        role="region"
        aria-label="Circular 3D Gallery"
        className={cn("relative w-full h-full flex items-center justify-center", className)}
        style={{ perspective: '2000px' }}
        {...props}
      >
        <div
          className="relative w-full h-full"
          style={{
            transform: `rotateY(${rotation}deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          {items.map((item, i) => {
            const itemAngle = i * anglePerItem;
            const totalRotation = rotation % 360;
            const relativeAngle = (itemAngle + totalRotation + 360) % 360;
            const normalizedAngle = Math.abs(relativeAngle > 180 ? 360 - relativeAngle : relativeAngle);
            const opacity = Math.max(0.25, 1 - (normalizedAngle / 180));

            return (
              <div
                key={item.id}
                role="group"
                aria-label={item.name}
                className="absolute rounded-xl overflow-hidden shadow-2xl group cursor-pointer"
                style={{
                  width: cardWidth,
                  height: cardHeight,
                  transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                  left: '50%',
                  top: '50%',
                  marginLeft: -(cardWidth / 2),
                  marginTop: -(cardHeight / 2),
                  opacity: opacity,
                  transition: 'opacity 0.3s linear, transform 0.2s ease',
                }}
              >
                {/* Card background with gradient */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: item.gradient
                      ? `linear-gradient(145deg, ${item.gradient[0]}, ${item.gradient[1]})`
                      : 'linear-gradient(145deg, #667EEA, #764BA2)',
                  }}
                />

                {/* Glass overlay */}
                <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />

                {/* Image */}
                {item.image.url && (
                  <img
                    src={item.image.url}
                    alt={item.image.text}
                    className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60 group-hover:opacity-80 transition-opacity duration-500"
                    style={{ objectPosition: item.image.pos || 'center' }}
                  />
                )}

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-5 z-10">
                  {/* Badge */}
                  {item.badge && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-white/20 backdrop-blur-md text-white border border-white/20">
                      {item.badge}
                    </div>
                  )}

                  {/* Jackpot */}
                  {item.jackpot && (
                    <div className="mb-2">
                      <p className="text-[9px] font-semibold text-white/70 uppercase tracking-wider">Джекпот</p>
                      <p className="text-2xl font-black text-white leading-none drop-shadow-lg">
                        {item.jackpot}
                      </p>
                    </div>
                  )}

                  {/* Name */}
                  <h3 className="text-lg font-extrabold text-white drop-shadow-lg leading-tight">
                    {item.name}
                  </h3>
                  
                  {/* Subtitle */}
                  {item.subtitle && (
                    <p className="text-xs text-white/80 mt-0.5 drop-shadow-md">
                      {item.subtitle}
                    </p>
                  )}

                  {/* Price */}
                  {item.price && (
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-white/90 bg-white/15 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                        {item.price}
                      </span>
                    </div>
                  )}
                </div>

                {/* Edge highlight */}
                <div className="absolute inset-0 rounded-xl pointer-events-none border border-white/20" />
                <div className="absolute inset-0 rounded-xl pointer-events-none bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

CircularGallery.displayName = 'CircularGallery';

export { CircularGallery };

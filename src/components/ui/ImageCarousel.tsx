import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageCarouselProps {
  images: string[];
  alt?: string;
  className?: string;
  aspectRatio?: 'video' | 'square' | 'wide';
  showDots?: boolean;
  showArrows?: boolean;
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  alt = '',
  className = '',
  aspectRatio = 'video',
  showDots = true,
  showArrows = true
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  if (!images || images.length === 0) {
    return (
      <div className={`bg-gray-200 rounded-lg flex items-center justify-center ${className}`}>
        <span className="text-gray-500">Aucune image</span>
      </div>
    );
  }

  const aspectClasses = {
    video: 'aspect-video',
    square: 'aspect-square',
    wide: 'aspect-[21/9]'
  };

  return (
    <div className={`relative overflow-hidden rounded-lg group ${className}`}>
      {/* Main image container */}
      <div className={`${aspectClasses[aspectRatio]} w-full`}>
        <img
          src={images[currentIndex]}
          alt={alt}
          className="w-full h-full object-cover transition-opacity duration-300"
        />
      </div>

      {/* Navigation arrows */}
      {showArrows && images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}

      {/* Dots indicator */}
      {showDots && images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-white scale-110'
                  : 'bg-white/60 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      )}

      {/* Image counter */}
      {images.length > 1 && (
        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
};
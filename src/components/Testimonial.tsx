
import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

interface Testimonial {
  quote: string;
  author: string;
  position?: string;
  company?: string;
  rating?: number;
  logoSrc?: string;
}

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
}

const TestimonialsCarousel: React.FC<TestimonialsCarouselProps> = ({ testimonials }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (!testimonials.length) {
    return null;
  }

  const testimonial = testimonials[currentIndex];

  return (
    <div className="relative bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-2xl">
      {/* Rating Stars */}
      {testimonial.rating && (
        <div className="flex mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={16}
              className={`${
                i < testimonial.rating! ? "fill-amber-400 text-amber-400" : "text-gray-300"
              } mr-1`}
            />
          ))}
        </div>
      )}

      {/* Quote */}
      <p className="text-lg text-white mb-6 italic">
        "{testimonial.quote}"
      </p>

      {/* Author Information */}
      <div className="flex items-center mt-4">
        {testimonial.logoSrc ? (
          <div className="h-10 w-10 mr-4 bg-white rounded-md flex items-center justify-center">
            <img 
              src={testimonial.logoSrc} 
              alt={testimonial.company} 
              className="h-6 object-contain"
            />
          </div>
        ) : (
          <div className="h-10 w-10 mr-4 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-white font-medium">
              {testimonial.author.charAt(0)}
            </span>
          </div>
        )}
        
        <div>
          <p className="font-medium text-white">{testimonial.author}</p>
          {(testimonial.position || testimonial.company) && (
            <p className="text-sm text-white/80">
              {testimonial.position}
              {testimonial.position && testimonial.company && ", "}
              {testimonial.company}
            </p>
          )}
        </div>
      </div>

      {/* Navigation Controls */}
      {testimonials.length > 1 && (
        <div className="flex mt-6 justify-between">
          <button
            onClick={goToPrevious}
            className="flex items-center justify-center h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={18} className="text-white" />
          </button>
          
          <div className="flex gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 w-2 rounded-full ${
                  index === currentIndex ? "bg-white" : "bg-white/30"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
          
          <button
            onClick={goToNext}
            className="flex items-center justify-center h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight size={18} className="text-white" />
          </button>
        </div>
      )}
    </div>
  );
};

export default TestimonialsCarousel;

import { useState, useEffect } from 'react';

// Import all Chef's Table photos in order
import ct1 from '@/assets/chefs-table/ct-1.jpg';
import ct2 from '@/assets/chefs-table/ct-2.jpg';
import ct3 from '@/assets/chefs-table/ct-3.jpg';
import ct4 from '@/assets/chefs-table/ct-4.jpg';

const photos = [
  { src: ct1, alt: "Chef preparando plato" },
  { src: ct2, alt: "Mesa del restaurante" },
  { src: ct3, alt: "Cocina abierta" },
  { src: ct4, alt: "Cerámica artesanal" },
];

const ChefsTablePhotoCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full aspect-[5/4] overflow-hidden rounded-lg">
      {photos.map((photo, index) => (
        <img
          key={index}
          src={photo.src}
          alt={photo.alt}
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
      {/* Dot indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {photos.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-white' : 'bg-white/40'
            }`}
            aria-label={`Ver imagen ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ChefsTablePhotoCarousel;

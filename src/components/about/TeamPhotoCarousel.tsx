import { useState, useEffect } from 'react';
import teamPhoto1 from '@/assets/team-photo-1.jpg';
import teamPhoto2 from '@/assets/team-photo-2.jpg';

const teamPhotos = [
  { src: teamPhoto1, alt: 'Equipo Amana 1' },
  { src: teamPhoto2, alt: 'Equipo Amana 2' },
];

const TeamPhotoCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % teamPhotos.length);
        setIsTransitioning(false);
      }, 400);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="aspect-[3/2] rounded-lg overflow-hidden max-w-xl mx-auto relative">
      {teamPhotos.map((photo, index) => (
        <img
          key={index}
          src={photo.src}
          alt={photo.alt}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            index === currentIndex && !isTransitioning ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
    </div>
  );
};

export default TeamPhotoCarousel;

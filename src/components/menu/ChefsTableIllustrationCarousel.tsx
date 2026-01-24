import { useState, useEffect } from 'react';

// Import all illustration images
import camaronImg from '@/assets/illustrations/camaron.jpg';
import cerdoImg from '@/assets/illustrations/cerdo.jpg';
import gallinaImg from '@/assets/illustrations/gallina.jpg';
import maizImg from '@/assets/illustrations/maiz.jpg';
import papayaImg from '@/assets/illustrations/papaya.jpg';
import pejibayesImg from '@/assets/illustrations/pejibayes.jpg';
import pez1Img from '@/assets/illustrations/pez1.jpg';
import pez2Img from '@/assets/illustrations/pez2.jpg';
import pinaImg from '@/assets/illustrations/pina.jpg';
import vacaImg from '@/assets/illustrations/vaca.jpg';

const illustrations = [
  { src: camaronImg, alt: 'Camarón' },
  { src: cerdoImg, alt: 'Cerdo' },
  { src: gallinaImg, alt: 'Gallina' },
  { src: maizImg, alt: 'Maíz' },
  { src: papayaImg, alt: 'Papaya' },
  { src: pejibayesImg, alt: 'Pejibayes' },
  { src: pez1Img, alt: 'Pez' },
  { src: pez2Img, alt: 'Pez' },
  { src: pinaImg, alt: 'Piña' },
  { src: vacaImg, alt: 'Vaca' },
];

// Shuffle array using Fisher-Yates algorithm (once on mount)
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const ChefsTableIllustrationCarousel = () => {
  const [shuffledImages] = useState(() => shuffleArray(illustrations));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % shuffledImages.length);
        setIsTransitioning(false);
      }, 500); // Half of transition duration
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [shuffledImages.length]);

  return (
    <div className="relative w-48 sm:w-60 md:w-72 h-48 sm:h-60 md:h-72">
      {shuffledImages.map((img, index) => (
        <img
          key={img.alt + index}
          src={img.src}
          alt={img.alt}
          className={`absolute inset-0 w-full h-full object-contain drop-shadow-2xl transition-opacity duration-1000 ${
            index === currentIndex && !isTransitioning
              ? 'opacity-100'
              : 'opacity-0'
          }`}
        />
      ))}
    </div>
  );
};

export default ChefsTableIllustrationCarousel;

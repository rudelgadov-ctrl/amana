import { useState, useEffect, useRef } from 'react';

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
import platanoImg from '@/assets/illustrations/platano.jpg';
import quesoBagacesImg from '@/assets/illustrations/queso-bagaces.jpg';
import repolloImg from '@/assets/illustrations/repollo.jpg';

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
  { src: platanoImg, alt: 'Plátano' },
  { src: quesoBagacesImg, alt: 'Queso Bagaces' },
  { src: repolloImg, alt: 'Repollo' },
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
  const [offset, setOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Get 4 visible images based on current offset
  const visibleImages = [0, 1, 2, 3].map(
    (i) => shuffledImages[(offset + i) % shuffledImages.length]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset((prev) => (prev + 1) % shuffledImages.length);
    }, 5000); // Rotate every 5 seconds

    return () => clearInterval(interval);
  }, [shuffledImages.length]);

  return (
    <div className="w-full overflow-hidden" ref={containerRef}>
      <div className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        {visibleImages.map((img, index) => (
          <div 
            key={`${offset}-${index}`}
            className="aspect-square rounded-sm bg-[#dad8c8] overflow-hidden animate-fade-in"
          >
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-contain p-2 sm:p-3"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChefsTableIllustrationCarousel;

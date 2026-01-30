import { useState } from "react";
import teamPhoto1 from "@/assets/team-photo-1.jpg";
import teamPhoto2 from "@/assets/team-photo-2.jpg";

const teamPhotos = [
  // Ajusta estos valores para alinear mejor el punto focal (rostros/personas)
  { src: teamPhoto1, alt: "Equipo Amana 1", focalY: 23 },
  { src: teamPhoto2, alt: "Equipo Amana 2", focalY: 54 },
] as const;

const TeamPhotoCarousel = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="aspect-[3/2] rounded-lg overflow-hidden max-w-xl mx-auto relative cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {teamPhotos.map((photo, index) => (
        <img
          key={index}
          src={photo.src}
          alt={photo.alt}
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500 ${
            (index === 0 && !isHovered) || (index === 1 && isHovered) ? "opacity-100" : "opacity-0"
          }`}
          style={{ objectPosition: `50% ${photo.focalY}%` }}
        />
      ))}
    </div>
  );
};

export default TeamPhotoCarousel;

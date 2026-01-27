const ChefsTablePhotoCarousel = () => {
  return (
    <div className="relative w-full aspect-[3/4] overflow-hidden rounded-lg">
      <video
        src="/videos/chefs-table.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );
};

export default ChefsTablePhotoCarousel;

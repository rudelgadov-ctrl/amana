const ChefsTablePhotoCarousel = () => {
  return (
    <div className="relative w-full flex justify-center overflow-hidden rounded-lg">
      <video
        src="/videos/chefs-table.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="max-w-full h-auto object-contain"
      />
    </div>
  );
};

export default ChefsTablePhotoCarousel;

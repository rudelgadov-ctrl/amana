const ChefsTablePhotoCarousel = () => {
  return (
    <div className="relative w-full md:w-auto flex justify-center overflow-hidden rounded-lg">
      <video
        src="/videos/chefs-table.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="w-full md:w-auto md:h-[450px] lg:h-[500px] object-contain"
      />
    </div>
  );
};

export default ChefsTablePhotoCarousel;

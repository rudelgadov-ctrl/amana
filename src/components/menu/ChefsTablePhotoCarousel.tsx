const ChefsTablePhotoCarousel = () => {
  return (
    <div className="relative w-full md:w-auto flex justify-center overflow-hidden rounded-lg">
      <video
        src="/videos/chefs-table-new.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="w-full md:w-auto md:h-[550px] lg:h-[650px] object-contain"
      />
    </div>
  );
};

export default ChefsTablePhotoCarousel;

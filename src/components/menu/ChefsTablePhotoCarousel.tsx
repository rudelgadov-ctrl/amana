const ChefsTablePhotoCarousel = () => {
  return (
    <div className="relative w-full md:w-auto flex justify-center overflow-hidden rounded-lg">
      <video
        src="/videos/chefs-table-v2.mp4"
        className="w-full md:w-auto md:h-[450px] lg:h-[500px] object-contain"
        autoPlay
        loop
        muted
        playsInline
      />
    </div>
  );
};
export default ChefsTablePhotoCarousel;
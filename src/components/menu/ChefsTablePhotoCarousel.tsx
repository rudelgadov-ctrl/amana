const ChefsTablePhotoCarousel = () => {
  return (
    <div className="relative inline-flex rounded-lg overflow-hidden shadow-lg">
      <video
        src="/videos/chefs-table-v2.mp4"
        className="h-auto w-full md:max-h-[450px] lg:max-h-[500px]"
        autoPlay
        loop
        muted
        playsInline
      />
    </div>
  );
};
export default ChefsTablePhotoCarousel;
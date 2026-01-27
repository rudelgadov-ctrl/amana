const ChefsTablePhotoCarousel = () => {
  return (
    <div className="relative w-full overflow-hidden rounded-lg">
      <video
        src="/videos/chefs-table.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-auto"
      />
    </div>
  );
};

export default ChefsTablePhotoCarousel;

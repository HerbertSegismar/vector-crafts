
const RedVelvet = () => {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <video
        src="strawberry3.mp4"
        autoPlay
        muted // Important for autoplay in most browsers
        loop
        playsInline // Important for iOS
        className="w-full h-full object-cover"
      ></video>
    </div>
  );
}

export default RedVelvet
import { useState } from "react";

const RedVelvet = () => {
  const bgs = [
    "strawberry1.mp4",
    "strawberry2.mp4",
    "strawberry3.mp4",
    "chocolate1.mp4",
    "chocolate2.mp4",
    "ant1.mp4",
    "ant2.mp4",
  ];

  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleChangeBackground = () => {
    if (isAnimating) return; // Prevent multiple clicks during animation

    setIsAnimating(true);

    // Button click animation
    setTimeout(() => {
      setIndex((prevIndex) => (prevIndex + 1) % bgs.length);
      setIsAnimating(false);
    }, 300); // Match this duration with the CSS animation
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <video
        key={bgs[index]}
        src={bgs[index]}
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover"
      ></video>
      <div className="absolute bottom-10 w-full flex items-center justify-center">
        <button
          className={`
            px-8 py-4 bg-red-300/20 text-white rounded-xl 
            text-lg shadow-lg font-thin
            transform transition-all duration-300
            hover:bg-red-300/30 hover:scale-105 hover:shadow-xl
            active:scale-95 active:bg-red-500
            focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50
            ${isAnimating ? "animate-spring" : ""}
          `}
          onClick={handleChangeBackground}
          disabled={isAnimating}
        >
          <span className="flex items-center justify-center">
            <svg
              className={`w-5 h-5 mr-2 transition-transform duration-300 ${
                isAnimating ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Change Background
          </span>
        </button>
      </div>
    </div>
  );
};

export default RedVelvet;

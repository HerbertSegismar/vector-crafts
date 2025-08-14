import Heart from "./Heart.tsx";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { motion } from "motion/react";

function Home() {
  gsap.registerPlugin(useGSAP);
  const container = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.from("#heart", {
      x: 100,
      rotation: 360,
      duration: 3,
      ease: "power1.in",
      yoyo: true,
      repeat: 2,
    });
    tl.to("#heart", {
      y: 100,
      rotation: 180,
      duration: 3,
      ease: "power1.out",
      yoyo: true,
      repeat: -1,
    });
  }, [container]);

  return (
    <div className="flex flex-col items-center justify-center h-screen z-50">
      <motion.h1
        animate={{
          scale: [1, 1.5, 1.5, 1, 1],
          rotate: [0, 0, 270, 270, 0],
          transition: {
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          },
        }}
        className="text-3xl font-bold text-blue-500"
      >
        Hello from Tailwind
      </motion.h1>
      <div id="heart">
        <Heart />
      </div>
      <div
        className=" flex items-center justify-center text-sm md:text-lg text-slate-300 drop-shadow-xl text-center bg-purple-900/40 w-96 h-24 rounded-2xl"
        style={{ marginTop: "100px" }}
      >
        <p className="mx-4">
          The text animation uses "motion" library formerly framer-motion, while
          the heart animation uses GSAP.
        </p>
      </div>
    </div>
  );
}

export default Home;

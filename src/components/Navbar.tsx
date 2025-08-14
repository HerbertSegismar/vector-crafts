import NavbarData from "./NavbarData";
import { motion } from "motion/react";
import { NavLink } from "react-router-dom";

const navbar = () => {
  return (
    <motion.nav
      whileInView={{ y: [-100, 0] }}
      transition={{duration: 1, ease: "easeOut"}}
      className="sticky top-0 navLG scale-150 font-semibold bg-gradient-to-r from-white/0 to-black/40 flex items-center justify-around text-xl text-slate-300 gap-8 z-10"
    >
      <div className="size-10">
        <NavLink to="/">
          <motion.div
            animate={{
              scale: [0.4, 0.3, 0.4],
              transition: { duration: 2, repeat: Infinity },
            }}
            className="logo -ml-4 absolute top-0"
          />
        </NavLink>
      </div>
      <div className="flex gap-8">
        {NavbarData.map((link) => (
          <NavLink
            className={({ isActive }: { isActive: boolean }) =>
              `transition-all duration-200 pb-8 font-normal ${
                isActive
                  ? "text-amber-400 text-xl"
                  : "hover:scale-105 text-slate-100"
              }`
            }
            key={link.id}
            to={link.url}
          >
            {link.text}
          </NavLink>
        ))}
      </div>
    </motion.nav>
  );
};

export default navbar;

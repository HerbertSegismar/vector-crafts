import NavbarSM from "./components/NavbarSM";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import type { ReactNode } from "react";
import BackgroundGradientAnimation from "./components/ui/background-gradient-animation";

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <BackgroundGradientAnimation>
          <div className="md:hidden flex items-center justify-center">
            <NavbarSM />
          </div>
          <div className="hidden md:flex items-center justify-center">
            <Navbar />
          </div>
        <main className="relative z-1 -mt-12">{children}</main>
        <footer>
          <Footer />
        </footer>
      </BackgroundGradientAnimation>
    </div>
  );
}

export default Layout;

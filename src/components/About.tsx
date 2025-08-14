import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const About = () => {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Hero section animation
      gsap.from(".hero-title", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      gsap.from(".hero-subtitle", {
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: "power2.out",
      });

      // Floating vector elements
      gsap.to(".vector-float-1", {
        y: 20,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".vector-float-2", {
        y: -15,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.5,
      });

      // Section animations with ScrollTrigger
      const sections = gsap.utils.toArray<HTMLElement>(".about-section");
      sections.forEach((section, i) => {
        gsap.from(section, {
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none none",
          },
          y: 50,
          opacity: 0,
          duration: 0.8,
          delay: i * 0.1,
          ease: "back.out(1)",
        });
      });

      // Stats counter animation
      gsap.from(".stat-number", {
        scrollTrigger: {
          trigger: ".stats-section",
          start: "top 80%",
          once: true,
        },
        innerText: 0,
        duration: 2,
        ease: "power1.out",
        snap: { innerText: 1 },
        stagger: 0.2,
      });
    },
    { scope: container }
  );

  return (
    <div ref={container}>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Floating vector elements */}
        <div className="absolute top-20 left-10 w-24 h-24 vector-float-1">
          <svg viewBox="0 0 100 100" className="text-purple-200">
            <path d="M50 0 L100 50 L50 100 L0 50 Z" fill="currentColor" />
          </svg>
        </div>
        <div className="absolute bottom-10 right-20 w-32 h-32 vector-float-2">
          <svg viewBox="0 0 100 100" className="text-blue-200">
            <circle cx="50" cy="50" r="45" fill="currentColor" />
          </svg>
        </div>

        <div className="container mx-auto px-6 text-center">
          <h1 className="hero-title text-amber-100 text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Crafting Perfect Vectors
          </h1>
          <p className="hero-subtitle text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            We transform ideas into scalable, beautiful vector graphics for
            designers and developers worldwide.
          </p>
        </div>
      </section>

      {/* About Content */}
      <div className="container mx-auto px-6 py-16">
        <section className="about-section mb-20">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <p className="text-lg text-gray-300 mb-4">
                Founded in 2020, VectorCraft began as a small team of vector art
                enthusiasts. We noticed a gap in the market for high-quality,
                customizable vector assets that don't sacrifice quality for
                scalability.
              </p>
              <p className="text-lg text-gray-300">
                Today, we serve thousands of creative professionals with our
                unique vector generation tools and extensive library of premium
                assets.
              </p>
            </div>
            <div className="md:w-1/2">
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-8 h-64 flex items-center justify-center">
                <svg viewBox="0 0 200 100" className="w-full h-48">
                  <path
                    d="M20,50 Q50,10 80,50 T140,50"
                    stroke="#6C5CE7"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    d="M20,70 Q50,30 80,70 T140,70"
                    stroke="#00CEFF"
                    strokeWidth="4"
                    fill="none"
                  />
                </svg>
              </div>
            </div>
          </div>
        </section>

        <section className="about-section mb-20">
          <div className="flex flex-col md:flex-row-reverse items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Technology
              </h2>
              <p className="text-lg text-gray-300 mb-4">
                Our proprietary vector generation engine uses advanced
                algorithms to create perfectly scalable graphics that maintain
                crispness at any size.
              </p>
              <p className="text-lg text-gray-300">
                Whether you need simple icons or complex illustrations, our
                tools ensure pixel-perfect results every time.
              </p>
            </div>
            <div className="md:w-1/2">
              <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl p-8 h-64 flex items-center justify-center">
                <svg viewBox="0 0 200 100" className="w-full h-48">
                  <rect
                    x="20"
                    y="20"
                    width="40"
                    height="60"
                    fill="#6C5CE7"
                    opacity="0.7"
                  />
                  <circle
                    cx="120"
                    cy="50"
                    r="30"
                    fill="#00CEFF"
                    opacity="0.7"
                  />
                  <polygon
                    points="170,20 190,80 150,80"
                    fill="#6C5CE7"
                    opacity="0.7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section about-section py-12 bg-gray-50 rounded-2xl mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-4">
              <div className="text-4xl font-bold text-purple-600 stat-number">
                5000
              </div>
              <div className="text-gray-500 mt-2">Vector Assets</div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-bold text-blue-600 stat-number">
                12000
              </div>
              <div className="text-gray-500 mt-2">Happy Customers</div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-bold text-purple-600 stat-number">
                98
              </div>
              <div className="text-gray-500 mt-2">Countries Served</div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-bold text-blue-600 stat-number">
                24
              </div>
              <div className="text-gray-500 mt-2">Hour Support</div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="about-section">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Meet Our Team
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full"></div>
                <h3 className="text-xl font-semibold text-center text-gray-800">
                  Team Member {item}
                </h3>
                <p className="text-center text-gray-500 mb-3">
                  Vector{" "}
                  {item === 1
                    ? "Designer"
                    : item === 2
                    ? "Developer"
                    : "Artist"}
                </p>
                <p className="text-gray-600 text-center">
                  {item === 1
                    ? "Specializes in clean, modern vector designs"
                    : item === 2
                    ? "Builds our powerful generation tools"
                    : "Creates artistic vector illustrations"}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;

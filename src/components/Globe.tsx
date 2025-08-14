import { useEffect, useRef } from "react";
import Globe from "react-globe.gl";

function MyGlobe() {
  const globeRef = useRef<any>(0);

  useEffect(() => {
    if (globeRef.current) {
      // Auto-rotate
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = 0.33;
      globeRef.current.controls().enableZoom = false;
      globeRef.current.controls().enableRotate = false;
    }
  }, [globeRef]);

  return (
    <div>
      <Globe
        ref={globeRef}
        width={600}
        height={600}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        backgroundColor="rgba(0,0,0,0)"
        pointsData={[
          {
            lat: 40.71,
            lng: -74.01,
            label: "New York",
            color: "red",
            altitude: 0.1,
            radius: 0.1,
          },
        ]}
      />
    </div>
  );
}

export default MyGlobe;

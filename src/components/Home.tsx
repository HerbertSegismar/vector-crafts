import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";
import Heart from "../icons/Heart";
import Square from "../icons/Square";
import Triangle from "../icons/Triangle";
import Circle from "../icons/Circle";
import Settings from "../icons/Settings";
import Upload from "../icons/Upload";
import Download from "../icons/Download";
import PenTool from "../icons/PenTool";
import Layers from "../icons/Layers";

function Home() {
  gsap.registerPlugin(useGSAP);

  const [formValues, setFormValues] = useState({
    fillColor: "#EC4899",
    strokeWidth: "2",
    strokeStyle: "Solid",
    opacity: "100",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [activeTool, setActiveTool] = useState("select");
  const [showImportModal, setShowImportModal] = useState(false);
  const [layers, setLayers] = useState([
    { id: 1, name: "Heart", type: "heart", visible: true, locked: false },
    {
      id: 2,
      name: "Background",
      type: "rectangle",
      visible: true,
      locked: false,
    },
  ]);
  const [showProperties, setShowProperties] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const handleToolClick = (tool: string) => setActiveTool(tool);

  const addShape = (shapeType: string) => {
    const newLayer = {
      id: layers.length + 1,
      name: `${shapeType.charAt(0).toUpperCase() + shapeType.slice(1)} ${
        layers.length + 1
      }`,
      type: shapeType,
      visible: true,
      locked: false,
    };
    setLayers([...layers, newLayer]);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-300/5 text-gray-100 overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="bg-gray-900/80 backdrop-blur-lg py-3 px-6 flex items-center justify-between border-b border-gray-800">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center"
        >
          <Heart className="w-8 h-8 text-pink-500 mr-2" />
          <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-violet-400">
            Vector Crafts
          </h1>
        </motion.div>

        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700/80 rounded-lg transition-all border border-gray-700 text-sm font-medium">
            Save
          </button>
          <button
            onClick={() => setShowImportModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-violet-500 hover:opacity-90 rounded-lg transition-all text-white text-sm font-medium"
          >
            Import
          </button>
          <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700/80 rounded-lg transition-all border border-gray-700 flex items-center text-sm font-medium">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        {/* Tools Panel - Now horizontal on mobile */}
        <div className="w-full md:w-14 bg-gray-900/80 backdrop-blur-lg md:border-r border-b md:border-b-0 border-gray-800 py-2 md:py-4 flex md:flex-col items-center justify-center md:justify-start space-x-2 md:space-x-0 md:space-y-5">
          {[
            {
              tool: "select",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                  />
                </svg>
              ),
            },
            { tool: "pen", icon: <PenTool className="h-5 w-5" /> },
            null, // Divider
            { tool: "rectangle", icon: <Square className="h-5 w-5" /> },
            { tool: "circle", icon: <Circle className="h-5 w-5" /> },
            { tool: "triangle", icon: <Triangle className="h-5 w-5" /> },
            {
              tool: "heart",
              icon: <Heart className="h-5 w-5 text-pink-500" />,
            },
          ].map((item, index) =>
            item ? (
              <button
                key={item.tool}
                className={`p-2 rounded-lg transition-all ${
                  activeTool === item.tool
                    ? "bg-pink-500/10 text-pink-400 ring-1 ring-pink-500/30"
                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
                }`}
                onClick={() => {
                  handleToolClick(item.tool);
                  if (item.tool !== "select" && item.tool !== "pen") {
                    addShape(item.tool);
                  }
                }}
                title={item.tool.charAt(0).toUpperCase() + item.tool.slice(1)}
              >
                {item.icon}
              </button>
            ) : (
              <div
                key={`divider-${index}`}
                className="border-t border-gray-800 w-6 mx-auto hidden md:block"
              />
            )
          )}
        </div>

        {/* Canvas Area */}
        <div className="flex-1 bg-gradient-to-br from-gray-950 to-gray-900 overflow-auto flex items-center justify-center p-4 relative">
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl w-full h-full max-w-5xl max-h-[85vh] relative overflow-hidden border border-gray-800 shadow-xl">
            {/* Demo shapes */}
            {activeTool === "rectangle" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-20 left-20 w-32 h-24 bg-gradient-to-br from-pink-500/30 to-violet-500/30 rounded-lg backdrop-blur-[1px] border border-pink-500/20 shadow-lg"
                drag
                dragConstraints={{ left: 0, right: 300, top: 0, bottom: 300 }}
              />
            )}

            {activeTool === "circle" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-32 right-20 w-24 h-24 bg-gradient-to-br from-cyan-400/30 to-blue-500/30 rounded-full backdrop-blur-[1px] border border-cyan-400/20 shadow-lg"
                drag
                dragConstraints={{ left: 0, right: 300, top: 0, bottom: 300 }}
              />
            )}

            {activeTool === "heart" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                drag
                dragConstraints={{ left: 0, right: 300, top: 0, bottom: 300 }}
              >
                <Heart className="w-24 h-24 text-pink-500 drop-shadow-lg" />
              </motion.div>
            )}
          </div>

          {/* Mobile properties toggle button */}
          {isMobile && (
            <button
              onClick={() => setShowProperties(!showProperties)}
              className="md:hidden absolute bottom-4 right-4 bg-gray-900/80 backdrop-blur-lg p-2 rounded-full border border-gray-700 shadow-lg z-10"
            >
              <Settings className="w-5 h-5 text-gray-300" />
            </button>
          )}
        </div>

        {/* Properties Panel - Now bottom drawer on mobile */}
        {(!isMobile || showProperties) && (
          <div
            className={`${
              isMobile
                ? "fixed inset-x-0 bottom-0 h-[40vh] overflow-y-auto border-t"
                : "w-60 border-l"
            } bg-gray-900/80 backdrop-blur-lg border-gray-800 p-4 flex flex-col`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium text-gray-200 text-sm uppercase tracking-wider">
                Properties
              </h2>
              <Settings className="w-4 h-4 text-gray-400 hover:text-pink-400 cursor-pointer transition-colors" />
            </div>

            <div className="space-y-3">
              <div>
                <label
                  htmlFor="fillColor"
                  className="block text-xs font-medium text-gray-400 mb-1"
                >
                  Fill
                </label>
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded border border-gray-700 bg-gradient-to-br from-pink-500 to-violet-500 cursor-pointer shadow-inner" />
                  <input
                    id="fillColor"
                    name="fillColor"
                    type="text"
                    value={formValues.fillColor}
                    onChange={handleInputChange}
                    className="flex-1 border border-gray-800 bg-gray-900 rounded px-2 py-1 text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-pink-500/30"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="strokeWidth"
                  className="block text-xs font-medium text-gray-400 mb-1"
                >
                  Stroke
                </label>
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded border border-gray-700 bg-gray-200 cursor-pointer shadow-inner" />
                  <input
                    id="strokeWidth"
                    name="strokeWidth"
                    type="number"
                    value={formValues.strokeWidth}
                    onChange={handleInputChange}
                    className="w-12 border border-gray-800 bg-gray-900 rounded px-2 py-1 text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-pink-500/30"
                  />
                  <select
                    id="strokeStyle"
                    name="strokeStyle"
                    value={formValues.strokeStyle}
                    onChange={handleInputChange}
                    className="flex-1 border border-gray-800 bg-gray-900 rounded px-2 py-1 text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-pink-500/30"
                  >
                    <option>Solid</option>
                    <option>Dashed</option>
                    <option>Dotted</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="opacity"
                  className="block text-xs font-medium text-gray-400 mb-1"
                >
                  Opacity
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="opacity"
                    name="opacity"
                    type="range"
                    min="0"
                    max="100"
                    value={formValues.opacity}
                    onChange={handleInputChange}
                    className="flex-1 accent-pink-500"
                  />
                  <span className="text-xs text-gray-400 w-8 text-right">
                    {formValues.opacity}%
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-medium text-gray-200 text-sm uppercase tracking-wider flex items-center">
                  <Layers className="w-4 h-4 mr-2 text-gray-400" /> Layers
                </h2>
                <button className="text-xs text-pink-400 hover:text-pink-300 transition-colors">
                  + Add
                </button>
              </div>

              <div className="space-y-1 max-h-[200px] overflow-y-auto">
                {layers.map((layer) => (
                  <div
                    key={layer.id}
                    className="flex items-center justify-between p-2 hover:bg-gray-800/50 rounded transition-colors group"
                  >
                    <div className="flex items-center">
                      <input
                        id={`layer-visible-${layer.id}`}
                        type="checkbox"
                        checked={layer.visible}
                        onChange={() => {
                          const updatedLayers = layers.map((l) =>
                            l.id === layer.id
                              ? { ...l, visible: !l.visible }
                              : l
                          );
                          setLayers(updatedLayers);
                        }}
                        className="mr-2 h-3 w-3 accent-pink-500"
                      />
                      <label
                        htmlFor={`layer-visible-${layer.id}`}
                        className="text-xs text-gray-300 cursor-pointer"
                      >
                        {layer.name}
                      </label>
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-gray-300 transition-opacity">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Close button for mobile */}
            {isMobile && (
              <button
                onClick={() => setShowProperties(false)}
                className="md:hidden absolute top-2 right-2 text-gray-400 hover:text-pink-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Status Bar */}
      <footer className="bg-gray-900/80 backdrop-blur-lg border-t border-gray-800 px-4 py-1.5 text-xs text-gray-400 flex justify-between">
        <div>Vector Crafts v1.0</div>
        <div className="text-pink-400">Ready</div>
        <div>Zoom: 100%</div>
      </footer>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900/90 backdrop-blur-lg rounded-xl p-5 w-full max-w-sm border border-gray-800 shadow-2xl"
          >
            <h2 className="text-lg font-bold mb-3 text-gray-100">Import SVG</h2>
            <div className="border-2 border-dashed border-gray-800 rounded-lg p-6 text-center mb-4 bg-gray-900/30">
              <Upload className="w-10 h-10 mx-auto text-gray-500 mb-2" />
              <p className="text-gray-400 text-sm">Drag and drop files here</p>
              <button className="mt-3 px-4 py-2 bg-gradient-to-r from-pink-500 to-violet-500 text-white rounded-lg hover:opacity-90 transition-opacity text-sm">
                Select Files
              </button>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 border border-gray-800 rounded-lg hover:bg-gray-800/50 text-gray-300 transition-colors text-sm"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-violet-500 text-white rounded-lg hover:opacity-90 transition-opacity text-sm">
                Import
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default Home;

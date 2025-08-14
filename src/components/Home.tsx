import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";
import Heart from "../icons/Heart"
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
  const container = useRef(null);
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

  // Animation for the demo heart
  useGSAP(() => {
    gsap.from("#demo-heart", {
      scale: 0.5,
      opacity: 0,
      duration: 1,
      ease: "back.out(1.7)",
    });
  }, [container]);

  const handleToolClick = (tool: string) => {
    setActiveTool(tool);
    // Add tool-specific functionality here
  };

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
    <div className="flex flex-col h-screen bg-gray-100 text-gray-800 overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="bg-white shadow-sm py-2 px-4 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center"
        >
          <Heart className="w-8 h-8 text-red-500 mr-2" />
          <h1 className="text-xl font-bold text-gray-800">Vector Crafts</h1>
        </motion.div>

        <div className="flex space-x-4">
          <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
            Save
          </button>
          <button
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
            onClick={() => setShowImportModal(true)}
          >
            Import
          </button>
          <button className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 transition flex items-center">
            <Download className="w-4 h-4 mr-1" />
            Export
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Tools Panel */}
        <div className="w-16 bg-white shadow-md py-4 flex flex-col items-center space-y-6">
          <button
            className={`p-2 rounded-lg ${
              activeTool === "select"
                ? "bg-blue-100 text-blue-600"
                : "hover:bg-gray-100"
            }`}
            onClick={() => handleToolClick("select")}
            title="Selection Tool"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
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
          </button>

          <button
            className={`p-2 rounded-lg ${
              activeTool === "pen"
                ? "bg-blue-100 text-blue-600"
                : "hover:bg-gray-100"
            }`}
            onClick={() => handleToolClick("pen")}
            title="Pen Tool"
          >
            <PenTool className="h-6 w-6" />
          </button>

          <div className="border-t border-gray-200 w-8 mx-auto"></div>

          <button
            className={`p-2 rounded-lg ${
              activeTool === "rectangle"
                ? "bg-blue-100 text-blue-600"
                : "hover:bg-gray-100"
            }`}
            onClick={() => {
              handleToolClick("rectangle");
              addShape("rectangle");
            }}
            title="Rectangle"
          >
            <Square className="h-6 w-6" />
          </button>

          <button
            className={`p-2 rounded-lg ${
              activeTool === "circle"
                ? "bg-blue-100 text-blue-600"
                : "hover:bg-gray-100"
            }`}
            onClick={() => {
              handleToolClick("circle");
              addShape("circle");
            }}
            title="Circle"
          >
            <Circle className="h-6 w-6" />
          </button>

          <button
            className={`p-2 rounded-lg ${
              activeTool === "triangle"
                ? "bg-blue-100 text-blue-600"
                : "hover:bg-gray-100"
            }`}
            onClick={() => {
              handleToolClick("triangle");
              addShape("triangle");
            }}
            title="Triangle"
          >
            <Triangle className="h-6 w-6" />
          </button>

          <button
            className={`p-2 rounded-lg ${
              activeTool === "heart"
                ? "bg-blue-100 text-blue-600"
                : "hover:bg-gray-100"
            }`}
            onClick={() => {
              handleToolClick("heart");
              addShape("heart");
            }}
            title="Heart"
          >
            <Heart className="h-6 w-6 text-red-500" />
          </button>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 bg-gray-50 border-l border-r border-gray-200 overflow-auto flex items-center justify-center p-8">
          <div className="bg-white shadow-lg rounded-lg w-full h-full max-w-4xl max-h-[80vh] relative overflow-hidden border border-gray-200">
            {/* This would be your actual canvas component in a real app */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                id="demo-heart"
                whileHover={{ scale: 1.1 }}
                className="cursor-pointer"
              >
                <Heart className="w-32 h-32 text-red-500" />
              </motion.div>
            </div>

            {/* Demo shapes that would be created by tools */}
            {activeTool === "rectangle" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-20 left-20 w-32 h-24 bg-blue-400 rounded-md"
                drag
                dragConstraints={{ left: 0, right: 300, top: 0, bottom: 300 }}
              />
            )}

            {activeTool === "circle" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-32 right-20 w-24 h-24 bg-green-400 rounded-full"
                drag
                dragConstraints={{ left: 0, right: 300, top: 0, bottom: 300 }}
              />
            )}
          </div>
        </div>

        {/* Properties Panel */}
        <div className="w-64 bg-white shadow-md p-4 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-700">Properties</h2>
            <Settings className="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer" />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fill Color
              </label>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded border border-gray-300 bg-red-500 mr-2 cursor-pointer"></div>
                <input
                  type="text"
                  value="#EF4444"
                  className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stroke
              </label>
              <div className="flex space-x-2">
                <div className="w-8 h-8 rounded border border-gray-300 bg-black mr-2 cursor-pointer"></div>
                <input
                  type="number"
                  value="2"
                  className="border border-gray-300 rounded px-2 py-1 text-sm w-16"
                />
                <select className="border border-gray-300 rounded px-2 py-1 text-sm flex-1">
                  <option>Solid</option>
                  <option>Dashed</option>
                  <option>Dotted</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Opacity
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value="100"
                className="w-full"
              />
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold text-gray-700 flex items-center">
                <Layers className="w-4 h-4 mr-1" /> Layers
              </h2>
              <button className="text-xs text-blue-500 hover:text-blue-700">
                Add
              </button>
            </div>

            <div className="space-y-1">
              {layers.map((layer) => (
                <div
                  key={layer.id}
                  className="flex items-center justify-between p-2 hover:bg-gray-100 rounded"
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={layer.visible}
                      onChange={() => {}}
                      className="mr-2"
                    />
                    <span className="text-sm">{layer.name}</span>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
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
        </div>
      </div>

      {/* Status Bar */}
      <footer className="bg-white border-t border-gray-200 px-4 py-2 text-xs text-gray-500 flex justify-between">
        <div>Vector Crafts v1.0</div>
        <div>Ready</div>
        <div>Zoom: 100%</div>
      </footer>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md"
          >
            <h2 className="text-xl font-bold mb-4">Import Vector Graphic</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-600">Drag and drop SVG files here</p>
              <p className="text-gray-400 text-sm mt-1">or</p>
              <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Browse Files
              </button>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                onClick={() => setShowImportModal(false)}
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
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

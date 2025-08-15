
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";
import * as fabric from "fabric";
import {
  FiCopy,
  FiSave,
  FiLayers,
  FiEye,
  FiEyeOff,
  FiLock,
  FiUnlock,
} from "react-icons/fi";
import { HexColorPicker } from "react-colorful";

// Import your icons
import Heart from "../icons/Heart";
import Square from "../icons/Square";
import Triangle from "../icons/Triangle";
import Circle from "../icons/Circle";
import Settings from "../icons/Settings";
import Upload from "../icons/Upload";
import Download from "../icons/Download";
import PenTool from "../icons/PenTool";

declare module "fabric" {
  interface CanvasEvents {
    "object:selected": (options: {
      target: fabric.Object;
      e: MouseEvent;
    }) => void;
  }
}

// types/fabric.d.ts
declare module 'fabric' {
  interface Object {
    bringToFront(): void;
    bringForward(): void;
    sendBackwards(): void;
    sendToBack(): void;
    // Add other methods you need
  }
}

interface CanvasLayer {
  id: number;
  name: string;
  type: string;
  visible: boolean;
  locked: boolean;
  object: fabric.Object | null; // Explicitly type the Fabric object
}

// types/canvas.d.ts
export interface Layer {
  id: number;
  name: string;
  type: 'svg' | 'rect' | 'circle' | 'text';
  visible: boolean;
  locked: boolean;
  object: fabric.Object | null;
}

function Home() {

  gsap.registerPlugin(useGSAP);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [layers, setLayers] = useState<CanvasLayer[]>([]);

  // State management
  const [formValues, setFormValues] = useState({
    fillColor: "#EC4899",
    strokeColor: "#FFFFFF",
    strokeWidth: "2",
    strokeStyle: "Solid",
    opacity: "100",
    shadow: "none",
    gradient: false,
  });

  const [activeTool, setActiveTool] = useState("select");
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showStrokePicker, setShowStrokePicker] = useState(false);
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(
    null
  );
  const [zoom, setZoom] = useState(100);
  const [history, setHistory] = useState<fabric.Object[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  

  const [showProperties, setShowProperties] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const saveToHistory = () => {
    if (fabricCanvasRef.current) {
      const json = fabricCanvasRef.current.toJSON();
      setHistory((prev) => [...prev, json]);
    }
  };


  // Initialize Fabric.js canvas
  useEffect(() => {
    if (canvasRef.current) {
      fabricCanvasRef.current = new fabric.Canvas(canvasRef.current, {
        backgroundColor: "#1f2937",
        selectionColor: "rgba(236, 72, 153, 0.3)",
        selectionBorderColor: "#EC4899",
        selectionLineWidth: 2,
        width: 1200, // Logical width
        height: 800, // Logical height
        enableRetinaScaling: true, // Enable retina/high-DPI support
      });


      
      fabricCanvasRef.current.on(
        "object:selected" as keyof fabric.CanvasEvents,
        (
          options: fabric.TPointerEventInfo<PointerEvent> & {
            target: fabric.Object;
          }
        ) => {
          if (options.target) {
            setSelectedObject(options.target);
            setFormValues({
              ...formValues,
              fillColor: (options.target.fill as string) || "#EC4899",
              strokeColor: (options.target.stroke as string) || "#FFFFFF",
              strokeWidth: options.target.strokeWidth?.toString() || "2",
              opacity: ((options.target.opacity || 1) * 100).toString(),
            });
          }
        }
      );

      fabricCanvasRef.current.on("selection:cleared", () => {
        setSelectedObject(null);
      });

      fabricCanvasRef.current.on("object:modified", () => {
        saveToHistory();
      });

      return () => {
        fabricCanvasRef.current?.dispose();
      };
    }
  }, []);
  

  const undo = () => {
    if (historyIndex <= 0 || !fabricCanvasRef.current) return;
    fabricCanvasRef.current.clear();
    const previousState = history[historyIndex - 1];
    previousState.forEach((obj) => {
      fabricCanvasRef.current?.add(obj);
    });
    fabricCanvasRef.current.renderAll();
    setHistoryIndex(historyIndex - 1);
  };

  const redo = () => {
    if (historyIndex >= history.length - 1 || !fabricCanvasRef.current) return;
    fabricCanvasRef.current.clear();
    const nextState = history[historyIndex + 1];
    nextState.forEach((obj) => {
      fabricCanvasRef.current?.add(obj);
    });
    fabricCanvasRef.current.renderAll();
    setHistoryIndex(historyIndex + 1);
  };

  // Mobile detection
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const newValues = {
      ...formValues,
      [name]: value,
    };
    setFormValues(newValues);

    if (selectedObject && fabricCanvasRef.current) {
      switch (name) {
        case "fillColor":
          selectedObject.set("fill", value);
          break;
        case "strokeColor":
          selectedObject.set("stroke", value);
          break;
        case "strokeWidth":
          selectedObject.set("strokeWidth", parseInt(value));
          break;
        case "opacity":
          selectedObject.set("opacity", parseInt(value) / 100);
          break;
      }
      fabricCanvasRef.current.renderAll();
      saveToHistory();
    }
  };

  const handleToolClick = (tool: string) => {
    setActiveTool(tool);
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.isDrawingMode = tool === "pen";
      fabricCanvasRef.current.selection = tool === "select";
    }

    if (tool !== "select" && tool !== "pen") {
      addShape(tool);
    }
  };

  const addShape = (shapeType: string) => {
    if (!fabricCanvasRef.current) return;

    let shape;
    const center = {
      left: fabricCanvasRef.current.width
        ? fabricCanvasRef.current.width / 2
        : 200,
      top: fabricCanvasRef.current.height
        ? fabricCanvasRef.current.height / 2
        : 200,
    };

    switch (shapeType) {
      case "rectangle":
        shape = new fabric.Rect({
          left: center.left - 50,
          top: center.top - 40,
          width: 100,
          height: 80,
          fill: formValues.fillColor,
          stroke: formValues.strokeColor,
          strokeWidth: parseInt(formValues.strokeWidth),
          opacity: parseInt(formValues.opacity) / 100,
          selectable: true,
        });
        break;
      case "circle":
        shape = new fabric.Circle({
          left: center.left,
          top: center.top,
          radius: 40,
          fill: formValues.fillColor,
          stroke: formValues.strokeColor,
          strokeWidth: parseInt(formValues.strokeWidth),
          opacity: parseInt(formValues.opacity) / 100,
          selectable: true,
        });
        break;
      case "triangle":
        shape = new fabric.Triangle({
          left: center.left,
          top: center.top,
          width: 80,
          height: 80,
          fill: formValues.fillColor,
          stroke: formValues.strokeColor,
          strokeWidth: parseInt(formValues.strokeWidth),
          opacity: parseInt(formValues.opacity) / 100,
          selectable: true,
        });
        break;
      case "heart":
        shape = new fabric.Path(
          "M10 6 Q10 0 15 0 T20 6 Q20 10 10 16 Q0 10 0 6 Q0 0 5 0 T10 6",
          {
            left: center.left,
            top: center.top,
            fill: formValues.fillColor,
            stroke: formValues.strokeColor,
            strokeWidth: parseInt(formValues.strokeWidth),
            opacity: parseInt(formValues.opacity) / 100,
            selectable: true,
            scaleX: 2,
            scaleY: 2,
          }
        );
        break;
    }

    if (shape) {
      fabricCanvasRef.current.add(shape);
      fabricCanvasRef.current.setActiveObject(shape);
      setSelectedObject(shape);

      // Add to layers
      const newLayer = {
        id: layers.length + 1,
        name: `${shapeType.charAt(0).toUpperCase() + shapeType.slice(1)} ${
          layers.length + 1
        }`,
        type: shapeType,
        visible: true,
        locked: false,
        object: shape,
      };
      setLayers([...layers, newLayer]);

      saveToHistory();
    }
  };

  const deleteSelected = () => {
    if (fabricCanvasRef.current) {
      const activeObject = fabricCanvasRef.current.getActiveObject();
      if (activeObject) {
        fabricCanvasRef.current.remove(activeObject);
        setSelectedObject(null);
        saveToHistory();
      }
    }
  };

  const duplicateSelected = () => {
    if (!fabricCanvasRef.current) return;

    const activeObject = fabricCanvasRef.current.getActiveObject();
    if (!activeObject) return;

    // Type assertion approach
    (activeObject as any).clone((cloned: fabric.Object) => {
      cloned.set({
        left: (cloned.left || 0) + 10,
        top: (cloned.top || 0) + 10,
      });
      fabricCanvasRef.current?.add(cloned);
      fabricCanvasRef.current?.setActiveObject(cloned);
      setSelectedObject(cloned);
      saveToHistory();
    });
  };


  const exportAsImage = (format: "png" | "jpeg" | "svg") => {
    if (!fabricCanvasRef.current) return;

    let dataUrl;
    switch (format) {
      case "png":
        dataUrl = fabricCanvasRef.current.toDataURL({
          multiplier: 1, 
          format: "png",
          quality: 1,
        });
        break;
      case "jpeg":
        dataUrl = fabricCanvasRef.current.toDataURL({
          multiplier: 1, 
          format: "jpeg",
          quality: 0.8,
        });
        break;
      case "svg":
        dataUrl = fabricCanvasRef.current.toSVG();
        break;
    }

    const link = document.createElement("a");
    link.download = `vector-crafts-${new Date().getTime()}.${format}`;
    link.href = dataUrl;
    link.click();
  };

  const importSVG = (file: File) => {
    if (!fabricCanvasRef.current) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const svgString = e.target?.result as string;
        if (!svgString) throw new Error("Failed to read SVG file");

        fabric.loadSVGFromString(svgString).then((result) => {
          // Filter out null values to create a new array with only valid Fabric objects
          const validObjects = result.objects.filter(
            (obj) => obj !== null
          ) as fabric.Object[];

          // Now you can use validObjects, which is guaranteed to be of type fabric.Object[]
          if (!fabricCanvasRef.current || !validObjects.length) return;

          const group = new fabric.Group(validObjects, {
            originX: "center",
            originY: "center",
            padding: 10,
            subTargetCheck: true,
          });

          const canvas = fabricCanvasRef.current;
          canvas.add(group);
          canvas.viewportCenterObject(group);
          canvas.setActiveObject(group);
          canvas.requestRenderAll();

          setSelectedObject(group);
          saveToHistory();
        });

      } catch (error) {
        console.error("Error importing SVG:", error);
        // Handle error in UI
      }
    };

    reader.onerror = () => {
      console.error("File reading error");
      // Handle error in UI
    };

    reader.readAsText(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      importSVG(e.target.files[0]);
      setShowImportModal(false);
    }
  };

  const toggleLayerVisibility = (id: number) => {
    const updatedLayers = layers.map((layer) => {
      if (layer.id === id && layer.object) {
        const visible = !layer.visible;
        layer.object.set("visible", visible);
        return { ...layer, visible };
      }
      return layer;
    });
    setLayers(updatedLayers);
    fabricCanvasRef.current?.renderAll();
  };

  const toggleLayerLock = (id: number) => {
    const updatedLayers = layers.map((layer) => {
      if (layer.id === id && layer.object) {
        const locked = !layer.locked;
        layer.object.set("selectable", !locked);
        return { ...layer, locked };
      }
      return layer;
    });
    setLayers(updatedLayers);
  };

  const bringToFront = () => {
    if (selectedObject && fabricCanvasRef.current) {
      selectedObject.bringToFront();
      fabricCanvasRef.current.renderAll();
      saveToHistory();
    }
  };

  const sendToBack = () => {
    if (selectedObject && fabricCanvasRef.current) {
      selectedObject.sendToBack();
      fabricCanvasRef.current.renderAll();
      saveToHistory();
    }
  };

  const handleZoom = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setZoom(value);
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.setZoom(value / 100);
    }
  };

  const resetZoom = () => {
    setZoom(100);
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.setZoom(1);
    }
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (activeTool === "hand" && fabricCanvasRef.current) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX,
        y: e.clientY,
      });
      fabricCanvasRef.current.selection = false;
      fabricCanvasRef.current.defaultCursor = "grabbing";
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (isDragging && fabricCanvasRef.current) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      const vpt = fabricCanvasRef.current.viewportTransform;
      if (vpt) {
        vpt[4] += deltaX;
        vpt[5] += deltaY;
        fabricCanvasRef.current.setViewportTransform(vpt);
        fabricCanvasRef.current.requestRenderAll();
      }

      setDragStart({
        x: e.clientX,
        y: e.clientY,
      });
    }
  };

  const handleCanvasMouseUp = () => {
    if (isDragging && fabricCanvasRef.current) {
      setIsDragging(false);
      fabricCanvasRef.current.selection = true;
      fabricCanvasRef.current.defaultCursor = "default";
    }
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
          <button
            onClick={() => saveToHistory()}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700/80 rounded-lg transition-all border border-gray-700 text-sm font-medium flex items-center"
          >
            <FiSave className="mr-2" /> Save
          </button>
          <button
            onClick={() => setShowImportModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-violet-500 hover:opacity-90 rounded-lg transition-all text-white text-sm font-medium"
          >
            Import
          </button>
          <button
            onClick={() => setShowExportModal(true)}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700/80 rounded-lg transition-all border border-gray-700 flex items-center text-sm font-medium"
          >
            <Download className="w-4 h-4 mr-2" /> Export
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        {/* Tools Panel */}
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
            {
              tool: "hand",
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
                    d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"
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
            null, // Divider
            {
              tool: "undo",
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
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              ),
              action: undo,
              disabled: historyIndex <= 0,
            },
            {
              tool: "redo",
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
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              ),
              action: redo,
              disabled: historyIndex >= history.length - 1,
            },
            {
              tool: "delete",
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              ),
              action: deleteSelected,
              disabled: !selectedObject,
            },
            {
              tool: "duplicate",
              icon: <FiCopy className="h-5 w-5" />,
              action: duplicateSelected,
              disabled: !selectedObject,
            },
            {
              tool: "front",
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
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
              ),
              action: bringToFront,
              disabled: !selectedObject,
            },
            {
              tool: "back",
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
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              ),
              action: sendToBack,
              disabled: !selectedObject,
            },
          ].map((item, index) =>
            item ? (
              <button
                key={item.tool}
                className={`p-2 rounded-lg transition-all ${
                  activeTool === item.tool
                    ? "bg-pink-500/10 text-pink-400 ring-1 ring-pink-500/30"
                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
                } ${item.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() =>
                  item.action ? item.action() : handleToolClick(item.tool)
                }
                title={item.tool.charAt(0).toUpperCase() + item.tool.slice(1)}
                disabled={item.disabled}
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
        <div
          className="flex-1 bg-gradient-to-br from-gray-950 to-gray-900 overflow-auto flex items-center justify-center p-4 relative"
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseUp}
        >
          <canvas
            ref={canvasRef}
            id="fabric-canvas"
            className="bg-gray-900/50 backdrop-blur-sm rounded-xl w-full h-full max-w-5xl max-h-[85vh] border border-gray-800 shadow-xl"
          />

          {/* Zoom controls */}
          <div className="absolute bottom-4 left-4 bg-gray-900/80 backdrop-blur-lg p-2 rounded-lg border border-gray-700 shadow-lg z-10">
            <div className="flex items-center space-x-2">
              <button
                onClick={() =>
                  handleZoom({
                    target: { value: (zoom - 10).toString() },
                  } as React.ChangeEvent<HTMLInputElement>)
                }
                className="px-2 text-gray-300 hover:text-white"
                disabled={zoom <= 10}
              >
                -
              </button>
              <input
                type="range"
                min="10"
                max="200"
                value={zoom}
                onChange={handleZoom}
                className="w-20 accent-pink-500"
              />
              <button
                onClick={() =>
                  handleZoom({
                    target: { value: (zoom + 10).toString() },
                  } as React.ChangeEvent<HTMLInputElement>)
                }
                className="px-2 text-gray-300 hover:text-white"
                disabled={zoom >= 200}
              >
                +
              </button>
              <button
                onClick={resetZoom}
                className="px-2 text-xs text-gray-300 hover:text-white"
              >
                {zoom}%
              </button>
            </div>
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

        {/* Properties Panel */}
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
              <div className="flex space-x-2">
                <Settings className="w-4 h-4 text-gray-400 hover:text-pink-400 cursor-pointer transition-colors" />
                {isMobile && (
                  <button
                    onClick={() => setShowProperties(false)}
                    className="text-gray-400 hover:text-pink-400"
                    aria-label="Close properties panel"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
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
            </div>

            {selectedObject ? (
              <>
                <div className="space-y-3">
                  {/* Fill Color */}
                  <div>
                    <label
                      htmlFor="fillColorInput"
                      className="block text-xs font-medium text-gray-400 mb-1"
                    >
                      Fill
                    </label>
                    <div className="flex gap-2 relative">
                      <button
                        id="fillColorButton"
                        onClick={() => setShowColorPicker(!showColorPicker)}
                        className="w-7 h-7 rounded border border-gray-700 cursor-pointer shadow-inner"
                        style={{ backgroundColor: formValues.fillColor }}
                        aria-labelledby="fillColorLabel fillColorButton"
                        aria-expanded={showColorPicker}
                      >
                        <span id="fillColorLabel" className="sr-only">
                          Fill color
                        </span>
                      </button>
                      <input
                        id="fillColorInput"
                        name="fillColor"
                        type="text"
                        value={formValues.fillColor}
                        onChange={handleInputChange}
                        className="flex-1 border border-gray-800 bg-gray-900 rounded px-2 py-1 text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-pink-500/30"
                        aria-labelledby="fillColorLabel"
                      />
                      {showColorPicker && (
                        <div className="absolute top-10 left-0 z-50">
                          <HexColorPicker
                            color={formValues.fillColor}
                            onChange={(color) => {
                              setFormValues({
                                ...formValues,
                                fillColor: color,
                              });
                              if (selectedObject) {
                                selectedObject.set("fill", color);
                                fabricCanvasRef.current?.renderAll();
                              }
                            }}
                          />
                          <button
                            onClick={() => setShowColorPicker(false)}
                            className="mt-2 w-full bg-gray-800 text-white text-xs py-1 rounded"
                            aria-label="Close color picker"
                          >
                            Close
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stroke Controls */}
                  <div>
                    <label
                      htmlFor="strokeWidthInput"
                      className="block text-xs font-medium text-gray-400 mb-1"
                    >
                      Stroke
                    </label>
                    <div className="flex gap-2 relative">
                      <button
                        id="strokeColorButton"
                        onClick={() => setShowStrokePicker(!showStrokePicker)}
                        className="w-7 h-7 rounded border border-gray-700 cursor-pointer shadow-inner"
                        style={{ backgroundColor: formValues.strokeColor }}
                        aria-labelledby="strokeColorLabel strokeColorButton"
                        aria-expanded={showStrokePicker}
                      >
                        <span id="strokeColorLabel" className="sr-only">
                          Stroke color
                        </span>
                      </button>
                      <input
                        id="strokeWidthInput"
                        name="strokeWidth"
                        type="number"
                        min="0"
                        max="20"
                        value={formValues.strokeWidth}
                        onChange={handleInputChange}
                        className="w-12 border border-gray-800 bg-gray-900 rounded px-2 py-1 text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-pink-500/30"
                        aria-labelledby="strokeColorLabel"
                      />
                      <select
                        id="strokeStyleSelect"
                        name="strokeStyle"
                        value={formValues.strokeStyle}
                        onChange={handleInputChange}
                        className="flex-1 border border-gray-800 bg-gray-900 rounded px-2 py-1 text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-pink-500/30"
                        aria-label="Stroke style"
                      >
                        <option>Solid</option>
                        <option>Dashed</option>
                        <option>Dotted</option>
                      </select>
                      {showStrokePicker && (
                        <div className="absolute top-10 left-0 z-50">
                          <HexColorPicker
                            color={formValues.strokeColor}
                            onChange={(color) => {
                              setFormValues({
                                ...formValues,
                                strokeColor: color,
                              });
                              if (selectedObject) {
                                selectedObject.set("stroke", color);
                                fabricCanvasRef.current?.renderAll();
                              }
                            }}
                          />
                          <button
                            onClick={() => setShowStrokePicker(false)}
                            className="mt-2 w-full bg-gray-800 text-white text-xs py-1 rounded"
                            aria-label="Close stroke color picker"
                          >
                            Close
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Opacity */}
                  <div>
                    <label
                      htmlFor="opacitySlider"
                      className="block text-xs font-medium text-gray-400 mb-1"
                    >
                      Opacity
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        id="opacitySlider"
                        name="opacity"
                        type="range"
                        min="0"
                        max="100"
                        value={formValues.opacity}
                        onChange={handleInputChange}
                        className="flex-1 accent-pink-500"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={parseInt(formValues.opacity)}
                      />
                      <span className="text-xs text-gray-400 w-8 text-right">
                        {formValues.opacity}%
                      </span>
                    </div>
                  </div>

                  {/* Shadow */}
                  <div>
                    <label
                      htmlFor="shadowSelect"
                      className="block text-xs font-medium text-gray-400 mb-1"
                    >
                      Shadow
                    </label>
                    <select
                      id="shadowSelect"
                      name="shadow"
                      value={formValues.shadow}
                      onChange={handleInputChange}
                      className="w-full border border-gray-800 bg-gray-900 rounded px-2 py-1 text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-pink-500/30"
                    >
                      <option value="none">None</option>
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>

                  {/* Gradient Checkbox */}
                  <div className="flex items-center">
                    <input
                      id="gradientCheckbox"
                      name="gradient"
                      type="checkbox"
                      checked={formValues.gradient}
                      onChange={(e) => {
                        const gradient = e.target.checked;
                        setFormValues({ ...formValues, gradient });
                        if (selectedObject) {
                          if (gradient) {
                            const gradient = new fabric.Gradient({
                              type: "linear",
                              gradientUnits: "pixels",
                              coords: {
                                x1: 0,
                                y1: 0,
                                x2: selectedObject.width,
                                y2: 0,
                              },
                              colorStops: [
                                { offset: 0, color: formValues.fillColor },
                                { offset: 1, color: "#6366F1" },
                              ],
                            });
                            selectedObject.set("fill", gradient);
                          } else {
                            selectedObject.set("fill", formValues.fillColor);
                          }
                          fabricCanvasRef.current?.renderAll();
                        }
                      }}
                      className="mr-2 h-4 w-4 accent-pink-500"
                    />
                    <label
                      htmlFor="gradientCheckbox"
                      className="text-xs text-gray-300"
                    >
                      Gradient Fill
                    </label>
                  </div>
                </div>

                {/* Layers Section */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="font-medium text-gray-200 text-sm uppercase tracking-wider flex items-center">
                      <FiLayers className="w-4 h-4 mr-2 text-gray-400" /> Layers
                    </h2>
                    <button
                      className="text-xs text-pink-400 hover:text-pink-300 transition-colors"
                      aria-label="Add new layer"
                    >
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
                          <button
                            onClick={() => toggleLayerVisibility(layer.id)}
                            className="mr-2 text-gray-400 hover:text-white"
                            aria-label={`${
                              layer.visible ? "Hide" : "Show"
                            } layer ${layer.name}`}
                          >
                            {layer.visible ? (
                              <FiEye className="w-4 h-4" />
                            ) : (
                              <FiEyeOff className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => toggleLayerLock(layer.id)}
                            className="mr-2 text-gray-400 hover:text-white"
                            aria-label={`${
                              layer.locked ? "Unlock" : "Lock"
                            } layer ${layer.name}`}
                          >
                            {layer.locked ? (
                              <FiLock className="w-4 h-4" />
                            ) : (
                              <FiUnlock className="w-4 h-4" />
                            )}
                          </button>
                          <span className="text-xs text-gray-200 truncate max-w-[100px]">
                            {layer.name}
                          </span>
                        </div>
                        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              if (layer.object) {
                                fabricCanvasRef.current?.setActiveObject(
                                  layer.object
                                );
                                setSelectedObject(layer.object);
                              }
                            }}
                            className="text-gray-400 hover:text-pink-400 p-1"
                            aria-label={`Select layer ${layer.name}`}
                          >
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
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => {
                              if (layer.object) {
                                fabricCanvasRef.current?.remove(layer.object);
                                setLayers(
                                  layers.filter((l) => l.id !== layer.id)
                                );
                                if (selectedObject === layer.object) {
                                  setSelectedObject(null);
                                }
                              }
                            }}
                            className="text-gray-400 hover:text-red-400 p-1"
                            aria-label={`Delete layer ${layer.name}`}
                          >
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
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-gray-600 mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <p className="text-gray-500 text-sm">
                  Select an object to edit properties
                </p>
              </div>
            )}
          </div>
        )}

        {/* Import Modal */}
        {showImportModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-200">
                  Import SVG
                </h3>
                <button
                  onClick={() => setShowImportModal(false)}
                  className="text-gray-400 hover:text-gray-200"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center">
                  <Upload className="w-10 h-10 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-400 mb-3">
                    Drag and drop SVG file here or click to browse
                  </p>
                  <input
                    type="file"
                    accept=".svg"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-block px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-sm font-medium text-gray-200 cursor-pointer transition-colors"
                  >
                    Browse Files
                  </label>
                </div>
                <div className="text-xs text-gray-500">
                  <p>Note: Only SVG files are supported for vector editing.</p>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Export Modal */}
        {showExportModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-200">
                  Export Design
                </h3>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="text-gray-400 hover:text-gray-200"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => exportAsImage("png")}
                    className="flex flex-col items-center justify-center p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-gray-300 mb-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-sm text-gray-200">PNG</span>
                    <span className="text-xs text-gray-500">High quality</span>
                  </button>
                  <button
                    onClick={() => exportAsImage("jpeg")}
                    className="flex flex-col items-center justify-center p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-gray-300 mb-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-sm text-gray-200">JPEG</span>
                    <span className="text-xs text-gray-500">Smaller file</span>
                  </button>
                  <button
                    onClick={() => exportAsImage("svg")}
                    className="flex flex-col items-center justify-center p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-gray-300 mb-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                      />
                    </svg>
                    <span className="text-sm text-gray-200">SVG</span>
                    <span className="text-xs text-gray-500">Vector format</span>
                  </button>
                  <button
                    onClick={() => {
                      if (fabricCanvasRef.current) {
                        const json = JSON.stringify(
                          fabricCanvasRef.current.toJSON()
                        );
                        navigator.clipboard.writeText(json);
                        // You might want to add a toast notification here
                        setShowExportModal(false);
                      }
                    }}
                    className="flex flex-col items-center justify-center p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <FiCopy className="h-8 w-8 text-gray-300 mb-2" />
                    <span className="text-sm text-gray-200">Copy JSON</span>
                    <span className="text-xs text-gray-500">For sharing</span>
                  </button>
                </div>
                <div className="text-xs text-gray-500">
                  <p>Note: Exported files will include all visible layers.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;

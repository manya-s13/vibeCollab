import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { PiMinus, PiPlus } from "react-icons/pi";
import { FiGithub } from "react-icons/fi";
import {
  HiOutlineArrowUturnLeft,
  HiOutlineArrowUturnRight,
} from "react-icons/hi2";

type ControlPanelProps = {
  undo: () => void;
  redo: () => void;
  onZoom: (scale: number) => void;
  scale: number;
  setScale: (scale: number) => void;
};

export function ControlPanel({
  undo,
  redo,
  onZoom,
  scale,
  setScale,
}: ControlPanelProps) {
  return (
    <>
      <div className="fixed top-4 right-4 z-50 bg-white rounded-xl shadow-lg border border-gray-200 p-2">
        <div className="flex items-center gap-1">
          <Tippy content="Zoom Out">
            <button 
              onClick={() => onZoom(-0.1)} 
              aria-label="Zoom Out"
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <PiMinus className="w-5 h-5" />
            </button>
          </Tippy>
          <Tippy content={`Set scale to 100%`}>
            <button
              onClick={() => setScale(1)}
              aria-label={`Set scale to 100%`}
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 min-w-[60px]"
            >
              {new Intl.NumberFormat("en-GB", { style: "percent" }).format(
                scale
              )}
            </button>
          </Tippy>
          <Tippy content="Zoom In">
            <button 
              onClick={() => onZoom(0.1)} 
              aria-label="Zoom In"
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <PiPlus className="w-5 h-5" />
            </button>
          </Tippy>
        </div>
      </div>

      {/* Edit Controls - Bottom Right */}
      <div className="fixed bottom-4 right-4 z-50 bg-white rounded-xl shadow-lg border border-gray-200 p-2">
        <div className="flex items-center gap-1">
          <Tippy content="Undo last action">
            <button 
              onClick={undo} 
              aria-label="Undo last action"
              className="p-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <HiOutlineArrowUturnLeft className="w-5 h-5" />
            </button>
          </Tippy>
          <Tippy content="Redo last action">
            <button 
              onClick={redo} 
              aria-label="Redo last action"
              className="p-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <HiOutlineArrowUturnRight className="w-5 h-5" />
            </button>
          </Tippy>
        </div>
      </div>

      {/* Attribution Link - Bottom Left */}
      <a 
        className="fixed bottom-4 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-lg border border-gray-200 text-gray-600 hover:text-gray-800 transition-all duration-200 hover:shadow-xl" 
        href="https://github.com/mirayatech" 
        target="_blank"
        rel="noopener noreferrer"
      >
        <FiGithub className="w-4 h-4" />
        <span className="text-sm font-medium">Created by Miraya</span>
      </a>
    </>
  );
}
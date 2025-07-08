import { Tools, type ToolsType } from "../../types";

import { LuPencil } from "react-icons/lu";
import { FiMinus, FiMousePointer, FiSquare } from "react-icons/fi";
import { IoHandRightOutline, IoText } from "react-icons/io5";


type ActionBarProps = {
  tool: ToolsType;
  setTool: (tool: ToolsType) => void;
};

export function ActionBar({ tool, setTool }: ActionBarProps) {
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-white rounded-xl shadow-lg border border-gray-200 p-2">
      <div className="flex items-center gap-2">
        {Object.values(Tools).map((t, index) => (
          <div
            className={`relative group cursor-pointer transition-all duration-200 ${
              tool === t 
                ? "bg-pink-400 text-white shadow-md scale-105" 
                : "bg-gray-50 text-gray-700 hover:bg-gray-100 hover:scale-105"
            } rounded-lg p-3 flex flex-col items-center justify-center min-w-[50px] h-12`}
            key={t}
            onClick={() => setTool(t)}
          >
            <input
              type="radio"
              id={t}
              checked={tool === t}
              onChange={() => setTool(t)}
              className="hidden"
              readOnly
            />
            <div className="text-lg mb-1">
              {t === "pan" && <IoHandRightOutline />}
              {t === "selection" && <FiMousePointer />}
              {t === "rectangle" && <FiSquare />}
              {t === "line" && <FiMinus />}
              {t === "pencil" && <LuPencil />}
              {t === "text" && <IoText />}
            </div>
            
            {/* <span className="text-xs font-medium">{index + 1}</span> */}
            
            {/* Tooltip */}
            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-200 transition-opacity duration-200 pointer-events-none">
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
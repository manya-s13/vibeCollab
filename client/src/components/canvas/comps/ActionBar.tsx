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
    <div className="actionBar">
      {Object.values(Tools).map((t, index) => (
        <div
          className={`inputWrapper ${tool === t ? "selected" : ""}`}
          key={t}
          onClick={() => setTool(t)}
        >
          <input
            type="radio"
            id={t}
            checked={tool === t}
            onChange={() => setTool(t)}
            readOnly
          />
          <label htmlFor={t}>{t}</label>
          {t === "pan" && <IoHandRightOutline />}
          {t === "selection" && <FiMousePointer />}
          {t === "rectangle" && <FiSquare />}
          {t === "line" && <FiMinus />}
          {t === "pencil" && <LuPencil />}
          {t === "text" && <IoText />}
          <span>{index + 1}</span>
        </div>
      ))}
    </div>
  );
}
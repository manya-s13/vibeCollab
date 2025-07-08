
import { useEffect, useState } from "react";
import { type ElementType, type ToolsType } from "../../types";
import { FiX } from "react-icons/fi";

interface PropertiesPanelProps {
  selectedElement: ElementType | null;
  onUpdateElement: (id: number, properties: Partial<ElementType>) => void;
  onClose: () => void;
}

export function Panel({ selectedElement, onUpdateElement, onClose }: PropertiesPanelProps) {
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [fillColor, setFillColor] = useState("transparent");
  const [strokeWidth, setStrokeWidth] = useState(1);
  const [opacity, setOpacity] = useState(1);
  const [fontSize, setFontSize] = useState(24);

  useEffect(() => {
    if (selectedElement) {
      setStrokeColor(selectedElement.strokeColor || "#000000");
      setFillColor(selectedElement.fillColor || "transparent");
      setStrokeWidth(selectedElement.strokeWidth || 1);
      setOpacity(selectedElement.opacity || 1);
      setFontSize(selectedElement.fontSize || 24);
    }
  }, [selectedElement]);

  if (!selectedElement) return null;

  const handlePropertyChange = (property: string, value: any) => {
    onUpdateElement(selectedElement.id, { [property]: value });
  };

  const getElementTypeName = (type: ToolsType) => {
    switch (type) {
      case "rectangle": return "Rectangle";
      case "circle": return "Circle";
      case "line": return "Line";
      case "pencil": return "Pencil";
      case "text": return "Text";
      default: return type;
    }
  };

  return (
    <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50 bg-white rounded-xl shadow-lg border border-gray-200 w-80 max-h-[80vh] overflow-y-auto">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">
          {getElementTypeName(selectedElement.type)} Properties
        </h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-md transition-colors"
        >
          <FiX className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Stroke Color */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Stroke Color
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={strokeColor}
              onChange={(e) => {
                setStrokeColor(e.target.value);
                handlePropertyChange("strokeColor", e.target.value);
              }}
              className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={strokeColor}
              onChange={(e) => {
                setStrokeColor(e.target.value);
                handlePropertyChange("strokeColor", e.target.value);
              }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
              placeholder="#000000"
            />
          </div>
        </div>

        {/* Fill Color (for shapes) */}
        {(selectedElement.type === "rectangle" || selectedElement.type === "circle") && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Fill Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={fillColor === "transparent" ? "#ffffff" : fillColor}
                onChange={(e) => {
                  setFillColor(e.target.value);
                  handlePropertyChange("fillColor", e.target.value);
                }}
                className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={fillColor}
                onChange={(e) => {
                  setFillColor(e.target.value);
                  handlePropertyChange("fillColor", e.target.value);
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="transparent"
              />
            </div>
            <button
              onClick={() => {
                setFillColor("transparent");
                handlePropertyChange("fillColor", "transparent");
              }}
              className="text-xs text-pink-600 hover:text-pink-800"
            >
              Make Transparent
            </button>
          </div>
        )}

        {/* Stroke Width */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Stroke Width: `${strokeWidth}px`
          </label>
          <input
            type="range"
            min="1"
            max="20"
            value={strokeWidth}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              setStrokeWidth(value);
              handlePropertyChange("strokeWidth", value);
            }}
            className="w-full"
          />
          <input
            type="number"
            min="1"
            max="50"
            value={strokeWidth}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              setStrokeWidth(value);
              handlePropertyChange("strokeWidth", value);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>

        {/* Opacity */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Opacity: {Math.round(opacity * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={opacity}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              setOpacity(value);
              handlePropertyChange("opacity", value);
            }}
            className="w-full"
          />
        </div>

        {/* Font Size (for text) */}
        {selectedElement.type === "text" && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Font Size: {fontSize}px
            </label>
            <input
              type="range"
              min="8"
              max="72"
              value={fontSize}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                setFontSize(value);
                handlePropertyChange("fontSize", value);
              }}
              className="w-full"
            />
            <input
              type="number"
              min="8"
              max="144"
              value={fontSize}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                setFontSize(value);
                handlePropertyChange("fontSize", value);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
        )}

        {/* Element Info */}
        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Element Info</h4>
          <div className="text-xs text-gray-500 space-y-1">
            <div>ID: {selectedElement.id}</div>
            <div>Type: {selectedElement.type}</div>
            <div>Position: ({Math.round(selectedElement.x1)}, {Math.round(selectedElement.y1)})</div>
            <div>Size: {Math.round(Math.abs(selectedElement.x2 - selectedElement.x1))} × {Math.round(Math.abs(selectedElement.y2 - selectedElement.y1))}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

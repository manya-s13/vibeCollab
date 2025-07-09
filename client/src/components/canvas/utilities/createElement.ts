import rough from "roughjs";
import { Tools, type ElementType, type ToolsType } from "../../types";

export const createElement = (
  id: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  type: ToolsType,
  options?: {
    strokeColor?: string;
    fillColor?: string;
    strokeWidth?: number;
    opacity?: number;
    fontSize?: number;
    fillStyle?: "solid" ;
  }
): ElementType => {
  const generator = rough.generator();
  const defaultOptions = {
    strokeColor: "#000000",
    fillColor: "transparent",
    fillStyle: "solid",
    strokeWidth: 1,
    opacity: 1,
    fontSize: 24,
    ...options,
  };

  const roughOptions = {
    stroke: defaultOptions.strokeColor,
    fill: defaultOptions.fillColor === "transparent" ? undefined : defaultOptions.fillColor,
    strokeWidth: defaultOptions.strokeWidth,
    roughness: 0.5,
  };

  switch (type) {
    case Tools.line: {
      const roughElement = generator.line(x1, y1, x2, y2, roughOptions);
      return { 
        id, x1, y1, x2, y2, type, roughElement,
        ...defaultOptions
      };
    }
    case Tools.rectangle: {
      const roughElement = generator.rectangle(x1, y1, x2 - x1, y2 - y1, roughOptions);
      return { 
        id, x1, y1, x2, y2, type, roughElement,
        ...defaultOptions
      };
    }
    case Tools.circle: {
      const centerX = (x1 + x2) / 2;
      const centerY = (y1 + y2) / 2;
      const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) / 2;
      const roughElement = generator.circle(centerX, centerY, radius * 2, roughOptions);
      return { 
        id, x1, y1, x2, y2, type, roughElement,
        ...defaultOptions
      };
    }
    case Tools.pencil: {
      return { 
        id, x1, y1, x2, y2, type, points: [{ x: x1, y: y1 }],
        ...defaultOptions
      };
    }
    case Tools.text: {
      return { 
        id, x1, y1, x2, y2, type, text: "",
        ...defaultOptions
      };
    }
    default:
      throw new Error(`Type not recognised: ${type}`);
  }
};
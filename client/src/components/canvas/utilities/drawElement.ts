import getStroke from "perfect-freehand";
import { type ElementType } from "../../types";

export const drawElement = (
  
  roughCanvas: any,
  context: CanvasRenderingContext2D,
  element: ElementType
) => {
  const opacity = element.opacity || 1;
  const strokeColor = element.strokeColor || "#000000";
  const strokeWidth = element.strokeWidth || 1;
  const fontSize = element.fontSize || 24;

  // Save current context state
  context.save();
  context.globalAlpha = opacity;

  switch (element.type) {
    case "line":
    case "rectangle":
      case "circle":
        if (element.roughElement) {
          roughCanvas.draw(element.roughElement);
        }
      break;
    case "pencil": {
      if (!element.points) {
        throw new Error("Pencil element points are undefined");
      }
      
      const strokePoints = getStroke(element.points, {
        size: strokeWidth,
        thinning: 0,
        smoothing: 1,
        streamline: 0.5,
      });
      
      const formattedPoints: [number, number][] = strokePoints.map((point) => {
        if (point.length !== 2) {
          throw new Error(
            `Expected point to have exactly 2 elements, got ${point.length}`
          );
        }
        return [point[0], point[1]];
      });
      const stroke = getSvgPathFromStroke(formattedPoints);
      context.fillStyle = strokeColor;
      context.fill(new Path2D(stroke));
      break;
    }
    case "text": {
      context.textBaseline = "top";
      context.font = `${fontSize}px sans-serif`;
      context.fillStyle = strokeColor;
      const text = element.text || "";
      context.fillText(text, element.x1, element.y1);
      break;
    }
    default:
      throw new Error(`Type not recognised: ${element.type}`);
  }
  context.restore();
};

// 🥑 source: https://www.npmjs.com/package/perfect-freehand/v/1.0.4
const getSvgPathFromStroke = (stroke: [number, number][]) => {
  if (!stroke.length) return "";

  const d = stroke.reduce(
    (
      acc: string[],
      [x0, y0]: [number, number],
      i: number,
      arr: [number, number][]
    ) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(
        x0.toString(),
        y0.toString(),
        ((x0 + x1) / 2).toString(),
        ((y0 + y1) / 2).toString()
      );
      return acc;
    },
    ["M", ...stroke[0].map((num) => num.toString()), "Q"]
  );

  d.push("Z");
  return d.join(" ");
};
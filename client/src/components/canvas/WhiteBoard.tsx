import {
  type MouseEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import rough from "roughjs";
import { useHistory } from "../hooks/useHistory";
import { usePressedKeys } from "../hooks/usePressedKeys";
import {
  type ToolsType,
  type SelectedElementType,
  type ExtendedElementType,
  type ElementType,
  Tools,
  type ActionsType,
} from "../types";
import { ActionBar } from "./comps/ActionBar";
import { ControlPanel } from "./comps/ControlPanel";

import { adjustElementCoordinates } from "./utilities/adjustElementCoordinates";
import { adjustmentRequired } from "./utilities/adjustmentRequired";
import { createElement  } from "./utilities/createElement";
import { cursorForPosition } from "./utilities/cursorForPosition";
import { drawElement } from "./utilities/drawElement";
import { getElementAtPosition } from "./utilities/getElementAtPosition";
import { resizedCoordinates } from "./utilities/resizedCoordinates";
import { Panel } from "./properties/Panel";

export default function App() {
  const initialTool: ToolsType = Tools.selection;

  const { elements, setElements, undo, redo } = useHistory([]);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [startPanMousePosition, setStartPanMousePosition] = useState({
    x: 0,
    y: 0,
  });
  const [action, setAction] = useState<ActionsType>("none");
  const [tool, setTool] = useState<ToolsType>(initialTool);
  const [selectedElement, setSelectedElement] = useState<ElementType | null>();
  const [showProperties, setShowProperties] = useState(false);
  const [scale, setScale] = useState(1);
  const [scaleOffset, setScaleOffset] = useState({ x: 0, y: 0 });
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const pressedKeys = usePressedKeys();

  useLayoutEffect(() => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;
    const roughCanvas = rough.canvas(canvas);

    context.clearRect(0, 0, canvas.width, canvas.height);

    const scaledWidth = canvas.width * scale;
    const scaledHeight = canvas.height * scale;
    const scaleOffsetX = (scaledWidth - canvas.width) / 2;
    const scaleOffsetY = (scaledHeight - canvas.height) / 2;
    setScaleOffset({ x: scaleOffsetX, y: scaleOffsetY });

    context.save();
    context.translate(
      panOffset.x * scale - scaleOffsetX,
      panOffset.y * scale - scaleOffsetY
    );
    context.scale(scale, scale);

    elements.forEach((element) => {
      if (
        action === "writing" &&
        selectedElement &&
        selectedElement.id === element.id
      )
        return;
      drawElement(roughCanvas, context, element);
    });
    context.restore();
  }, [elements, action, selectedElement, panOffset, scale]);

  useEffect(() => {
    const undoRedoFunction = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        if (event.key === "z") {
          if (event.shiftKey) {
            redo();
          } else {
            undo();
          }
        } else if (event.key === "y" ) {
          redo();
        }
      }
    };

    document.addEventListener("keydown", undoRedoFunction);
    return () => {
      document.removeEventListener("keydown", undoRedoFunction);
    };
  }, [undo, redo]);

  useEffect(() => {
    const panOrZoomFunction = (event: WheelEvent) => {
      if (pressedKeys.has("Meta") || pressedKeys.has("Control")) {
        onZoom(event.deltaY * -0.01);
      } else {
        setPanOffset((prevState) => ({
          x: prevState.x - event.deltaX,
          y: prevState.y - event.deltaY,
        }));
      }
    };

    document.addEventListener("wheel", panOrZoomFunction);
    return () => {
      document.removeEventListener("wheel", panOrZoomFunction);
    };
  }, [pressedKeys]);

  useEffect(() => {
    const textArea = textAreaRef.current;
    if (action === "writing" && textArea && selectedElement) {
      setTimeout(() => {
        textArea.focus();
        textArea.value = selectedElement.text || "";
      }, 0);
    }
  }, [action, selectedElement]);

  const updateElement = (
    id: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    type: ToolsType,
    options?: { text: string;
      strokeColor?: string;
      fillColor?: string;
      strokeWidth?: number;
      opacity?: number;
      fontSize?: number;
     }
  ) => {
    const elementsCopy = [...elements];
    switch (type) {
      case Tools.line:
      case Tools.rectangle:
        case Tools.circle: {
        const existingElement = elementsCopy[id];
        elementsCopy[id] = createElement(id, x1, y1, x2, y2, type, {
          strokeColor: options?.strokeColor || existingElement?.strokeColor,
          fillColor: options?.fillColor || existingElement?.fillColor,
          strokeWidth: options?.strokeWidth || existingElement?.strokeWidth,
          opacity: options?.opacity || existingElement?.opacity,
        });
        break;
      }
      case Tools.pencil: {
        const existingPoints = elementsCopy[id].points || [];
        elementsCopy[id].points = [...existingPoints, { x: x2, y: y2 }];
        break;
      }
      case Tools.text: {
        const canvas = document.getElementById("canvas");
        if (!(canvas instanceof HTMLCanvasElement)) {
          throw new Error("Canvas element not found");
        }
        const context = canvas.getContext("2d");
        if (!context) {
          throw new Error("Could not get 2D context from canvas");
        }
        if (!options || !options.text) {
          throw new Error("No text options provided for text tool");
        }
        const fontSize = options.fontSize || elementsCopy[id]?.fontSize || 24;
        context.font = `${fontSize}px sans-serif`;
        const textWidth = context.measureText(options.text).width;
        const textHeight = fontSize;
        const existingElement = elementsCopy[id];
        elementsCopy[id] = {
          ...createElement(id, x1, y1, x1 + textWidth, y1 + textHeight, type, {
            strokeColor: options?.strokeColor || existingElement?.strokeColor,
            fillColor: options?.fillColor || existingElement?.fillColor,
            strokeWidth: options?.strokeWidth || existingElement?.strokeWidth,
            opacity: options?.opacity || existingElement?.opacity,
            fontSize: fontSize,
          }),
          text: options.text,
        };
        break;
      }
      default:
        throw new Error(`Type not recognised: ${type}`);
    }
    setElements(elementsCopy, true);
  };

  const getMouseCoordinates = (event: MouseEvent) => {
    const clientX =
      (event.clientX - panOffset.x * scale + scaleOffset.x) / scale;
    const clientY =
      (event.clientY - panOffset.y * scale + scaleOffset.y) / scale;
    return { clientX, clientY };
  };

  const handleMouseDown = (event: MouseEvent<HTMLCanvasElement>) => {
    if (action === "writing") return;

    const { clientX, clientY } = getMouseCoordinates(event);

    if (tool === Tools.pan || event.button === 1 || pressedKeys.has(" ")) {
      setAction("panning");
      setStartPanMousePosition({ x: clientX, y: clientY });
      document.body.style.cursor = "grabbing";
      return;
    }

    if (event.button === 1 || pressedKeys.has(" ")) {
      setAction("panning");
      setStartPanMousePosition({ x: clientX, y: clientY });
      document.body.style.cursor = "grabbing";
      return;
    }

    if (tool === Tools.selection) {
      const element = getElementAtPosition(clientX, clientY, elements);

      if (element) {
        let selectedElement: SelectedElementType = { ...element };

        if (element.type === "pencil" && element.points) {
          const xOffsets = element.points.map((point) => clientX - point.x);
          const yOffsets = element.points.map((point) => clientY - point.y);
          selectedElement = { ...selectedElement, xOffsets, yOffsets };
        } else {
          const offsetX = clientX - selectedElement.x1;
          const offsetY = clientY - selectedElement.y1;
          selectedElement = { ...selectedElement, offsetX, offsetY };
        }

        setSelectedElement(selectedElement);
        setShowProperties(true);
        setElements((prevState) => prevState);

        if (element.position === "inside") {
          setAction("moving");
        } else {
          setAction("resizing");
        }
      }
    } 
    else if (tool === Tools.eraser) {
      const element = getElementAtPosition(clientX, clientY, elements);
      if (element) {
        const newElements = elements.filter((el) => el.id !== element.id);
        setElements(newElements);
      }
    }
    else {
      const id = elements.length;
      const newElement = createElement(
        id,
        clientX,
        clientY,
        clientX,
        clientY,
        tool
      );
      setElements((prevState) => [...prevState, newElement]);
      setSelectedElement(newElement);
      setAction(tool === "text" ? "writing" : "drawing");
    }
  };

  const handleMouseMove = (event: MouseEvent<HTMLCanvasElement>) => {
    const { clientX, clientY } = getMouseCoordinates(event);

    if (action === "panning") {
      const deltaX = clientX - startPanMousePosition.x;
      const deltaY = clientY - startPanMousePosition.y;
      setPanOffset({
        x: panOffset.x + deltaX,
        y: panOffset.y + deltaY,
      });
      return;
    }

    if (tool === Tools.selection) {
      const element = getElementAtPosition(clientX, clientY, elements);

      if (element && element.position) {
        (event.target as HTMLElement).style.cursor = cursorForPosition(
          element.position
        );
      } else {
        (event.target as HTMLElement).style.cursor = "default";
      }
    }
    else if (tool === Tools.eraser) {
      (event.target as HTMLElement).style.cursor = "crosshair";
    }

    if (action === "drawing") {
      const index = elements.length - 1;
      const { x1, y1 } = elements[index];
      updateElement(index, x1, y1, clientX, clientY, tool);
    } else if (action === "moving" && selectedElement) {
      if (
        selectedElement.type === "pencil" &&
        "points" in selectedElement &&
        "xOffsets" in selectedElement &&
        "yOffsets" in selectedElement
      ) {
        const extendedElement = selectedElement as ExtendedElementType;
        const newPoints = extendedElement.points!.map((_, index) => ({
          x: clientX - extendedElement.xOffsets![index],
          y: clientY - extendedElement.yOffsets![index],
        }));
        const elementsCopy = [...elements];
        elementsCopy[extendedElement.id] = {
          ...elementsCopy[extendedElement.id],
          points: newPoints,
        };
        setElements(elementsCopy, true);
      } else {
        const { id, x1, x2, y1, y2, type, offsetX, offsetY } =
          selectedElement as ExtendedElementType;
        const safeOffsetX = offsetX ?? 0;
        const safeOffsetY = offsetY ?? 0;
        const newX1 = clientX - safeOffsetX;
        const newY1 = clientY - safeOffsetY;
        const newX2 = newX1 + (x2 - x1);
        const newY2 = newY1 + (y2 - y1);
        const options =
          type === "text" && selectedElement.text
            ? { text: selectedElement.text }
            : undefined;
        updateElement(id, newX1, newY1, newX2, newY2, type, options);
      }
    } else if (
      action === "resizing" &&
      selectedElement &&
      selectedElement.position
    ) {
      const { id, type, position, ...coordinates } =
        selectedElement as ExtendedElementType;

      if (typeof position === "string") {
        const { x1, y1, x2, y2 } = resizedCoordinates(
          clientX,
          clientY,
          position,
          coordinates
        );
        updateElement(id, x1, y1, x2, y2, type);
      }
    }
  };

  const handleMouseUp = (event: MouseEvent<HTMLCanvasElement>) => {
    const { clientX, clientY } = getMouseCoordinates(event);

    if (selectedElement) {
      const index = selectedElement.id;
      const { id, type } = elements[index];
      if (
        (action === "drawing" || action === "resizing") &&
        adjustmentRequired(type)
      ) {
        const { x1, y1, x2, y2 } = adjustElementCoordinates(elements[index]);
        updateElement(id, x1, y1, x2, y2, type);
      }

      const offsetX = selectedElement.offsetX || 0;
      const offsetY = selectedElement.offsetY || 0;

      if (
        selectedElement.type === "text" &&
        clientX - offsetX === selectedElement.x1 &&
        clientY - offsetY === selectedElement.y1 && 
        action !== "moving" && action !== "resizing"
      ) {
        setAction("writing");
        return;
      }
    }

    if (action === "writing") {
      return;
    }

    if (action === "panning") {
      document.body.style.cursor = "default";
    }

    setAction("none");

    if (action === "drawing") {
      setSelectedElement(null);
      setShowProperties(false);
    }    
  };

  const handleBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    if (selectedElement) {
      const { id, x1, y1, type } = selectedElement;

      const x2 = selectedElement.x2 || x1;
      const y2 = selectedElement.y2 || y1;

      setAction("none");
      setSelectedElement(null);
      updateElement(id, x1, y1, x2, y2, type, { text: event.target.value });
    } else {
      console.error("No element selected when handleBlur was called");
    }
  };

  const onZoom = (delta: number) => {
    setScale((prevState) => Math.min(Math.max(prevState + delta, 0.1), 20));
  };

  const handleUpdateElementProperties = (id: number, properties: Partial<ElementType>) => {
    const generator = rough.generator();
    const elementsCopy = [...elements];
    const element = elementsCopy[id];
    if (element) {
      // Update the element properties
      Object.assign(element, properties);
      
      // Recreate the rough element with new properties if needed
      if (element.type !== Tools.pencil && element.type !== Tools.text) {
        const roughOptions = {
          stroke: element.strokeColor,
          fill: element.fillColor === "transparent" ? undefined : element.fillColor,
          strokeWidth: element.strokeWidth,
        };

        switch (element.type) {
          case Tools.line:
            element.roughElement = generator.line(element.x1, element.y1, element.x2, element.y2, roughOptions);
            break;
          case Tools.rectangle:
            element.roughElement = generator.rectangle(element.x1, element.y1, element.x2 - element.x1, element.y2 - element.y1, roughOptions);
            break;
          case Tools.circle:
            const centerX = (element.x1 + element.x2) / 2;
            const centerY = (element.y1 + element.y2) / 2;
            const radius = Math.sqrt(Math.pow(element.x2 - element.x1, 2) + Math.pow(element.y2 - element.y1, 2)) / 2;
            element.roughElement = generator.circle(centerX, centerY, radius * 2, roughOptions);
            break;
        }
      }
      
      setElements(elementsCopy, true);
      setSelectedElement(element);
    }
  };

  const handleCloseProperties = () => {
    setShowProperties(false);
    setSelectedElement(null);
  };

  return (
    <div className="relative w-full h-screen bg-gray-50 overflow-hidden">
      
      <ActionBar tool={tool} setTool={setTool} />
      <ControlPanel
        undo={undo}
        redo={redo}
        onZoom={onZoom}
        scale={scale}
        setScale={setScale}
      />
      {showProperties && selectedElement && (
        <Panel
          selectedElement={selectedElement}
          onUpdateElement={handleUpdateElementProperties}
          onClose={handleCloseProperties}
        />
      )}
      {action === "writing" ? (
        <textarea
          ref={textAreaRef}
          onBlur={handleBlur}
          className="absolute border-pink-400  bg-white  resize-none outline-none z-50"
          style={{
            top: selectedElement
              ? (selectedElement.y1 - 2) * scale +
                panOffset.y * scale -
                scaleOffset.y
              : 0,
            left: selectedElement
              ? selectedElement.x1 * scale + panOffset.x * scale - scaleOffset.x
              : 0,
            font: `${24 * scale}px sans-serif`,
          }}
        />
      ) : null}
      <canvas
        id="canvas"
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="absolute z-10 cursor-crosshair bg-white border border-gray-200 shadow-inner"
      />
    </div>
  );
}
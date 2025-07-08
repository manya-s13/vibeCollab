export type SelectedElementType = ElementType & {
    xOffsets?: number[];
    yOffsets?: number[];
    offsetX?: number;
    offsetY?: number;
  };
  
  export interface ExtendedElementType extends ElementType {
    xOffsets?: number[];
    yOffsets?: number[];
  }
  
  export type ElementType = {
    id: number;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    type: ToolsType;
   
    roughElement?: any;
    offsetX?: number;
    offsetY?: number;
    position?: string | null;
    points?: { x: number; y: number }[];
    text?: string;
  };
  
  export type ActionsType =
    | "writing"
    | "drawing"
    | "moving"
    | "panning"
    | "resizing"
    | "none";
  
  export const Tools = {
    pan: "pan",
    selection: "selection",
    rectangle: "rectangle",
    line: "line",
    pencil: "pencil",
    text: "text",
    circle: "circle",
    erase: "erase"
  };
  
  export type ToolsType = (typeof Tools)[keyof typeof Tools];
  
  export type PointType = { x: number; y: number };
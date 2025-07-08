import { type ToolsType } from "../../types";

export const adjustmentRequired = (type: ToolsType) =>
  ["line", "rectangle", "circle"].includes(type);
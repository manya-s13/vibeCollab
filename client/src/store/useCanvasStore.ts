// store/useCanvasStore.ts
import { create } from 'zustand';

interface CanvasState {
  history: string[];
  redoStack: string[];
  fabricCanvas: fabric.Canvas | null;
  isRestoring: boolean;

  setCanvas: (canvas: fabric.Canvas) => void;
  setIsRestoring: (flag: boolean) => void;

  addHistory: (json?: string) => void;
  undo: () => Promise<void>;
  redo: () => Promise<void>;
  clearRedo: () => void;
}

const loadCanvasJSON = (canvas: fabric.Canvas, json: string): Promise<void> => {
  return new Promise((resolve) => {
    canvas.loadFromJSON(json, () => {
      canvas.renderAll();
      resolve();
    });
  });
};

export const useCanvasStore = create<CanvasState>((set, get) => ({
  history: [],
  redoStack: [],
  fabricCanvas: null,
  isRestoring: false,

  setCanvas: (canvas) => set({ fabricCanvas: canvas }),
  setIsRestoring: (flag) => set({ isRestoring: flag }),

  addHistory: (json) => {
    const { fabricCanvas, history, isRestoring } = get();
    if (!fabricCanvas || isRestoring) return;

    const snapshot = json || JSON.stringify(fabricCanvas.toJSON());
    if (history.length === 0 || history[history.length - 1] !== snapshot) {
      set((state) => ({
        history: [...state.history, snapshot],
        redoStack: [],
      }));
    }
  },

  undo: async () => {
    const { history, redoStack, fabricCanvas, setIsRestoring } = get();
    if (fabricCanvas && history.length > 1) {
      const newHistory = [...history];
      const last = newHistory.pop()!;
      const previous = newHistory[newHistory.length - 1];

      setIsRestoring(true);
      set({ history: newHistory, redoStack: [...redoStack, last] });

      await loadCanvasJSON(fabricCanvas, previous);
      setIsRestoring(false);
    }
  },

  redo: async () => {
    const { redoStack, history, fabricCanvas, setIsRestoring } = get();
    if (fabricCanvas && redoStack.length > 0) {
      const last = redoStack[redoStack.length - 1];

      setIsRestoring(true);
      set({
        redoStack: redoStack.slice(0, -1),
        history: [...history, last],
      });

      await loadCanvasJSON(fabricCanvas, last);
      setIsRestoring(false);
    }
  },

  clearRedo: () => set({ redoStack: [] }),
}));

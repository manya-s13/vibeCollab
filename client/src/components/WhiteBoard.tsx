import React, { useEffect, useRef, useState } from 'react';
import { Canvas, Rect, Ellipse, Line } from 'fabric';
import { Pencil } from 'lucide-react';

const TOOL_PENCIL = 'pencil';
const TOOL_RECT = 'rect';
const TOOL_ELLIPSE = 'ellipse';
const TOOL_LINE = 'line';

type Tool = typeof TOOL_PENCIL | typeof TOOL_RECT | typeof TOOL_ELLIPSE | typeof TOOL_LINE;

const WhiteBoard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricCanvasRef = useRef<Canvas | null>(null);
  const [tool, setTool] = useState<Tool>(TOOL_PENCIL);
  const [drawingObject, setDrawingObject] = useState<any>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const origXRef = useRef(0);
  const origYRef = useRef(0);

  useEffect(() => {
    if (!canvasRef.current) return;
    const fabricCanvas = new Canvas(canvasRef.current, {
      isDrawingMode: tool === TOOL_PENCIL,
      selection: true,
    });
    fabricCanvas.setHeight(800);
    fabricCanvas.setWidth(1300);
    fabricCanvasRef.current = fabricCanvas;

    // Clean up on unmount
    return () => {
      fabricCanvas.dispose();
    };
  }, []);

  // Update drawing mode when tool changes
  useEffect(() => {
    const fabricCanvas = fabricCanvasRef.current;
    if (!fabricCanvas) return;
    fabricCanvas.isDrawingMode = tool === TOOL_PENCIL;
    if (tool === TOOL_PENCIL) {
      if (fabricCanvas.freeDrawingBrush) {
        fabricCanvas.freeDrawingBrush.width = 2;
        fabricCanvas.freeDrawingBrush.color = '#FFC0CB';
      }
    }
  }, [tool]);

  // Handle shape drawing
  useEffect(() => {
    const fabricCanvas = fabricCanvasRef.current;
    if (!fabricCanvas) return;

    let tempObj: any = null;

    const onMouseDown = (opt: any) => {
      if (tool === TOOL_PENCIL) return;
      setIsDrawing(true);
      const pointer = fabricCanvas.getPointer(opt.e);
      origXRef.current = pointer.x;
      origYRef.current = pointer.y;
      if (tool === TOOL_RECT) {
        tempObj = new Rect({
          left: origXRef.current,
          top: origYRef.current,
          width: 0,
          height: 0,
          fill: 'rgba(0,0,0,0.05)',
          stroke: '#222',
          strokeWidth: 2,
        });
      } else if (tool === TOOL_ELLIPSE) {
        tempObj = new Ellipse({
          left: origXRef.current,
          top: origYRef.current,
          rx: 0,
          ry: 0,
          fill: 'rgba(0,0,0,0.05)',
          stroke: '#222',
          strokeWidth: 2,
          originX: 'left',
          originY: 'top',
        });
      } else if (tool === TOOL_LINE) {
        tempObj = new Line([
          origXRef.current,
          origYRef.current,
          origXRef.current,
          origYRef.current,
        ], {
          stroke: '#222',
          strokeWidth: 2,
        });
      }
      if (tempObj) {
        fabricCanvas.add(tempObj);
        setDrawingObject(tempObj);
      }
    };

    const onMouseMove = (opt: any) => {
      if (!isDrawing || !drawingObject) return;
      const pointer = fabricCanvas.getPointer(opt.e);
      if (tool === TOOL_RECT) {
        drawingObject.set({
          width: Math.abs(pointer.x - origXRef.current),
          height: Math.abs(pointer.y - origYRef.current),
          left: pointer.x < origXRef.current ? pointer.x : origXRef.current,
          top: pointer.y < origYRef.current ? pointer.y : origYRef.current,
        });
      } else if (tool === TOOL_ELLIPSE) {
        drawingObject.set({
          rx: Math.abs(pointer.x - origXRef.current) / 2,
          ry: Math.abs(pointer.y - origYRef.current) / 2,
          left: pointer.x < origXRef.current ? pointer.x : origXRef.current,
          top: pointer.y < origYRef.current ? pointer.y : origYRef.current,
        });
      } else if (tool === TOOL_LINE) {
        drawingObject.set({
          x1: origXRef.current,
          y1: origYRef.current,
          x2: pointer.x,
          y2: pointer.y,
        });
      }
      fabricCanvas.requestRenderAll();
    };

    const onMouseUp = () => {
      setIsDrawing(false);
      setDrawingObject(null);
    };

    if (tool !== TOOL_PENCIL) {
      fabricCanvas.on('mouse:down', onMouseDown);
      fabricCanvas.on('mouse:move', onMouseMove);
      fabricCanvas.on('mouse:up', onMouseUp);
    }
    return () => {
      fabricCanvas.off('mouse:down', onMouseDown);
      fabricCanvas.off('mouse:move', onMouseMove);
      fabricCanvas.off('mouse:up', onMouseUp);
    };
    // eslint-disable-next-line
  }, [tool, isDrawing, drawingObject]);

  return (
    <div className='w-full h-full flex flex-col items-center justify-center'>
      <div className='flex gap-6 items-center justify-center bg-gray-100 p-2 rounded-md shadow-md z-10'>
        <button onClick={() => setTool(TOOL_PENCIL)} style={{ fontWeight: tool === TOOL_PENCIL ? 'bold' : 'normal' }}><Pencil /></button>
        <button onClick={() => setTool(TOOL_RECT)} style={{ fontWeight: tool === TOOL_RECT ? 'bold' : 'normal' }}>Rectangle</button>
        <button onClick={() => setTool(TOOL_ELLIPSE)} style={{ fontWeight: tool === TOOL_ELLIPSE ? 'bold' : 'normal' }}>Ellipse</button>
        <button onClick={() => setTool(TOOL_LINE)} style={{ fontWeight: tool === TOOL_LINE ? 'bold' : 'normal' }}>Line</button>
      </div>
      <canvas ref={canvasRef} style={{ border: '1px solid #ccc', width: '100%', height: '100%' }} />
    </div>
  );
};

export default WhiteBoard;

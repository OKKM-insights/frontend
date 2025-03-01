"use client"; // Required if using Next.js app router with interactivity

import React, { useRef, useEffect, useState, useCallback } from "react";
import  fabric, { Canvas, FabricImage, FabricObject, FabricObjectProps, filters, ObjectEvents, Rect, SerializedObjectProps}  from "fabric";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Check, Contrast, EyeOff, SkipForward, Sun, ZoomIn, ZoomOut } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const labels = ["Person", "Car", "Tree", "Animal", "Building"];
const labelColors: Record<string, string> = {
  Person: "rgba(255, 0, 0, 0.3)", // Red
  Car: "rgba(0, 255, 0, 0.3)", // Green
  Tree: "rgba(0, 0, 255, 0.3)", // Blue
  Animal: "rgba(255, 165, 0, 0.3)", // Orange
  Building: "rgba(128, 0, 128, 0.3)", // Purple
};

type BoundingBox = {
    x: number;
    y: number;
    w: number;
    h: number;
    label: string;
  };
  
type PhotoLabelingToolProps = {
    imageUrl: string;
    onSubmit: (boundingBoxes: BoundingBox[]) => void;
    onSkip: () => void;
};

export default function PhotoLabelingTool({ imageUrl, onSubmit, onSkip }: PhotoLabelingToolProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [zoom, setZoom] = useState(1);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [selectedLabel, setSelectedLabel] = useState("");
  const boundingBoxesRef = useRef<BoundingBox[]>([]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new Canvas(canvasRef.current, {
      selection: false,
    });
  
    fabricCanvas.setWidth(600);
    fabricCanvas.setHeight(400);
    setCanvas(fabricCanvas);
    const loadImage = async () => {
      try {
        const img = await FabricImage.fromURL(imageUrl, { crossOrigin: "anonymous" });
  
        img.set({
          selectable: false,
          evented: false,
          scaleX: fabricCanvas.width! / img.width!,
          scaleY: fabricCanvas.height! / img.height!,
        });
  
        fabricCanvas.backgroundImage = img;
        fabricCanvas.requestRenderAll();
      } catch (error) {
        console.error("Error loading image:", error);
      }
    };
  
    loadImage();
  
    return () => {
      fabricCanvas.dispose();
    };
  }, [imageUrl]);

useEffect(() => {
  if (!canvas) return;

  let isDrawing = false;
  let isEditing = false;
  let rect: Rect | null = null;
  let startX = 0;
  let startY = 0;

  const handleMouseDown = (event: { e: fabric.TPointerEvent; }) => {
    if (!selectedLabel) return;
    const pointer = canvas.getPointer(event.e);
    const objects = canvas.getObjects();

    const clickedObject = objects.find(obj => {
      if (obj instanceof Rect) {
        const { left, top, width = 0, height = 0 } = obj;
        return (
          pointer.x >= left! &&
          pointer.x <= left! + width &&
          pointer.y >= top! &&
          pointer.y <= top! + height
        );
      }
      return false;
    });

    if (clickedObject && clickedObject instanceof Rect) {
      canvas.setActiveObject(clickedObject);
      clickedObject.set({
        borderColor: labelColors[selectedLabel] || "rgba(0,0,255,0.3)",
        cornerColor: labelColors[selectedLabel] || "rgba(0,0,255,0.3)",
        cornerSize: 10,
      });
      canvas.requestRenderAll();
      isEditing = true;
      return;
    }

    if (!isEditing) {
      isDrawing = true;
      startX = pointer.x;
      startY = pointer.y;

      rect = new Rect({
        left: startX,
        top: startY,
        width: 1,
        height: 1,
        fill: labelColors[selectedLabel] || "rgba(0,0,255,0.3)",
        stroke: (labelColors[selectedLabel] || "rgba(0,0,255,0.3)").replace("0.3", "1"),
        strokeWidth: 0,
        selectable: false,
        hasControls: false
      });

      canvas.add(rect);
    }
  };

  const handleMouseMove = (event: { e: fabric.TPointerEvent; }) => {
    if (!isDrawing || !rect || isEditing) return;
    const pointer = canvas.getPointer(event.e);
    const width = pointer.x - startX;
    const height = pointer.y - startY;

    rect.set({ width: Math.abs(width), height: Math.abs(height) });

    if (width < 0) rect.set({ left: pointer.x });
    if (height < 0) rect.set({ top: pointer.y });

    canvas.requestRenderAll();
  };

  const handleMouseUp = () => {
    console.log(boundingBoxesRef.current)
    if (!rect || !isDrawing || isEditing) return;

    const coords = rect.getCoords();
    const width = rect.width ?? 0;
    const height = rect.height ?? 0;

    if (!coords || width < 5 || height < 5 || width > canvas.width! || height > canvas.height!) {
      canvas.remove(rect);
      canvas.requestRenderAll();
      isDrawing = false;
      rect = null;
      return;
    }

    rect.set({
      selectable: true,
      hasControls: true,
      cornerSize: 10,
    });

    const [tl] = coords;
    const newBox: BoundingBox = {
      x: tl.x ?? 0,
      y: tl.y ?? 0,
      w: width,
      h: height,
      label: selectedLabel,
    };

    boundingBoxesRef.current = [...boundingBoxesRef.current, newBox];

    isDrawing = false;
    rect = null;
  };

  const handleSelectionCreated = (event: { selected: fabric.Rect<Partial<fabric.RectProps>, fabric.SerializedRectProps, fabric.ObjectEvents>[]; }) => {
    const selectedRect = event.selected?.[0] as Rect;
    if (!selectedRect) return;

    selectedRect.set({
      originalLeft: selectedRect.left,
      originalTop: selectedRect.top,
      originalWidth: selectedRect.width,
      originalHeight: selectedRect.height,
    });

    canvas.requestRenderAll();
  };

  const handleObjectMoving = (event : { target: FabricObject<Partial<FabricObjectProps>, SerializedObjectProps, ObjectEvents>; }) => {
    const movingRect = event.target as Rect;
    if (!movingRect) return;

    const canvasWidth = canvas.width!;
    const canvasHeight = canvas.height!;

    const width = movingRect.width! * movingRect.scaleX!;
    const height = movingRect.height! * movingRect.scaleY!;

    // Ensure the rectangle stays within bounds
    if (movingRect.left! < 0) movingRect.left = 0;
    if (movingRect.top! < 0) movingRect.top = 0;
    if (movingRect.left! + width > canvasWidth) movingRect.left = canvasWidth - width;
    if (movingRect.top! + height > canvasHeight) movingRect.top = canvasHeight - height;
  };

  const handleObjectModified = (event: { target: fabric.Rect<Partial<fabric.RectProps>, fabric.SerializedRectProps, fabric.ObjectEvents>; }) => {
    const modifiedRect = event.target as Rect;
    if (!modifiedRect) return;

    const actualWidth = (modifiedRect.width ?? 0) * modifiedRect.scaleX;
    const actualHeight = (modifiedRect.height ?? 0) * modifiedRect.scaleY;

    boundingBoxesRef.current = boundingBoxesRef.current.map((box) => {
      const isSameBox =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Math.abs(box.x - (modifiedRect as any).originalLeft) < 5 &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Math.abs(box.y - (modifiedRect as any).originalTop) < 5 &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Math.abs(box.w - (modifiedRect as any).originalWidth) < 5 &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Math.abs(box.h - (modifiedRect as any).originalHeight) < 5;

      return isSameBox
        ? {
            ...box,
            x: modifiedRect.left,
            y: modifiedRect.top,
            w: actualWidth,
            h: actualHeight,
          }
        : box;
    });

    modifiedRect.set({
      originalLeft: modifiedRect.left,
      originalTop: modifiedRect.top,
      originalWidth: actualWidth,
      originalHeight: actualHeight,
    });

    canvas.requestRenderAll();
  };

  const handleSelectionCleared = () => {
    isEditing = false;
  };

  canvas.on("mouse:down", handleMouseDown);
  canvas.on("mouse:move", handleMouseMove);
  canvas.on("mouse:up", handleMouseUp);
  canvas.on("selection:created", handleSelectionCreated);
  canvas.on("object:moving", handleObjectMoving);
  canvas.on("object:modified", handleObjectModified);
  canvas.on("selection:cleared", handleSelectionCleared);

  return () => {
    canvas.off("mouse:down", handleMouseDown);
    canvas.off("mouse:move", handleMouseMove);
    canvas.off("mouse:up", handleMouseUp);
    canvas.off("selection:created", handleSelectionCreated);
    canvas.off("object:moving", handleObjectMoving);
    canvas.off("object:modified", handleObjectModified);
    canvas.off("selection:cleared", handleSelectionCleared);
  };
}, [canvas, selectedLabel]); // Keep canvas in dependencies


  const handleZoom = (value: number) => {
    if (!canvas) return;
    setZoom(value);
    canvas.setZoom(value);
  };
  
  const handleBrightnessContrast = () => {
    if (!canvas || !(canvas.backgroundImage instanceof FabricImage)) return;
  
    const bgImage = canvas.backgroundImage as FabricImage;
  
    const filter = new filters.Brightness({
      brightness: (brightness - 100) / 100,
    });
  
    const filter2 = new filters.Contrast({
      contrast: (contrast - 100) / 100,
    });
  
    bgImage.filters = [filter, filter2];
    bgImage.applyFilters();
    canvas.renderAll();
  };

  useEffect(() => handleBrightnessContrast(), [brightness, contrast]);

  const handleLabelSelect = useCallback((label: string) => {
    setSelectedLabel((prev) => (prev === label ? prev : label));
  }, []);
  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto bg-background rounded-lg shadow-sm border">
      <div className="space-y-2 text-center">
        <h2 className="text-lg font-medium">Label Selection</h2>
        <div className="flex flex-wrap gap-2 justify-center">
        {labels.map((label, index) => {
            const color = labelColors[label]
            const isSelected = selectedLabel === label

            return (
              <Button
                key={`${label}-${index}`}
                variant="outline"
                onClick={() => handleLabelSelect(label)}
                className={cn(
                  "flex items-center gap-1 border-2 transition-colors font-medium",
                  "hover:text-foreground",
                  isSelected ? "border-foreground" : "border-transparent",
                )}
                style={{
                  backgroundColor: color,
                  // Make the background more opaque when selected
                  ...(isSelected && {
                    backgroundColor: color.replace("0.3", "0.5"),
                  }),
                }}
              >
                {label}
              </Button>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TooltipProvider>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-1">
                <ZoomIn className="w-4 h-4" /> Zoom
              </label>
              <span className="text-sm text-muted-foreground">{zoom.toFixed(1)}x</span>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2">
                  <ZoomOut className="w-4 h-4 text-muted-foreground" />
                  <Slider value={[zoom]} min={1} max={3} step={0.1} onValueChange={(val) => handleZoom(val[0])} />
                  <ZoomIn className="w-4 h-4 text-muted-foreground" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Adjust zoom level</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-1">
                <Sun className="w-4 h-4" /> Brightness
              </label>
              <span className="text-sm text-muted-foreground">{brightness}%</span>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Slider value={[brightness]} min={50} max={150} onValueChange={(val) => setBrightness(val[0])} />
              </TooltipTrigger>
              <TooltipContent>
                <p>Adjust image brightness</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-1">
                <Contrast className="w-4 h-4" /> Contrast
              </label>
              <span className="text-sm text-muted-foreground">{contrast}%</span>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Slider value={[contrast]} min={50} max={150} onValueChange={(val) => setContrast(val[0])} />
              </TooltipTrigger>
              <TooltipContent>
                <p>Adjust image contrast</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>

      <div className="flex justify-center">
        <div className="inline-block border border-muted overflow-hidden bg-muted/20">
          <canvas
            ref={canvasRef}
            className="h-[400px] object-contain"
            style={{
              filter: `brightness(${brightness}%) contrast(${contrast}%)`,
            }}
          />
        </div>
      </div>

      <div className="flex justify-center gap-3">
        <Button variant="outline" onClick={() => onSubmit([])} className="flex items-center gap-2">
          <EyeOff className="w-4 h-4" />
          Nothing to Label
        </Button>

        <Button
          onClick={() => onSubmit(boundingBoxesRef.current)}
          className="flex items-center gap-2"
          disabled={!boundingBoxesRef.current.length}
        >
          <Check className="w-4 h-4" />
          Submit Labels
        </Button>

        <Button variant="secondary" onClick={onSkip} className="flex items-center gap-2">
          <SkipForward className="w-4 h-4" />
          Skip Image
        </Button>
      </div>
    </div>
  );
}

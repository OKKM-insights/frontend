"use client"; // Required if using Next.js app router with interactivity

import React, { useRef, useEffect, useState, useCallback } from "react";
import  fabric, { Canvas, FabricImage, FabricObject, FabricObjectProps, filters, ObjectEvents, Point, Rect, SerializedObjectProps}  from "fabric";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Check, Contrast, EyeOff, Hand, Move, RotateCcw, SkipForward, Sun, Trash2, Undo2, ZoomIn, ZoomOut } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { BoundingBox, Image } from "@/types";

type PhotoLabelingToolProps = {
    labels: string[];
    image: Image;
    onSubmit: (labels : BoundingBox[], image: Image, skip : boolean, nothing : boolean) => void;
};

const base64ToBlobUrl = (base64: string) => {
  const byteCharacters = atob(base64.split(",")[1]);
  const byteArrays = [];
  for (let i = 0; i < byteCharacters.length; i++) {
    byteArrays.push(byteCharacters.charCodeAt(i));
  }
  const blob = new Blob([new Uint8Array(byteArrays)], { type: "image/png" });
  return URL.createObjectURL(blob);
};

export default function PhotoLabelingTool({ labels, image, onSubmit }: PhotoLabelingToolProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [zoom, setZoom] = useState(1);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [selectedLabel, setSelectedLabel] = useState(labels[0]);
  const boundingBoxesRef = useRef<BoundingBox[]>([]);
  const [isPanning, setIsPanning] = useState(false);
  const isDragging = useRef(false);
  const lastPosX = useRef(0);
  const lastPosY = useRef(0);
  
  const generateLabelColors = (labels: string[]): Record<string, string> => {
    return labels.reduce((acc, label, index) => {
      const hue = ((index * 360) / labels.length + 240) % 360;
      acc[label] = `hsla(${hue}, 80%, 65%, 0.3)`;
      return acc;
    }, {} as Record<string, string>);
  };
  const labelColors = generateLabelColors(labels);

  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new Canvas(canvasRef.current, {
      selection: false,
    });
  
    setCanvas(fabricCanvas);
    const loadImage = async () => {
      try {
        const blobUrl = base64ToBlobUrl(`data:image/png;base64,${image.image}`);
        const img = await FabricImage.fromURL(blobUrl);

        fabricCanvas.setWidth(img.width!);
        fabricCanvas.setHeight(img.height!);
  
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
  }, [image]);

useEffect(() => {
  if (!canvas) return;

  let isDrawing = false;
  let isEditing = false;
  let rect: Rect | null = null;
  let startX = 0;
  let startY = 0;

  const handleMouseDown = (event: { e: fabric.TPointerEvent; }) => {
    if (isPanning){
      isDragging.current = true;
      const { x, y } = canvas.getPointer(event.e);
      lastPosX.current = x;
      lastPosY.current = y;

      canvas.setCursor("grab");
    } else {
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
    }
  };

  const handleMouseMove = (event: { e: fabric.TPointerEvent; }) => {
    if (isDragging.current && isPanning) {
      const pointer = canvas.getPointer(event.e);
      const dx = pointer.x - lastPosX.current;
      const dy = pointer.y - lastPosY.current;

      const zoom = canvas.getZoom();
      const scaleFactor = zoom > 1.6 ? 1.5 : 0.8;
    
      canvas.relativePan(new Point(dx*scaleFactor, dy*scaleFactor));
    
      lastPosX.current = pointer.x;
      lastPosY.current = pointer.y;
    } else {
      if (!isDrawing || !rect || isEditing || isPanning || isDragging.current) return;
      const pointer = canvas.getPointer(event.e);
      const newWidth = pointer.x - startX;
      const newHeight = pointer.y - startY;
      rect.set({
        left: newWidth < 0 ? pointer.x : startX,
        top: newHeight < 0 ? pointer.y : startY,
        width: Math.abs(newWidth),
        height: Math.abs(newHeight),
      });

      canvas.requestRenderAll();
    }
  };

  const handleMouseUp = () => {
    if (isDragging.current) {
      isDragging.current = false;
      canvas.setCursor("default");
    } else {
      if (!rect || !isDrawing || isEditing) return;

      const coords = rect.getCoords();
      const width = rect.width ?? 0;
      const height = rect.height ?? 0;

      if (!coords || width < 5 || height < 5) {
        canvas.remove(rect);
        canvas.requestRenderAll();
        isDrawing = false;
        rect = null;
        return;
      }

      const left = rect.left;
      const top = rect.top;
      const right = left + width;
      const bottom = top + height;

      if (left < 0 || top < 0 || right > canvas.width! || bottom > canvas.height!) {
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

      const newBox: BoundingBox = {
        tlx: left ?? 0,
        tly: top ?? 0,
        brx: left + width,
        bry: top + height,
        w: width,
        h: height,
        label: selectedLabel,
      };

      boundingBoxesRef.current = [...boundingBoxesRef.current, newBox];

      isDrawing = false;
      rect = null;
    }
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
        Math.abs(box.tlx - (modifiedRect as any).originalLeft) < 5 &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Math.abs(box.tly - (modifiedRect as any).originalTop) < 5 &&
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
}, [canvas, selectedLabel, isPanning]); // Keep canvas in dependencies


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

  const handleReset = () => {
    if (!canvas) return;
  
    // Clear all objects from the canvas
    canvas.getObjects().forEach((obj) => {
      if (obj !== canvas.backgroundImage) {
        canvas.remove(obj);
      }
    });
  
    // Clear the bounding box references
    boundingBoxesRef.current = [];
  
    // Redraw the canvas
    canvas.requestRenderAll();
  };

  const handleUndo = () => {
    if (!canvas || boundingBoxesRef.current.length === 0) return;
  
    // Remove the last bounding box from the ref array
    const lastBox = boundingBoxesRef.current.pop();
  
    // Find and remove the corresponding Fabric.js object from the canvas
    const objects = canvas.getObjects();
    const lastRect = objects.find(obj =>
      obj instanceof Rect &&
      obj.left === lastBox?.tlx &&
      obj.top === lastBox?.tly &&
      obj.width === lastBox?.w &&
      obj.height === lastBox?.h
    );
  
    if (lastRect) {
      canvas.remove(lastRect);
      canvas.requestRenderAll();
    }
  };

  const resetCanvas = () => {
    if (!canvas) return;
    setZoom(1);
    setContrast(100);
    setBrightness(100);
    setIsPanning(false);
    
    canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
  
    const img = canvas.backgroundImage;
    if (img) {
      canvas.centerObject(img);
      img.setCoords();
    }
  
    canvas.requestRenderAll();
  };

  const skipImage = () => {
    onSubmit([], image, true, false);
    boundingBoxesRef.current = [];
    resetCanvas();
  }

  const nothingToLabel = () => {
    onSubmit([], image, false, true);
    boundingBoxesRef.current = [];
    resetCanvas();
  }

  const submitLabels = () => {
    onSubmit(boundingBoxesRef.current, image, false, false);
    boundingBoxesRef.current = [];
    resetCanvas();
  }

   // Keyboard shortcuts handler
   useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return // Prevent interfering with input fields
      }
  
      e.preventDefault()
      const key = e.key.toLowerCase()
  
      const actions: Record<string, () => void> = {
        "-": () => handleZoom(Math.max(1, zoom - 0.1)),
        "_": () => handleZoom(Math.max(1, zoom - 0.1)),
        "=": () => handleZoom(Math.min(3, zoom + 0.1)),
        "+": () => handleZoom(Math.min(3, zoom + 0.1)),
        "m": () => setIsPanning((prev) => !prev),
        "r": resetCanvas,
        "z": () => (e.ctrlKey || e.metaKey) && handleUndo(),
        "delete": handleReset,
        "backspace": handleReset,
        "n": () => nothingToLabel(),
        "enter": ()=> submitLabels(),
        "s": () => skipImage(),
      }
  
      if (actions[key]) {
        actions[key]()
        return
      }
  
      // Handle number shortcuts for labels
      if (key >= "1" && key <= "9") {
        const labelIndex = Number.parseInt(key) - 1
        if (labelIndex < labels.length) handleLabelSelect(labels[labelIndex])
      }
    }
  
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleLabelSelect, handleReset, handleUndo, handleZoom, onSubmit, resetCanvas, zoom])

  return (
    <TooltipProvider>
      <div className="p-6 space-y-6 max-w-3xl mx-auto bg-background rounded-lg shadow-sm border">
        <div className="space-y-2 text-center">
          <h2 className="text-xl font-bold">Label the Following Image</h2>
          <div className="flex flex-wrap gap-2 justify-center label-options">
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
                    ...(isSelected && {
                      backgroundColor: color.replace("0.3", "0.5"),
                    }),
                  }}
                >
                  {label}
                  <span className="text-xs opacity-50">({index + 1})</span>
                </Button>
              )
            })}
          </div>
        </div>

        <div className="flex justify-center labeling-toolbar">
            <div className="rounded-lg border bg-card p-2 inline-block w-full sm:w-auto">
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-2">
                    {/* Canvas Controls */}
                    <div className="flex items-center gap-1 zoom-controls">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" onClick={() => handleZoom(Math.max(1, zoom - 0.1))}>
                        <ZoomOut className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Zoom Out (Press -)</TooltipContent>
                  </Tooltip>

                  <span className="w-10 text-center text-sm">{zoom.toFixed(1)}x</span>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" onClick={() => handleZoom(Math.min(3, zoom + 0.1))}>
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Zoom In (Press +)</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={isPanning ? "default" : "outline"}
                        size="icon"
                        onClick={() => setIsPanning((prev) => !prev)}
                      >
                        {isPanning ? <Hand className="h-4 w-4" /> : <Move className="h-4 w-4" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{isPanning ? "Disable Move Mode" : "Enable Move Mode"} (Press M)</TooltipContent>
                  </Tooltip>
                </div>

                {/* <Separator orientation="vertical" className="h-6 mx-1" /> */}
                <Separator orientation="vertical" className="hidden sm:block h-6 mx-1" />

                {/* Image Adjustments */}
                <div className="flex items-center gap-3 adjust-tools">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1">
                        <Sun className="h-4 w-4" />
                        <Slider
                          value={[brightness]}
                          min={50}
                          max={150}
                          onValueChange={(val) => setBrightness(val[0])}
                          className="w-20"
                        />
                        <span className="w-8 text-center text-sm">{brightness}%</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>Adjust Image Brightness</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1">
                        <Contrast className="h-4 w-4" />
                        <Slider
                          value={[contrast]}
                          min={50}
                          max={150}
                          onValueChange={(val) => setContrast(val[0])}
                          className="w-20"
                        />
                        <span className="w-8 text-center text-sm">{contrast}%</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>Adjust Image Contrast</TooltipContent>
                  </Tooltip>
                </div>

                {/* <Separator orientation="vertical" className="h-6 mx-1" /> */}
                <Separator orientation="vertical" className="hidden sm:block h-6 mx-1" />

                {/* View/Tool Controls */}
                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="reset-view" onClick={resetCanvas}>
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Reset View - Zoom, Brightness, Contrast (Press R)</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="undo-label" onClick={handleUndo}>
                        <Undo2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Undo Last Label (Ctrl+Z)</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="reset-labels" onClick={handleReset}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Clear All Labels (Delete)</TooltipContent>
                  </Tooltip>
                </div>
            </div>
          </div>
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

        {/* <div className="flex justify-center gap-3"> */}
        <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" onClick={() => nothingToLabel()} className="flex items-center gap-2 no-labels">
                  <EyeOff className="w-4 h-4" />
                  Nothing to Label
                </Button>
              </TooltipTrigger>
              <TooltipContent>Submit with no labels (Press N)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={() => submitLabels()} className="flex items-center gap-2 submit-labels">
                  <Check className="w-4 h-4" />
                  Submit Labels
                </Button>
              </TooltipTrigger>
              <TooltipContent>Submit current labels (Press Enter)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary" onClick={() => skipImage()} className="flex items-center gap-2 skip-image">
                  <SkipForward className="w-4 h-4" />
                  Skip Image
                </Button>
              </TooltipTrigger>
              <TooltipContent>Skip this image (Press S)</TooltipContent>
            </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}

import React, { useState } from 'react';
import Canvas, { DrawFunction } from './Canvas';
import {
  extractTargetSize,
  extractCoordinates,
  MouseEventListener,
} from './lib/eventhelpers';
import {
  ImagePair,
  averageInverseColor,
  inverseColor,
  colorToCSS,
} from './lib/imgkit';
import { isLowerRight } from './lib/geometry';

/*
 * Draw a hatched rectangle on the canvas (using (x,y) as the top left corner).
 * And the provided width / height.
 *
 */
const drawHatchedSquare = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  backgroundColor: string,
  lineColor: string
) => {
  const lineCountPerTriangle = 10; // we will have 2*lineCountPerTriangle+1 lines in total
  const strokeWidth = Math.min(1, size / 21 / 4);

  context.fillStyle = backgroundColor;
  context.fillRect(x, y, size, size);

  context.lineWidth = strokeWidth;
  context.strokeStyle = lineColor;

  const chunkSize = size / lineCountPerTriangle;

  for (let i = 0; i < lineCountPerTriangle; i += 1) {
    // Upper triangle
    context.moveTo(x, y + i * chunkSize);
    context.lineTo(x + i * chunkSize, y);

    // Lower triangle
    context.moveTo(x + size, y + i * chunkSize);
    context.lineTo(x + i * chunkSize, y + size);
  }

  context.moveTo(x, y + size);
  context.lineTo(x + size, y);
  context.stroke();
};

interface ZoomableCanvasProps {
  /** The callback to call whenever we want to draw stuff on the canvas */
  draw: DrawFunction;

  /** The image being drawn */
  image: ImagePair;

  /** Optional callback for watching mouse move events */
  onMove: MouseEventListener;

  onMouseDown: MouseEventListener;
  onTouchStart: MouseEventListener;
  onMouseUp: MouseEventListener;
  onTouchEnd: MouseEventListener;

  style: React.CSSProperties;

  height: number;
  width: number;
}

function ZoomableCanvas(props: ZoomableCanvasProps) {
  const { draw, onMove, image, ...rest } = props;

  const [zoom, setZoom] = useState({
    lowerRight: false,
    mouseX: 0,
    mouseY: 0,
    visible: false,
  });

  // Enrich the draw function with more
  const enrichedDraw = (
    context: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => {
    draw(context, width, height);
    if (zoom.visible) {
      // Take min(20% of image, 50px) as the zoom box size
      const zoomBoxSize = Math.max(50, Math.min(width, height) * 0.2);
      const zoomPadding = zoomBoxSize / 2;

      let coords;
      if (zoom.lowerRight) {
        coords = {
          x: context.canvas.width - zoomBoxSize - zoomPadding,
          y: context.canvas.height - zoomBoxSize - zoomPadding,
        };
      } else {
        coords = {
          x: zoomPadding,
          y: zoomPadding,
        };
      }

      const zoomRatio = 2;

      // Zoom on a centered squared over the mouse position
      const sx = zoom.mouseX - zoomBoxSize / 2 / zoomRatio;
      const sy = zoom.mouseY - zoomBoxSize / 2 / zoomRatio;

      const contrastColor = averageInverseColor(
        image.data,
        coords.x,
        coords.y,
        zoomBoxSize,
        zoomBoxSize
      );

      // Draw the "out-of-bounds" area effect
      context.beginPath();
      drawHatchedSquare(
        context,
        coords.x,
        coords.y,
        zoomBoxSize,
        colorToCSS(contrastColor),
        colorToCSS(inverseColor(contrastColor))
      );

      // Re-draw part of the canvas onto itself
      context.drawImage(
        context.canvas,
        sx,
        sy,
        zoomBoxSize / zoomRatio,
        zoomBoxSize / zoomRatio,
        coords.x,
        coords.y,
        zoomBoxSize,
        zoomBoxSize
      );

      // Finally draw the border
      context.beginPath();
      context.strokeStyle = colorToCSS(contrastColor);
      context.lineWidth = zoomBoxSize / 20;
      context.rect(coords.x, coords.y, zoomBoxSize, zoomBoxSize);
      context.setLineDash([]);
      context.stroke();
    }
  };

  const updateZoom = (
    visible: boolean,
    event: React.MouseEvent | React.TouchEvent
  ) => {
    const { x, y } = extractCoordinates(event);
    const { width, height } = extractTargetSize(event);
    setZoom({
      visible,
      // Reverse the value here since we want to draw the zoom square
      // at the opposite of the mouse
      lowerRight: !isLowerRight(width, height, x, y),
      mouseX: x,
      mouseY: y,
    });
  };

  const enrichedOnMove = (event: React.MouseEvent | React.TouchEvent) => {
    if (onMove) {
      onMove(event);
    }
    updateZoom(true, event);
  };

  return (
    <Canvas
      draw={enrichedDraw}
      onMouseMove={enrichedOnMove}
      onTouchMove={enrichedOnMove}
      onMouseEnter={(event: React.MouseEvent) => updateZoom(true, event)}
      onMouseLeave={(event: React.MouseEvent) => updateZoom(false, event)}
      {...rest}
    />
  );
}

export default ZoomableCanvas;

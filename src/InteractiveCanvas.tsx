import React, { useState, useEffect } from 'react';
import ZoomableCanvas from './ZoomableCanvas';
import { extractCoordinates } from './lib/eventhelpers';
import { ImagePair, averageInverseColor, colorToCSS } from './lib/imgkit';
import {
  Quadrilateral,
  Point,
  isQuadrilateralConvex,
  midwayPoint,
} from './lib/geometry';

const drawCircle = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string,
  width: number
) => {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI, false);

  ctx.lineWidth = width;
  ctx.setLineDash([]);
  ctx.strokeStyle = color;
  ctx.stroke();
};

const drawDashedLine = (
  ctx: CanvasRenderingContext2D,
  p1: Point,
  p2: Point,
  width: number,
  color: string
) => {
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.lineWidth = width;
  ctx.setLineDash([5, 5]);
  ctx.strokeStyle = color;
  ctx.stroke();
};

/**
 * Given a list of points of {x, y} and a point, it will find the first point within the circle of center
 * (rx,ry) and of radius "distance".
 *
 * If multiple points satisfy this it will return the point that is the closest to (rx,ry)
 *
 * It returns the index of the found point if any, otherwise null;
 */
const findPointWithinDistance = (
  points: Point[],
  rx: number,
  ry: number,
  maxDistance: number
): number | null => {
  const hit = points
    .map(({ x, y }, idx) => [idx, (x - rx) ** 2 + (y - ry) ** 2])
    .sort(([_, da], [__, db]) => {
      if (da < db) {
        return -1;
      }
      if (da > db) {
        return 1;
      }
      return 0;
    })
    .find(([_, distance]) => distance < maxDistance ** 2);

  return hit ? hit[0] : null;
};

interface InteractiveCanvasProps {
  /** Width percentage of the screen the canvas should take (0 to 100) */
  widthPercentage: number;

  /** Height percentage of the screen the canvas should take (0 to 100) */
  heightPercentage: number;

  /** The image to show on the canvas */
  image: ImagePair;

  /** Callback on selected corners change */
  onCornersChange: (corners: Quadrilateral) => void;
}

function InteractiveCanvas({
  widthPercentage,
  heightPercentage,
  image,
  onCornersChange,
  ...rest
}: InteractiveCanvasProps) {
  const canvasHeight = (heightPercentage * window.innerHeight) / 100;
  const canvasWidth = (widthPercentage * window.innerWidth) / 100;

  const cornerRadius = 10;
  const clickCornerRadius = 10 * cornerRadius;

  // Compute the downscaling/upscaling ratio so that the image fully fits on the canvas.
  // We don't want to distort the image here so we just pick the maximum image dimension to compute the ratio.
  let ratio;
  if (image.data.width > image.data.height) {
    ratio = canvasWidth / image.data.width;
  } else {
    ratio = canvasHeight / image.data.height;
  }

  const imageMinDimension = Math.min(image.data.width, image.data.height);
  const colorBoxSizeComputation = Math.round(0.1 * imageMinDimension);
  const computeInverseColor = (p: Point) =>
    colorToCSS(
      averageInverseColor(
        image.data,
        p.x - colorBoxSizeComputation / 2,
        p.y - colorBoxSizeComputation / 2,
        colorBoxSizeComputation / 2,
        colorBoxSizeComputation / 2
      )
    );

  const realWidth = ratio * image.data.width;
  const realHeight = ratio * image.data.height;

  // order is: topLeft, topRight, bottomRight, bottomLeft
  const [corners, setCorners] = useState<Quadrilateral>([
    { x: 0, y: 0 },
    { x: realWidth, y: 0 },
    { x: realWidth, y: realHeight },
    { x: 0, y: realHeight },
  ]);

  useEffect(() => {
    // Init corners only once
    onCornersChange(corners);
  }, []);

  const [selectedCorner, setSelectedCorner] = useState<number | null>(null);

  const drawCorners = (context: CanvasRenderingContext2D) => {
    corners.forEach(({ x, y }, index) => {
      // TODO(proper-colors): use a color with a good contrast on the image
      drawCircle(
        context,
        x,
        y,
        cornerRadius,
        computeInverseColor({ x, y }),
        index === selectedCorner ? 8 : 4
      );
    });
  };

  const drawCornerLines = (context: CanvasRenderingContext2D) => {
    const lines = [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
    ];

    lines.forEach(([idx1, idx2]) => {
      const selected = idx1 === selectedCorner || idx2 === selectedCorner;
      const corner1 = corners[idx1];
      const corner2 = corners[idx2];
      const midway = midwayPoint(corner1, corner2);
      drawDashedLine(
        context,
        corners[idx1],
        corners[idx2],
        selected ? 3 : 1,
        computeInverseColor(midway)
      );
    });
  };

  const draw = (
    context: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => {
    context.clearRect(0, 0, width, height);
    context.drawImage(
      image.element,
      0,
      0,
      image.data.width,
      image.data.height,
      0,
      0,
      realWidth,
      realHeight
    );

    drawCorners(context);
    drawCornerLines(context);
  };

  const handleMouseDown = (event: React.MouseEvent | React.TouchEvent) => {
    const { x, y } = extractCoordinates(event);
    const foundIndex = findPointWithinDistance(
      corners,
      x,
      y,
      clickCornerRadius
    );
    if (foundIndex !== null) {
      setSelectedCorner(foundIndex);
    }
  };

  const handleMouseUp = () => {
    setSelectedCorner(null);
  };

  const handleMouseMove = (event: React.MouseEvent | React.TouchEvent) => {
    if (selectedCorner !== null) {
      // Disable scrolling on mobile if we are currently moving a corner
      event.preventDefault();
      const point = extractCoordinates(event);
      const newCorners: Quadrilateral = [...corners];
      newCorners[selectedCorner] = point;

      // Sanity check that the shape selected by the user makes sense
      if (
        isQuadrilateralConvex(newCorners) &&
        point.x < realWidth &&
        point.y < realHeight
      ) {
        setCorners(newCorners);
        onCornersChange(newCorners);
      }
    }
  };

  return (
    <ZoomableCanvas
      height={canvasHeight}
      width={canvasWidth}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchEnd={handleMouseUp}
      onMove={handleMouseMove}
      style={{
        width: `${canvasWidth}px`,
        height: `${canvasHeight}px`,
      }}
      draw={draw}
      {...rest}
    />
  );
}

export default InteractiveCanvas;

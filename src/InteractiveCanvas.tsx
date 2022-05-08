import React, { useState, useEffect } from 'react';
import ZoomableCanvas from './ZoomableCanvas';
import { extractCoordinates } from './lib/eventhelpers';
import { ImagePair, averageInverseColor, colorToCSS } from './lib/imgkit';
import {
  Quadrilateral,
  mapQuadrilateral,
  Point,
  isQuadrilateralConvex,
  midwayPoint,
  findPointWithinDistance,
  Size,
  sizeToPixels,
  multiplySize,
  scaleSize,
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

interface InteractiveCanvasProps {
  /** Width and height percentage of the screen the canvas should take (0 to 100) */
  sizePct: Size;

  /** The image to show on the canvas */
  image: ImagePair;

  /** Callback on selected corners change, the provided coordinates are in the image dimension space */
  onCornersChange: (corners: Quadrilateral) => void;
}

/*
 * We have multiple sizes involved here:
 *
 * a. The window inner size, this is the size of the browser window (TODO: on smartphones this is broken because it includes the bookmark bar)
 * b. The provided sizePct parameter, will be used to determine the size of the canvas using the window inner size.
 * c. The size of the canvas (sizePct * window.size)
 * d. The loaded image size (available via image.data.width/height)
 * e. The scaled image size (this one is computed so that the maximum dimension of the image perfectly fits in the canvas)
 *
 * The corners coordinates are computed in (c) but we should crop the image with coordinates scaled with (e).
 *
 * This is why we don't call onCornersChange directly on the stored corners but we first scale them back to the original image
 * dimension.
 */
function InteractiveCanvas({
  sizePct,
  image,
  onCornersChange,
  ...rest
}: InteractiveCanvasProps) {
  const canvasSize = scaleSize(
    multiplySize(sizePct, {
      width: window.innerWidth,
      height: window.innerHeight,
    }),
    1 / 100
  );

  const cornerRadius = 10;
  const clickCornerRadius = 10 * cornerRadius;

  // Compute the downscaling/upscaling ratio so that the image fully fits on the canvas.
  // We don't want to distort the image here so we just pick the maximum image dimension to compute the ratio.
  let ratio: number;
  if (image.data.width > image.data.height) {
    ratio = canvasSize.width / image.data.width;
  } else {
    ratio = canvasSize.height / image.data.height;
  }

  const imageMinDimension = Math.min(image.data.width, image.data.height);
  const colorBoxSizeComputation = Math.round(0.1 * imageMinDimension);
  const computeInverseColor = (p: Point) => {
    const halfBoxDimension = Math.round(colorBoxSizeComputation / 2);
    const halfBoxSize = { width: halfBoxDimension, height: halfBoxDimension };
    return colorToCSS(
      averageInverseColor(
        image.data,
        { x: p.x - halfBoxDimension, y: p.y - halfBoxDimension },
        halfBoxSize
      )
    );
  };

  const realWidth = Math.round(ratio * image.data.width);
  const realHeight = Math.round(ratio * image.data.height);

  const defaultCorners: Quadrilateral = [
    { x: 0, y: 0 },
    { x: realWidth, y: 0 },
    { x: realWidth, y: realHeight },
    { x: 0, y: realHeight },
  ];

  // See comment above but we have to resize the conrers before calling the callback hence this helper
  const cornersChangedCallback = (corners: Quadrilateral) => {
    const normalized = mapQuadrilateral(corners, (p) => ({
      x: Math.round(p.x / ratio),
      y: Math.round(p.y / ratio),
    }));
    onCornersChange(normalized);
  };

  // order is: topLeft, topRight, bottomRight, bottomLeft
  const [corners, setCorners] = useState<Quadrilateral>(defaultCorners);

  useEffect(() => {
    // Init corners upon changing image
    setCorners(defaultCorners);
    cornersChangedCallback(defaultCorners);
  }, [image]);

  const [selectedCorner, setSelectedCorner] = useState<number | null>(null);

  const drawCorners = (context: CanvasRenderingContext2D) => {
    corners.forEach(({ x, y }, index) => {
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
        cornersChangedCallback(newCorners);
      }
    }
  };

  return (
    <ZoomableCanvas
      size={canvasSize}
      image={image}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchEnd={handleMouseUp}
      onMove={handleMouseMove}
      style={{ ...sizeToPixels(canvasSize), touchAction: 'none' }}
      draw={draw}
      {...rest}
    />
  );
}

export default InteractiveCanvas;

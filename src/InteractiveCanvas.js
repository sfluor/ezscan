import React, { useState } from "react";
import ZoomableCanvas from "./ZoomableCanvas";
import { extractCoordinates } from "./lib/eventhelpers";

const drawCircle = (ctx, x, y, radius, color, width) => {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI, false);

  ctx.lineWidth = width;
  ctx.setLineDash([]);
  ctx.strokeStyle = color;
  ctx.stroke();
};

const drawDashedLine = (ctx, p1, p2, width, color) => {
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
const findPointWithinDistance = (points, rx, ry, maxDistance) => {
  const hit = points
    .map(({ x, y }, idx) => [idx, (x - rx) ** 2 + (y - ry) ** 2])
    .sort(([_, da], [__, db]) => {
      if (da < db) {
        return -1;
      } else if (da > db) {
        return 1;
      } else {
        return 0;
      }
    })
    .find(([_, distance]) => distance < maxDistance ** 2);

  return hit ? hit[0] : null;
};

const SELECTED_COLOR = "red";
const UNSELECTED_COLOR = "white";

const InteractiveCanvas = ({
  widthPercentage,
  heightPercentage,
  image,
  ...rest
}) => {
  const canvasHeight = (heightPercentage * window.innerHeight) / 100;
  const canvasWidth = (widthPercentage * window.innerWidth) / 100;

  const cornerRadius = 10;
  const clickCornerRadius = 4 * cornerRadius;

  // Compute the downscaling/upscaling ratio so that the image fully fits on the canvas.
  // We don't want to distort the image here so we just pick the maximum image dimension to compute the ratio.
  let ratio;
  if (image.width > image.height) {
    ratio = canvasWidth / image.width;
  } else {
    ratio = canvasHeight / image.height;
  }

  const realWidth = ratio * image.width;
  const realHeight = ratio * image.height;

  // order is: topLeft, topRight, bottomRight, bottomLeft
  const [corners, setCorners] = useState([
    { x: 0, y: 0 },
    { x: realWidth, y: 0 },
    { x: realWidth, y: realHeight },
    { x: 0, y: realHeight },
  ]);

  const [selectedCorner, setSelectedCorner] = useState(null);

  const drawCorners = (context) => {
    corners.forEach(({ x, y }, index) => {
      // TODO(proper-colors): use a color with a good contrast on the image
      drawCircle(
        context,
        x,
        y,
        cornerRadius,
        index === selectedCorner ? SELECTED_COLOR : UNSELECTED_COLOR,
        3
      );
    });
  };

  const drawCornerLines = (context) => {
    const lines = [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
    ];

    lines.forEach(([idx1, idx2]) => {
      const selected = idx1 === selectedCorner || idx2 === selectedCorner;
      // TODO(proper-colors): use a color with a good contrast on the image
      drawDashedLine(
        context,
        corners[idx1],
        corners[idx2],
        selected ? 2 : 1,
        selected ? SELECTED_COLOR : UNSELECTED_COLOR
      );
    });
  };

  const draw = (context, width, height) => {
    context.clearRect(0, 0, width, height);
    context.drawImage(
      image,
      0,
      0,
      image.width,
      image.height,
      0,
      0,
      realWidth,
      realHeight
    );

    drawCorners(context);
    drawCornerLines(context);
  };

  const handleMouseDown = (event) => {
    const { x, y } = extractCoordinates(event);
    console.log(x, y, corners);
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

  const handleMouseUp = (event) => {
    setSelectedCorner(null);
  };

  const handleMouseMove = (event) => {
    if (selectedCorner !== null) {
      // Disable scrolling on mobile if we are currently moving a corner
      event.preventDefault();
      const point = extractCoordinates(event);
      corners[selectedCorner] = point;
      setCorners(corners);
      // TODO: validate that the corners are still valid (not crossing each other / not weird shapes)
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
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
      style={{
        width: canvasWidth,
        height: canvasHeight,
      }}
      draw={draw}
      {...rest}
    />
  );
};

export default InteractiveCanvas;

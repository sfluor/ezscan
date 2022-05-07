import React, { useRef, useEffect } from 'react';

export type DrawFunction = (
  context: CanvasRenderingContext2D,
  width: number,
  height: number
) => void;

// From: https://medium.com/@pdx.lucasm/canvas-with-react-js-32e133c05258
const useCanvas = (draw: DrawFunction) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    const render = () => {
      if (canvas && context) {
        draw(context, canvas.width, canvas.height);
      }
    };
    render();
  }, [draw]);

  return canvasRef;
};

interface CanvasProps {
  draw: DrawFunction;

  onMouseMove: React.MouseEventHandler;
  onTouchMove: React.TouchEventHandler;
  onMouseEnter: React.MouseEventHandler;
  onMouseLeave: React.MouseEventHandler;
}

function Canvas(props: CanvasProps) {
  const { draw, ...rest } = props;
  const canvasRef = useCanvas(draw);

  return <canvas ref={canvasRef} {...rest} />;
}

export default Canvas;

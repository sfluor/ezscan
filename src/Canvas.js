import React, { useRef, useEffect } from 'react';

// From: https://medium.com/@pdx.lucasm/canvas-with-react-js-32e133c05258
const useCanvas = image => {

  const canvasRef = useRef(null);

  useEffect(() => {

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    let animationFrameId;
    const render = () => {
        if (image) {
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
          animationFrameId = window.requestAnimationFrame(render);
        }
    }
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    }
  }, [image]);

  return canvasRef;
}


const Canvas = props => {
  const { image, ...rest } = props;
    const canvasRef = useCanvas(image);

  return <canvas ref={canvasRef} {...rest}/>
}

export default Canvas;
import { Quadrilateral } from '../geometry';
import { Direction } from '../imgkit';
import { Message, MessageType } from './message';

class ImageProcessor {
  worker: Worker;

  constructor({ onProcessed }: { onProcessed: (image: ImageData) => void }) {
    this.worker = new Worker(new URL('./imgprocessing.js', import.meta.url));

    this.worker.onmessage = ({ data }) => {
      const message = data as Message;
      onProcessed(message.content);
    };
  }

  distort(image: ImageData, corners: Quadrilateral) {
    this.worker.postMessage({
      type: MessageType.Distort,

      args: {
        image,
        corners,
      },
    });
  }

  rotate(image: ImageData, direction: Direction) {
    this.worker.postMessage({
      type: MessageType.Rotate,

      args: {
        image,
        direction,
      },
    });
  }

  grayscale(image: ImageData) {
    this.worker.postMessage({
      type: MessageType.Grayscale,

      args: {
        image,
      },
    });
  }
}

export default ImageProcessor;

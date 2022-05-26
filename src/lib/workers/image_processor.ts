import { Quadrilateral } from '../geometry';
import { Direction } from '../imgkit';
import { Message, MessageType } from './message';

class ImageProcessor {
  worker: Worker;

  constructor({
    onDistort,
    onRotate,
  }: {
    onDistort: (image: ImageData) => void;
    onRotate: (image: ImageData) => void;
  }) {
    this.worker = new Worker(new URL('./imgprocessing.js', import.meta.url));

    this.worker.onmessage = ({ data }) => {
      const message = data as Message;

      if (message.type === MessageType.Distort) {
        onDistort(message.content);
      } else if (message.type === MessageType.Rotate) {
        onRotate(message.content);
      } else {
        console.error(`Unknown message type: ${message.type}`);
      }
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
}

export default ImageProcessor;

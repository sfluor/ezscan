import { distortImage, rotateImage } from '../imgkit';
import { MessageType } from './message';

// eslint-disable-next-line no-restricted-globals
self.onmessage = ({ data: { type, args } }) => {
  let message = null;
  if (type === MessageType.Rotate) {
    message = { type, content: rotateImage(args.image, args.direction) };
  } else if (type === MessageType.Distort) {
    message = { type, content: distortImage(args.image, args.corners) };
  }

  if (message !== null) {
    // eslint-disable-next-line no-restricted-globals
    self.postMessage(message);
  }
};

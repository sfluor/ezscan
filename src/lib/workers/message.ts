export enum MessageType {
  Distort,
  Rotate,
  Grayscale,
}

export interface Message {
  content: ImageData;
  type: MessageType;
}

export enum MessageType {
  Distort,
  Rotate,
}

export interface Message {
  content: ImageData;
  type: MessageType;
}

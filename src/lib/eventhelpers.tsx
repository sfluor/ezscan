import React from 'react';
import { Point } from './geometry.ts';

export type MouseEventListener = (
  event: React.MouseEvent | React.TouchEvent
) => void;

interface Size {
  width: number;
  height: number;
}

const extractTargetSize = (
  event: React.MouseEvent | React.TouchEvent
): Size => {
  const { target } = event;
  if (target instanceof Element) {
    const { clientWidth, clientHeight } = target;

    return { width: clientWidth, height: clientHeight };
  }

  // TODO: what to do ?
  return { width: 0, height: 0 };
};

const extractCoordinates = (
  rawEvent: React.MouseEvent | React.TouchEvent
): Point => {
  const event: MouseEvent | TouchEvent = rawEvent.nativeEvent;

  if (event instanceof TouchEvent) {
    const touch = event.touches[0];
    const { target } = event;

    let offsetX = 0;
    let offsetY = 0;
    if (target instanceof HTMLElement) {
      offsetX = target?.offsetLeft;
      offsetY = target?.offsetTop;
    }

    return {
      x: touch.pageX - offsetX,
      y: touch.pageY - offsetY,
    };
  }

  return { x: event.offsetX, y: event.offsetY };
};

export { extractCoordinates, extractTargetSize };

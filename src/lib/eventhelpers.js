const extractCoordinates = (event) => {
  if (window.TouchEvent && event instanceof TouchEvent) {
    const touch = event.touches[0];
    const { target } = event;
    return {
      x: touch.pageX - target.offsetLeft,
      y: touch.pageY - target.offsetTop,
    };
  }

  return { x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY };
};

export default extractCoordinates;

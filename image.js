// Global converter used to do conversions from/to Image/ImageData
const converter = document.createElement("canvas");

// Convert an Image into an ImageData using a hidden canvas
export function imageToImageData(img) {
  converter.width = img.width;
  converter.height = img.height;
  const ctx = converter.getContext("2d");

  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0, 0, img.width, img.height);
}

// Convert an ImageData into an Image using a hidden canvas
export function imageDataToImage(imgData) {
  converter.width = imgData.width;
  converter.height = imgData.height;
  const ctx = converter.getContext("2d");

  ctx.putImageData(imgData, 0, 0);

  return converter.toDataURL();
}

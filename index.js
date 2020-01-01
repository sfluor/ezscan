import { distort } from "./distort.js";
import { newDynamicCanvas } from "./dynamic_canvas.js";

const canvas = newDynamicCanvas();
document.getElementsByTagName("body")[0].appendChild(canvas);

const cam = document.getElementById("camera");
const cropBtn = document.getElementById("crop-btn");

cropBtn.addEventListener("click", () => {
  const { data, corners } = canvas.exportImage();
  // TODO: stop hardcoding same ratio
  const { width, height } = data;

  const dst_img = canvas.createImage(width, height);
  distort(data, dst_img, corners);
  canvas.putImage(dst_img);
});

const reader = new FileReader();

reader.addEventListener("load", () => {
  canvas.draw(reader.result);
});

cam.addEventListener("change", () => {
  const file = cam.files[0];
  reader.readAsDataURL(file);
});

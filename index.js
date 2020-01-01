import { distort } from "./distort.js";
import { newDynamicCanvas } from "./dynamic_canvas.js";

const canvas = newDynamicCanvas();
document.getElementsByTagName("body")[0].appendChild(canvas);

canvas.resize(1000, 1000);

const cam = document.getElementById("camera");
const cropBtn = document.getElementById("crop-btn");

cropBtn.addEventListener("click", () => {
  const { data, corners } = canvas.getImage();
  // TODO: stop hardcoding
  const width = 612;
  const height = 816;

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

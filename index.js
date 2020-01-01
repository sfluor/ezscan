import { distort } from "./distort.js";
import { newDynamicCanvas } from "./dynamic_canvas.js";

const canvas = newDynamicCanvas();
document.getElementsByTagName("body")[0].appendChild(canvas);

canvas.resize(1000, 1000);

const cam = document.getElementById("camera");
const cropBtn = document.getElementById("crop-btn");

cropBtn.addEventListener("click", () => {
  const { data, corners } = canvas.getImage();
  const dst_corners = [
    [0, 0],
    [612, 0],
    [612, 816],
    [0, 816]
  ];
  distort(data, corners, dst_corners);
});

const reader = new FileReader();

reader.addEventListener("load", () => {
  canvas.draw(reader.result);
});

cam.addEventListener("change", () => {
  const file = cam.files[0];
  reader.readAsDataURL(file);
});

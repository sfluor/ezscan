import { distort } from "./distort.js";
import { newDynamicCanvas } from "./dynamic_canvas.js";

function emptyNode(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

function createCameraInput(node) {
  const cam = document.createElement("input");
  cam.id = "camera";
  cam.type = "file";
  cam.name = "camera";
  cam.accept = "image/*";
  cam.capture = "camera";

  cam.addEventListener("change", () => {
    const file = cam.files[0];
    reader.readAsDataURL(file);
  });
  node.appendChild(cam);
}

const container = document.getElementById("container");
createCameraInput(container);
const cropBtn = document.getElementById("crop-btn");
const backBtn = document.getElementById("back-btn");

const reader = new FileReader();

backBtn.addEventListener("click", () => {
  emptyNode(container);
  reader.canvas = null;
  createCameraInput(container);
});

reader.addEventListener("load", () => {
  emptyNode(container);

  reader.canvas = newDynamicCanvas();
  container.appendChild(reader.canvas);
  reader.canvas.draw(reader.result);
});

cropBtn.addEventListener("click", () => {
  const { data, corners } = reader.canvas.exportImageData();

  // TODO: stop hardcoding same ratio for destination
  const dst_img = reader.canvas.createImage(data.width, data.height);
  distort(data, dst_img, corners);
  reader.canvas.putImage(dst_img);
  // TODO: add loading when cropping
});

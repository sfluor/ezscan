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

function displayLoader() {
  document.getElementById("loader").style.display = "flex";
}

function hideLoader() {
  document.getElementById("loader").style.display = "none";
}

const container = document.getElementById("container");
createCameraInput(container);
const cropBtn = document.getElementById("crop-btn");
const backBtn = document.getElementById("back-btn");

const reader = new FileReader();
const distortWorker = new Worker("worker_distort.js");

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

distortWorker.onmessage = function(e) {
  reader.canvas.putImage(e.data);
  hideLoader();
};

cropBtn.addEventListener("click", () => {
  const { data, corners } = reader.canvas.exportImageData();

  // TODO: stop hardcoding same ratio for destination
  const dst_img = reader.canvas.createImage(data.width, data.height);
  displayLoader();
  distortWorker.postMessage({
    img: data,
    dst: dst_img,
    src_corners: corners
  });
});

import { newDynamicCanvas } from "./dynamic_canvas.js";

function emptyNode(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

function showCameraInput(node) {
  const camLabel = document.createElement("label");
  camLabel.htmlFor = "camera";
  camLabel.id = "camera-label";

  const camIcon = document.createElement("img");
  camIcon.className = "main-icon";
  camIcon.src = "icons/camera.svg";

  camLabel.appendChild(camIcon);
  camLabel.appendChild(document.createTextNode("Capture Image"));

  node.appendChild(camLabel);
}

function displayLoader() {
  document.getElementById("loader").style.display = "flex";
}

function hideLoader() {
  document.getElementById("loader").style.display = "none";
}

const container = document.getElementById("container");
showCameraInput(container);
const cropBtn = document.getElementById("crop-btn");
const backBtn = document.getElementById("back-btn");
const camera = document.getElementById("camera");

const reader = new FileReader();
const distortWorker = new Worker("worker_distort.js");

camera.addEventListener("change", () => {
  const file = cam.files[0];
  reader.readAsDataURL(file);
});

backBtn.addEventListener("click", () => {
  emptyNode(container);
  reader.canvas = null;
  showCameraInput(container);
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

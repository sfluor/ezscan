import { newDynamicCanvas } from "./dynamic_canvas.js";

const canvas = newDynamicCanvas();
document.getElementsByTagName("body")[0].appendChild(canvas);

canvas.resize(600, 600);

const cam = document.getElementById('camera');
const img = document.getElementById("image");

const reader = new FileReader();

reader.addEventListener('load', () => {
    canvas.draw(reader.result);
});

cam.addEventListener('change', () => {
    const file = cam.files[0];
    reader.readAsDataURL(file);
});

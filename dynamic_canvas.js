const RADIUS = 10;
const CLICK_RADIUS = 3 * RADIUS;

function extractCoords(ev) {
  if (ev instanceof TouchEvent) {
    const touch = ev.touches[0];
    const target = ev.target;
    return [touch.pageX - target.offsetLeft, touch.pageY - target.offsetTop];
  }

  return [ev.offsetX, ev.offsetY];
}

// TODO: display the canvas and the image separately for better performances
// currently the whole image is rerendered whenever we change the corners
class DynamicCanvas extends HTMLCanvasElement {
  static tagName() {
    return "dynamic-canvas";
  }

  constructor() {
    super();
    this.id = "dynamic-canvas";
    this.image = new Image();
    this.ctx = this.getContext("2d");
    this.hit_corner = null;

    this.init();
  }

  init() {
    this.resetCorners();

    this.image.onload = () => {
      // TODO: respect browser size aswell
      // A 3000x1900 canvas won't fit on mobile for instance
      this.resize(this.image.width, this.image.height);
      this.ctx.drawImage(this.image, 0, 0);
      this.image.style.display = "none";
      this.drawCorners();
    };

    this.addEventListener("mousedown", this.handleDown);
    this.addEventListener("touchstart", this.handleDown);
    this.addEventListener("mouseup", this.handleUp);
    this.addEventListener("touchend", this.handleUp);
    this.addEventListener("mousemove", this.handleMove);
    this.addEventListener("touchmove", this.handleMove);
  }

  handleDown = ev => {
    const [x, y] = extractCoords(ev);
    console.log("DOWN", ev, x, y);
    const hit = this.getHitCorner(x, y);
    if (hit !== null) {
      this.hit_corner = hit;
    }
  };

  handleUp = () => {
    this.hit_corner = null;
    this.refresh();
  };

  handleMove = ev => {
    if (this.hit_corner !== null) {
      ev.preventDefault();
      const pos = extractCoords(ev);
      this.corners[this.hit_corner] = pos;
      this.refresh();
    }
  };

  reset() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.drawImage(this.image, 0, 0);
  }

  refresh() {
    this.reset();
    this.drawCorners();
  }

  drawCorners() {
    this.corners.forEach(([x, y], idx) =>
      this.drawCircle(x, y, idx === this.hit_corner)
    );
    this.drawCornerLines();
  }

  drawCornerLines() {
    const lines = [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0]
    ];

    lines.forEach(([p1, p2]) => {
      const [x1, y1] = this.corners[p1];
      const [x2, y2] = this.corners[p2];
      this.drawLine(x1, y1, x2, y2);
    });
  }

  drawLine(x1, y1, x2, y2) {
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.lineWidth = 2;
    this.ctx.setLineDash([5, 5]);
    this.ctx.strokeStyle = "white";
    this.ctx.stroke();
  }

  drawCircle(x, y, targeted) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, RADIUS, 0, 2 * Math.PI, false);

    this.ctx.lineWidth = 2;
    this.ctx.setLineDash([]);
    this.ctx.strokeStyle = targeted ? "red" : "white";
    this.ctx.stroke();
  }

  draw(srcImage) {
    this.image.src = srcImage;
  }

  createImage(width, height) {
    return this.ctx.createImageData(width, height);
  }

  putImage(img) {
    this.ctx.putImageData(img, 0, 0);
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
    this.resetCorners();
  }

  resetCorners() {
    this.corners = [
      [RADIUS, RADIUS],
      [this.width - RADIUS, RADIUS],
      [this.width - RADIUS, this.height - RADIUS],
      [RADIUS, this.height - RADIUS]
    ];
  }

  // Check if a corner was hit
  getHitCorner(x, y) {
    const hit = this.corners
      .map((c, idx) => [idx, c])
      .find(
        ([_, [cx, cy]]) => (cx - x) ** 2 + (cy - y) ** 2 < CLICK_RADIUS ** 2
      );

    if (hit) {
      return hit[0];
    }

    return null;
  }

  exportImage() {
    // Reset to remove the corners / dashed lines from the image
    this.reset();
    return {
      data: this.ctx.getImageData(0, 0, this.width, this.height),
      corners: this.corners
    };
  }
}

customElements.define(DynamicCanvas.tagName(), DynamicCanvas, {
  extends: "canvas"
});

export function newDynamicCanvas() {
  return document.createElement("canvas", { is: DynamicCanvas.tagName() });
}

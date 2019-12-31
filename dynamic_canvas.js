const RADIUS = 10;
const CLICK_RADIUS = 2 * RADIUS;

// TODO: display the canvas and the image separately for better performances
// currently the whole image is rerendered whenever we change the corners
class DynamicCanvas extends HTMLCanvasElement {
  static tagName() {
    return "dynamic-canvas";
  }

  constructor() {
    super();
    this.id = "dynamic-canvas"
    this.image = new Image();
    this.ctx = this.getContext('2d');
    this.hit_corner = null;

    this.init();
  }

  init() {
    this.resetCorners();

    this.image.onload = () => {
      this.ctx.drawImage(this.image, 0, 0)
      this.image.style.display = 'none'
      this.drawCorners();
    }

    this.addEventListener("mousedown", ev => {
      const [x, y] = [ev.offsetX, ev.offsetY];
      const hit = this.getHitCorner(x, y);
      if (hit !== null) {
        console.log("HIT !", hit);
        this.hit_corner = hit;
      }
    }, false)
    this.addEventListener("mouseup", () => {this.hit_corner = null}, false)

    this.addEventListener("mousemove", ev => {
      if (this.hit_corner !== null) {
        const pos = [ev.offsetX, ev.offsetY];
        this.corners[this.hit_corner] = pos
        this.refresh();
      }
    }, false)
  }

  refresh() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.drawImage(this.image, 0, 0)
    this.drawCorners();
  }

  drawCorners() {
    this.corners.forEach(([x, y]) => this.drawCircle(x, y));
    this.drawCornerLines();
  }

  drawCornerLines() {
    const lines = [[0, 1], [1, 2], [2, 3], [3, 0]];

    lines.forEach(([p1, p2]) => {
      const [x1, y1] = this.corners[p1];
      const [x2, y2] = this.corners[p2];
      this.drawLine(x1, y1, x2, y2);
    })
  }

  drawLine(x1, y1, x2, y2) {
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.lineWidth = 2;
    this.ctx.setLineDash([5, 5]);
    this.ctx.strokeStyle = 'grey';
    this.ctx.stroke();
  }

  drawCircle(x, y) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, RADIUS, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = 'lightgrey';
    this.ctx.fill();

    this.ctx.lineWidth = 2;
    this.ctx.setLineDash([]);
    this.ctx.strokeStyle = 'grey';
    this.ctx.stroke();
  }

  draw(srcImage) {
    this.image.src = srcImage;
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
    this.resetCorners();
  }

  resetCorners() {
    this.corners = [
      [RADIUS, RADIUS],
      [this.width-RADIUS, RADIUS],
      [this.width-RADIUS, this.height-RADIUS],
      [RADIUS, this.height-RADIUS]
    ];
  }

  // Check if a corner was hit
  getHitCorner(x, y) {
    const hit = this.corners
      .map((c, idx) => [idx, c])
      .find(([_, [cx, cy]]) => (cx-x) ** 2 + (cy -y) ** 2 < CLICK_RADIUS**2);

    if (hit) {
      return hit[0]
    }

    return null; 
  }
}

customElements.define(DynamicCanvas.tagName(), DynamicCanvas, {extends: 'canvas'})

export function newDynamicCanvas() {
  return document.createElement('canvas', {is: DynamicCanvas.tagName()})
}

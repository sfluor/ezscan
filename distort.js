import { transpose, multiply, inverse } from "./matrix.js";

// Augment a 2d point into a bigger space where it's coordinates will be:
// x, y, x*y, z=1
// Kind of similar to the homogenous coordinates with a bilinearity introduced
function augment_2d_point(p) {
  if (p.length !== 2) {
    throw `Expected point ${point} to be a 2D point`;
  }

  return [p[0], p[1], p[0] * p[1], 1];
}

function project_2d(p) {
  if (p.length !== 4) {
    throw `Expected point ${point} to be a 4D point`;
  }

  return [p[0], p[1]];
}

// Bilinear distortion
// We stack our 4 source points into a matrix, same for destination and we want to
// find the distortion matrix M such as:
// M * DST = SRC
// Hence M = SRC * DST ^ -1
function distort_matrix(src_corners, dst_corners) {
  if (src_corners.length !== 4 || dst_corners.length !== 4) {
    throw `There should be 4 source corners and 4 destination corners`;
  }

  const src_mat = transpose(src_corners.map(p => augment_2d_point(p)));
  const dst_mat = transpose(dst_corners.map(p => augment_2d_point(p)));

  const inv_dst_mat = inverse(dst_mat);

  // Build the distortion matrix
  return multiply(src_mat, inv_dst_mat);
}

// Distort the given img (expected to be in ImageData format, see here: https://developer.mozilla.org/en-US/docs/Web/API/ImageData)
export function distort(img, dst, src_corners) {
  const dst_corners = [
    [0, 0],
    [dst.width, 0],
    [dst.width, dst.height],
    [0, dst.height]
  ];

  // Keep only the 2 first rows since we only want to compute x and y
  const M = distort_matrix(src_corners, dst_corners);

  let x, y, idx, x_s, y_s;
  let count = 50;
  for (let i = 0; i < dst.data.length; i += 4) {
    idx = i / 4;
    x = idx % dst.width;
    y = Math.floor(idx / dst.width);

    [x_s, y_s] = project_2d(multiply(M, augment_2d_point([x, y])));

    // RGBA channels
    // const channels = simpleInterpolation(img, x_s, y_s);
    const channels = bilinearInterpolation(img, x_s, y_s);
    channels.forEach((value, nb) => (dst.data[i + nb] = value));
  }
}

function pixIdx(x, y, width) {
  return 4 * (y * width + x);
}

function bilinearInterpolation(img, x, y) {
  // See: https://en.wikipedia.org/wiki/Bilinear_interpolation

  const [x1, y1] = [Math.floor(x), Math.floor(y)];
  // Add +1 instead of using ceil to avoid having x1 == x2
  const [x2, y2] = [x1 + 1, y1 + 1];

  const q11 = pixIdx(x1, y1, img.width);
  const q12 = pixIdx(x1, y2, img.width);
  const q21 = pixIdx(x2, y1, img.width);
  const q22 = pixIdx(x2, y2, img.width);

  const res = [];

  // No need to normalize since we always have x2 - x1 == 1 == y2 - y1
  const f11 = (x2 - x) * (y2 - y);
  const f12 = (x2 - x) * (y - y1);
  const f21 = (x - x1) * (y2 - y);
  const f22 = (x - x1) * (y - y1);

  for (let c = 0; c < 4; c++) {
    res.push(
      f11 * img.data[q11 + c] +
        f12 * img.data[q12 + c] +
        f21 * img.data[q21 + c] +
        f22 * img.data[q22 + c]
    );
  }

  return res;
}

function simpleInterpolation(img, x, y) {
  const start = pixIdx(Math.round(x), Math.round(y));
  const end = start + 4;

  return img.data.slice(start, end);
}

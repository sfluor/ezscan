function transpose(matrix) {
  for (let i = 0; i < matrix.length; i++) {
    for (let j = i + 1; j < matrix[0].length; j++) {
      const tmp = matrix[i][j];
      matrix[i][j] = matrix[j][i];
      matrix[j][i] = tmp;
    }
  }

  return matrix;
}

function copy_mat(mat) {
  const height = mat[0].length;
  const width = mat.length;

  const result = [];

  for (let y = 0; y < height; y++) {
    result.push([]);
    for (let x = 0; x < height; x++) {
      result[y].push(mat[y][x]);
    }
  }

  return result;
}

function zeros(n) {
  // todo: perf
  const res = [];
  for (let i = 0; i < n; i++) {
    res.push(0);
  }
  return res;
}

function multiply_mat_vec(a, v) {
  const height = a.length;
  const common = a[0].length;

  // todo: improve performances on array creation here
  const c = [];

  for (let i = 0; i < height; i++) {
    c.push(0);
    // c_i,k = sum(a_i,j * b_j,k)
    for (let j = 0; j < common; j++) {
      c[i] += a[i][j] * v[j];
    }
  }

  return c;
}

function multiply_mat_mat(a, b) {
  const height = a.length;
  const width = b[0].length;

  const common = a[0].length;

  // todo: improve performances on array creation here
  const c = [];

  for (let i = 0; i < height; i++) {
    c.push(zeros(width));
    for (let k = 0; k < width; k++) {
      // c_i,k = sum(a_i,j * b_j,k)
      for (let j = 0; j < common; j++) {
        c[i][k] += a[i][j] * b[j][k];
      }
    }
  }

  return c;
}

function multiply(a, b) {
  const height = a.length;
  const width = b[0].length || 1;

  if (a[0].length !== b.length) {
    throw `can't multiply matrix of size (${height}, ${a[0].length}) with size (${b.length}, ${width})`;
  }

  if (width === 1) {
    return multiply_mat_vec(a, b);
  }

  return multiply_mat_mat(a, b);
}

function argmax(arr) {
  // does not work for empty arrays
  let idx = 0;
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      idx = i;
      max = arr[i];
    }
  }
  return idx;
}

function range(s, e) {
  const arr = [];

  for (let i = s; i < e; i++) {
    arr.push(i);
  }

  return arr;
}

function inverse(matrix) {
  const copy = copy_mat(matrix);

  const height = copy[0].length;
  const width = copy.length;

  if (height !== width) {
    throw `matrix is not squared: (${height}, ${width})`;
  }

  // concat the identity matrix
  for (let i = 0; i < height; i++) {
    const row = zeros(height);
    row[i] = 1;
    copy[i] = copy[i].concat(row);
  }

  gaussjordanelimination(copy);

  const result = [];

  // extract the inverse
  for (let i = 0; i < height; i++) {
    result.push(copy[i].slice(width));
  }

  return result;
}

function swap_rows(mat, r1, r2) {
  const tmp_row = mat[r1];
  mat[r1] = mat[r2];
  mat[r2] = tmp_row;
  return mat;
}

const epsilon = 1e-12;

function isZero(x) {
  return Math.abs(x) < epsilon;
}

function gaussjordanelimination(matrix) {
  const height = matrix.length;
  const width = matrix[0].length;

  for (let y = 0; y < height; y++) {
    // find max pivot
    const max_row =
      y + argmax(range(y, height).map(i => Math.abs(matrix[i][y])));
    swap_rows(matrix, max_row, y);

    // check if abs(mat[y][y] = 0) or is too small
    // if it is the matrix is singular and can't be inversed
    if (isZero(matrix[y][y])) {
      throw "Singular matrix !";
    }

    // eliminate column y
    for (let y2 = y + 1; y2 < height; y2++) {
      const f = matrix[y2][y] / matrix[y][y];
      for (let x = y; x < width; x++) {
        matrix[y2][x] -= matrix[y][x] * f;
      }
    }
  }

  // backsubstitute
  for (let y = height - 1; y > -1; y--) {
    const f = matrix[y][y];

    for (let y2 = 0; y2 < y; y2++) {
      for (let x = width - 1; x > y - 1; x--) {
        matrix[y2][x] -= (matrix[y][x] * matrix[y2][y]) / f;
      }
    }

    matrix[y][y] = 1;

    // normalize row y
    for (let x = height; x < width; x++) {
      matrix[y][x] /= f;
    }
  }

  return matrix;
}

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
function distort(img, dst, src_corners) {
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

  return dst;
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

// Workaround to make the webworker work correctly
try {
  module.exports = {
    transpose,
    copy_mat,
    inverse,
    multiply
  };
} catch (err) {}
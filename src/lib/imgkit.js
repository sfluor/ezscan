// TODO(sami): typescript
function transposeMatrix(matrix) {
  for (let i = 0; i < matrix.length; i++) {
    for (let j = i + 1; j < matrix[0].length; j++) {
      const tmp = matrix[i][j];
      matrix[i][j] = matrix[j][i];
      matrix[j][i] = tmp;
    }
  }

  return matrix;
}

/**
 * cloneMatrix clones the provided matrix and returns the clone.
 * It doesn't perform deep cloning and will stop after cloning the rows and the columns.
 *
 */
function cloneMatrix(mat) {
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

/**
 * zeroValuedArray returns a zero valued array of size n
 */
function zeroValuedArray(n) {
  // todo: perf
  const res = [];
  for (let i = 0; i < n; i++) {
    res.push(0);
  }
  return res;
}

function matrixMultVector(a, v) {
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

function matrixMultMatrix(a, b) {
  const height = a.length;
  const width = b[0].length;

  const common = a[0].length;

  // todo: improve performances on array creation here
  const c = [];

  for (let i = 0; i < height; i++) {
    c.push(zeroValuedArray(width));
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
    return matrixMultVector(a, b);
  }

  return matrixMultMatrix(a, b);
}

/*
 * argmax returns the index of the maximum in the provided array.
 */
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

/*
 * range of (s, e) will return the array [s, s+1, ..., e-1]
 */
function range(s, e) {
  const arr = [];

  for (let i = s; i < e; i++) {
    arr.push(i);
  }

  return arr;
}

/*
 * inverses a matrix using the gauss jordan elimination algorithm.
 * See: https://en.wikipedia.org/wiki/Gaussian_elimination
 */
function inverse(matrix) {
  const copy = cloneMatrix(matrix);

  const height = copy[0].length;
  const width = copy.length;

  if (height !== width) {
    throw `matrix is not squared: (${height}, ${width})`;
  }

  // concat the identity matrix
  for (let i = 0; i < height; i++) {
    const row = zeroValuedArray(height);
    row[i] = 1;
    copy[i] = copy[i].concat(row);
  }

  gaussJordanElimination(copy);

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

// https://en.wikipedia.org/wiki/Gaussian_elimination
function gaussJordanElimination(matrix) {
  const height = matrix.length;
  const width = matrix[0].length;

  for (let y = 0; y < height; y++) {
    // find max pivot
    const max_row =
      y + argmax(range(y, height).map((i) => Math.abs(matrix[i][y])));
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
function planToHomogenousCoordinates(p) {
  if (p.length !== 2) {
    throw `Expected point ${point} to be a 2D point`;
  }

  return [p[0], p[1], p[0] * p[1], 1];
}

// Bilinear distortion
// We stack our 4 source points into a matrix, same for destination and we want to
// find the distortion matrix M such as:
// M * DST = SRC
// Hence M = SRC * DST ^ -1
function distortMatrix(src_corners, dst_corners) {
  if (src_corners.length !== 4 || dst_corners.length !== 4) {
    throw `There should be 4 source corners and 4 destination corners`;
  }

  const src_mat = transposeMatrix(
    src_corners.map((p) => planToHomogenousCoordinates(p))
  );
  const dst_mat = transposeMatrix(
    dst_corners.map((p) => planToHomogenousCoordinates(p))
  );

  const inv_dst_mat = inverse(dst_mat);

  // Build the distortion matrix
  return multiply(src_mat, inv_dst_mat);
}

// distortImage the given img (expected to be in ImageData format, see here: https://developer.mozilla.org/en-US/docs/Web/API/ImageData)
function distortImage(img, dst, src_corners) {
  const dst_corners = [
    [0, 0],
    [dst.width, 0],
    [dst.width, dst.height],
    [0, dst.height],
  ];

  // Keep only the 2 first rows since we only want to compute x and y
  const M = distortMatrix(src_corners, dst_corners).slice(0, 2);

  let x, y, idx, x_s, y_s;

  // Avoid recrating this array every time so we do it only once
  const channels = [0, 0, 0, 0];
  for (let i = 0; i < dst.data.length; i += 4) {
    idx = i / 4;
    x = idx % dst.width;
    y = Math.floor(idx / dst.width);

    [x_s, y_s] = multiply(M, planToHomogenousCoordinates([x, y]));

    // RGBA channels
    // const channels = simpleInterpolation(img, x_s, y_s);
    bilinearInterpolation(img, x_s, y_s, channels);
    channels.forEach((value, nb) => (dst.data[i + nb] = value));
  }

  return dst;
}

/*
 * Returns the pixel index in the provided image (because images are stored as arrays in JS)
 */
function pixelIndex(x, y, width) {
  return 4 * (y * width + x);
}

function bilinearInterpolation(img, x, y, channels) {
  // See: https://en.wikipedia.org/wiki/Bilinear_interpolation

  const x1 = Math.floor(x);
  const y1 = Math.floor(y);

  // Consider that x2 is just x1 + 1 and y2 = y1 + 1 to avoid using ceil and ending with x1 == x2 or y1 == y2
  const q11 = pixelIndex(x1, y1, img.width);
  const q12 = pixelIndex(x1, y1 + 1, img.width);
  const q21 = pixelIndex(x1 + 1, y1, img.width);
  const q22 = pixelIndex(x1 + 1, y1 + 1, img.width);

  const dx = x - x1;
  const dy = y - y1;

  // No need to normalize since we always have x2 - x1 == 1 == y2 - y1
  const f11 = (1 - dx) * (1 - dy);
  const f12 = (1 - dx) * dy;
  const f21 = dx * (1 - dy);
  const f22 = dx * dy;

  for (let c = 0; c < 4; c++) {
    channels[c] =
      f11 * img.data[q11 + c] +
      f12 * img.data[q12 + c] +
      f21 * img.data[q21 + c] +
      f22 * img.data[q22 + c];
  }
}

function simpleInterpolation(img, x, y, channels) {
  const start = pixelIndex(Math.round(x), Math.round(y));

  for (let c = 0; c < 4; c++) {
    channels[c] = img.data[start + c];
  }
}

// Workaround to make the webworker work correctly
export { transposeMatrix, cloneMatrix, inverse, multiply };

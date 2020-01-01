export const transpose = matrix => {
  for (let i = 0; i < matrix.length; i++) {
    for (let j = i + 1; j < matrix[0].length; j++) {
      const tmp = matrix[i][j];
      matrix[i][j] = matrix[j][i];
      matrix[j][i] = tmp;
    }
  }

  return matrix;
}

const copy_mat = mat => {
  const height = mat[0].length;
  const width = mat.length;

  const result = []

  for (let y = 0; y< height; y++) {
    result.push([])
    for (let x = 0; x< height; x++) {
      result[y].push(mat[y][x])
    }
  }

  return result;
}

const zeros = n => {
  // todo: perf
  const res = [];
  for (let i = 0; i< n; i++) {res.push(0)}
  return res;
}

export const multiply = (a, b) => {
  const height = a.length;
  const width = b[0].length || 1;

  if (a[0].length !== b.length) {
    throw `can't multiply matrix of size (${height}, ${a[0].length}) with size (${b.length}, ${width})`;
  }

  const common = a[0].length;

  // todo: improve performances on array creation here
  const c = []

  for (let i = 0; i < height; i++){
    c.push(zeros(width));
    for (let k= 0; k < width; k++){

      // c_i,k = sum(a_i,j * b_j,k)
      for (let j = 0; j < common; j++) {
        // todo: perf + distinct case for one sized vectors
        if (width == 1) {
          c[i][k] += a[i][j] * b[j]
        } else {
          c[i][k] += a[i][j] * b[j][k];
        }
      }
    }
  }

  return c;
}

const argmax = arr => {
  // does not work for empty arrays
  let idx = 0;
  let max = arr[0];
  for (let i = 1; i < arr.length; i++){
    if (arr[i] > max) {
      idx = i;
      max = arr[i];
    }
  }
  return idx
}

const range = (s, e) => {
  const arr = [];

  for (let i = s; i < e; i++) {
    arr.push(i);
  }

  return arr;
}

export const inverse = matrix => {
  const copy = copy_mat(matrix);

  const height = copy[0].length;
  const width = copy.length;

  if (height !== width) {
    throw `matrix is not squared: (${height}, ${width})`;
  }

  // concat the identity matrix
  for (let i = 0; i < height; i++) {
    const row = zeros(height);
    row[i] = 1
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

const swap_rows = (mat, r1, r2) => {
    const tmp_row = mat[r1];
    mat[r1] = mat[r2];
    mat[r2] = tmp_row;
    return mat;
}

const gaussjordanelimination = matrix => {
  const height = matrix.length;
  const width = matrix[0].length;

  for (let y = 0; y < height; y++) {
    // find max pivot
    const max_row = y + argmax(range(y, height).map(i => Math.abs(matrix[i][y])));
    swap_rows(matrix, max_row, y);

    // check if abs(mat[y][y] = 0) or is too small
    // if it is matrix is singular

    // eliminate column y
    for (let y2 = y+1; y2 < height; y2++) {
      const f = matrix[y2][y] / matrix[y][y];
      for (let x = y; x < width; x++) {
        matrix[y2][x] -= matrix[y][x] * f
      }
    }
  }

  // backsubstitute
  for (let y = height - 1; y > -1; y--) {
    const f = matrix[y][y];

    for (let y2 = 0; y2 < y; y2++) {
      for (let x = width -1; x > y -1; x--) {
        matrix[y2][x] -= matrix[y][x] * matrix[y2][y] / f
      }
    }

    matrix[y][y] = 1;

    // normalize row y
    for (let x = height; x < width; x++) {
      matrix[y][x] /= f
    }
  }

  return matrix
}

// todo: testing
// todo: removeme
const mat = [[1, 1], [0, 1]]
const vec = [10, 5]

console.log(multiply(mat, vec));

const inv = inverse(mat);
console.log('should be identity', multiply(mat, inv));

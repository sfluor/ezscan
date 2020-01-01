const { transpose, inverse, multiply, copy_mat } = require("../distort");

const identity = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1]
];

test("test matrix multiply with identity", () => {
  const vecs = [
    [1, 2, 3],
    [0, 0, 0],
    [100, 0, 50]
  ];

  vecs.forEach(vec => expect(multiply(identity, vec)).toStrictEqual(vec));
  expect(multiply(identity, vecs)).toStrictEqual(vecs);
});

test("test simple inverse", () => {
  const mat = [
    [1, 1, 0],
    [0, 1, 0],
    [0, 1, 1]
  ];

  const inv = inverse(mat);

  const expected = [
    [1, -1, 0],
    [0, 1, 0],
    [0, -1, 1]
  ];

  expect(inv).toStrictEqual(expected);
  expect(multiply(inv, mat)).toStrictEqual(identity);
  expect(multiply(mat, inv)).toStrictEqual(identity);
});

test("test transpose", () => {
  const mat = [
    [1, 0, -1],
    [0, 1, 0],
    [0, 0, 1]
  ];

  const expected = [
    [1, 0, 0],
    [0, 1, 0],
    [-1, 0, 1]
  ];

  const sym = [
    [0, 1, 1],
    [1, 0, 0],
    [1, 0, 0]
  ];

  expect(transpose(mat)).toStrictEqual(expected);
  expect(transpose(copy_mat(sym))).toStrictEqual(sym);
});

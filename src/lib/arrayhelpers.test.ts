import reorder from './arrayhelpers';

const reorderTests: [Array<number>, number, number, Array<number>][] = [
  [[1, 2, 3], 0, 1, [2, 1, 3]],
  [[1, 2, 3], 2, 0, [3, 1, 2]],
  [[1, 2, 3, 4, 5], 3, 4, [1, 2, 3, 5, 4]],
];

test.each(reorderTests)(
  'reorder(%o, %o, %o) should be %o',
  (inp, from, to, expected) => {
    expect(reorder(inp, from, to)).toEqual(expected);
  }
);

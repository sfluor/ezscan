/*
 * Returns a new array where the element at position src is now at position dst (shifting the other elements forward)
 */
const reorder = <T>(array: Array<T>, src: number, dst: number): Array<T> => {
  const result = [...array];
  const [reordered] = result.splice(src, 1);
  result.splice(dst, 0, reordered);
  return result;
};

export default reorder;

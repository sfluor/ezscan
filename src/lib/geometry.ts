export interface Point {
  x: number;
  y: number;
}

type Segment = [Point, Point];

export type Quadrilateral = [Point, Point, Point, Point];

/*
 * Given a rectangle (here it's a square for simplicity)
 * Indicates if the current position (assuming 0 is the top left corner) is in the upper left part or on the lower right part.
 *
 *  (0, 0)           (W, 0)
 *    ________________
 *   |              /|
 *   |            /  |
 *   |          /    |
 *   |        /      |
 *   |      /        |
 *   |    /     x    |
 *   |  /            |
 *   |/______________|
 *
 *   (0, H)          (W, H)
 *
 *  If we draw that properly it's actually the function
 *
 *  f(x) = -H/W * x + H
 *
 *  W being the width and H the height.
 *
 *  To know if a given point is below/above the curve we
 *  just have to compute what would be it's y = f(x) value
 *  and check if it's greater than the point's y coordinate or not.
 *
 */
const isLowerRight = (width: number, height: number, x: number, y: number) =>
  height - (height / width) * x < y;

/*
 * Computes a 2D crossProduct (we return what would be the z coordinate in our case).
 *
 * Formula for u ^ v is u ^ v = (uy * vz - uz * vy, uz * vx - ux * vz, ux * vy - uy * vx)
 *
 * We only want the z coordinate so: ux * vy - uy * vx
 *
 * If the provided data is: point P and segment AB
 *
 * We will compute AB ^ BP
 *
 * BP = (px-bx, py-by)
 */
const crossProductZCoordinate = ({ x, y }: Point, [a, b]: Segment) =>
  (b.x - a.x) * (y - b.y) - (b.y - a.y) * (x - b.x);

/*
 * Checks if the two provided segments are intersecting or not.
 *
 * If segments are AB and CD, we do a cross product to verify that A and B are not on the same sides of CD AND that
 * C and D are not on the same sides of A and B.
 *
 */
const segmentsIntersect = ([a, b]: Segment, [c, d]: Segment) =>
  crossProductZCoordinate(a, [c, d]) * crossProductZCoordinate(b, [c, d]) < 0 &&
  crossProductZCoordinate(c, [a, b]) * crossProductZCoordinate(d, [a, b]) < 0;

/*
 * Indicates if the provided quadrilateral is convex.
 *
 * See: https://en.wikipedia.org/wiki/Quadrilateral#Convex_quadrilateral
 *
 * Order of the points is assumed to be: (tlX, tlY) topLeft, (trX, trY) topRight, (brX, brY) bottomRight, (blX, blY) bottomLeft
 *
 * The only thing we have to check is that the diagonals are intersecting with each other.
 * e.g that the lines [tr, bl] and [tl, br] are intersecting.
 *
 */
const isQuadrilateralConvex = ([tl, tr, br, bl]: Quadrilateral) =>
  segmentsIntersect([tr, bl], [tl, br]);

/*
 * Returns a point that is the middle of the segment formed by the two provided points
 */
const midwayPoint = (p1: Point, p2: Point) => ({
  x: (p1.x + p2.x) / 2,
  y: (p1.y + p2.y) / 2,
});

export { isQuadrilateralConvex, segmentsIntersect, midwayPoint, isLowerRight };

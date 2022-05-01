export interface Point {
  x: number;
  y: number;
}

type Segment = [Point, Point];

export type Quadrilateral = [Point, Point, Point, Point];

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

export { isQuadrilateralConvex, segmentsIntersect };

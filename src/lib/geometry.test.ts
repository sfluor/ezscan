import {
  isLowerRight,
  isQuadrilateralConvex,
  segmentsIntersect,
  Quadrilateral,
  Point,
  midwayPoint,
} from './geometry';

const segmentsIntersectTests: [Quadrilateral, boolean][] = [
  [
    [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 2 },
      { x: 3, y: 3 },
    ],
    false,
  ],
  [
    [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 1 },
      { x: 1, y: 0 },
    ],
    true,
  ],
  [
    [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 0.5 },
      { x: 1, y: 0.5 },
    ],
    true,
  ],
  [
    [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 0.5, y: 0 },
      { x: 0.5, y: 1 },
    ],
    true,
  ],
  [
    [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 0.5, y: 0 },
      { x: 0.5, y: 0.4 },
    ],
    false,
  ],
];

test.each(segmentsIntersectTests)(
  'segmentIntersects(%o) should be %s',
  ([p1, p2, p3, p4], expected) => {
    expect(segmentsIntersect([p1, p2], [p3, p4])).toEqual(expected);
  }
);

test.each(segmentsIntersectTests)(
  'isQuadrilateralConvex(%o) should be %s',
  ([p1, p2, p3, p4], expected) => {
    expect(isQuadrilateralConvex([p1, p3, p2, p4])).toEqual(expected);
  }
);

const midwayPointTests: [Point, Point, Point][] = [
  [
    { x: 0, y: 0 },
    { x: 1, y: 1 },
    { x: 0.5, y: 0.5 },
  ],
  [
    { x: -1, y: -1 },
    { x: 1, y: 1 },
    { x: 0, y: 0 },
  ],
  [
    { x: -1, y: 20 },
    { x: 15, y: 18 },
    { x: 7, y: 19 },
  ],
];

test.each(midwayPointTests)(
  'midwayPoint(%o, %o) should be %o',
  (p1, p2, expected) => {
    expect(midwayPoint(p1, p2)).toEqual(expected);
  }
);

const isLowerRightTests: [
  {
    width: number;
    height: number;
    x: number;
    y: number;
  },
  boolean
][] = [
  [{ width: 100, height: 100, x: 20, y: 20 }, false],

  [{ width: 100, height: 100, x: 80, y: 80 }, true],

  [{ width: 100, height: 50, x: 4, y: 49 }, true],
  [{ width: 100, height: 50, x: 0, y: 49 }, false],
];

test.each(isLowerRightTests)(
  'isLowerRight(%o) should be %o',
  ({ width, height, x, y }, expected) => {
    expect(isLowerRight(width, height, x, y)).toEqual(expected);
  }
);

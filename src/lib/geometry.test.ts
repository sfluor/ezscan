import {
  isLowerRight,
  Size,
  isQuadrilateralConvex,
  segmentsIntersect,
  Quadrilateral,
  Point,
  midwayPoint,
  findPointWithinDistance,
  multiplySize,
  scaleSize,
  mapQuadrilateral,
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
    expect(isLowerRight({ width, height }, { x, y })).toEqual(expected);
  }
);

const findPointWithinDistanceTests: [
  {
    points: Point[];
    rx: number;
    ry: number;
    maxDistance: number;
  },
  number | null
][] = [
  [
    {
      points: [],
      rx: 0,
      ry: 0,
      maxDistance: 100,
    },
    null,
  ],

  [
    {
      points: [
        { x: 0, y: 0 },
        { x: 1, y: 1 },
        { x: 2, y: 2 },
      ],
      rx: 1.6,
      ry: 1.6,
      maxDistance: 2,
    },
    2,
  ],
  [
    {
      points: [
        { x: 0, y: 0 },
        { x: 1, y: 1 },
        { x: 2, y: 2 },
      ],
      rx: 1.6,
      ry: 1.6,
      maxDistance: 0.1,
    },
    null,
  ],
];

test.each(findPointWithinDistanceTests)(
  'findPointWithinDistance(%o) should be %o',
  ({ points, rx, ry, maxDistance }, expected) => {
    expect(findPointWithinDistance(points, rx, ry, maxDistance)).toEqual(
      expected
    );
  }
);

const multiplySizeTests: [Size, Size, Size][] = [
  [
    { width: 10, height: 25 },
    { width: 0, height: 2 },
    { width: 0, height: 50 },
  ],
  [
    { width: 10, height: 25 },
    { width: 2, height: 0 },
    { width: 20, height: 0 },
  ],
  [
    { width: 11, height: 12 },
    { width: 2, height: 3 },
    { width: 22, height: 36 },
  ],
];

test.each(multiplySizeTests)(
  'multiplySize(%o, %o) should be %o',
  (a, b, expected) => {
    expect(multiplySize(a, b)).toEqual(expected);
  }
);

const scaleSizeTests: [Size, number, Size][] = [
  [{ width: 10, height: 25 }, 0, { width: 0, height: 0 }],
  [{ width: 10, height: 25 }, 2, { width: 20, height: 50 }],
  [{ width: 11, height: 12 }, 3, { width: 33, height: 36 }],
];

test.each(scaleSizeTests)(
  'scaleSize(%o, %o) should be %o',
  (a, b, expected) => {
    expect(scaleSize(a, b)).toEqual(expected);
  }
);

const defaultQuadrilateral: Quadrilateral = [
  { x: 0, y: 0 },
  { x: 1, y: 1 },
  { x: 2, y: 2 },
  { x: 3, y: 3 },
];
const mapQuadrilateralTests: [Quadrilateral, (p: Point) => any, any][] = [
  [
    defaultQuadrilateral,
    (p) => ({ x: 2 * p.x, y: 3 * p.y }),
    [
      { x: 0, y: 0 },
      { x: 2, y: 3 },
      { x: 4, y: 6 },
      { x: 6, y: 9 },
    ],
  ],
  [defaultQuadrilateral, (p) => p.x, [0, 1, 2, 3]],
  [defaultQuadrilateral, (p) => p.x * p.y, [0, 1, 4, 9]],
];

test.each(mapQuadrilateralTests)(
  'mapQuadrilateral(%o, %o) should be %o',
  (q, mapper, expected) => {
    expect(mapQuadrilateral(q, mapper)).toEqual(expected);
  }
);

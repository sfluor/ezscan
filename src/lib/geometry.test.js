import { isQuadrilateralConvex, segmentsIntersect } from "./geometry";

const segmentsIntersectTests = [
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
  "segmentIntersects(%o) should be %s",
  ([p1, p2, p3, p4], expected) => {
    expect(segmentsIntersect([p1, p2], [p3, p4])).toEqual(expected);
  }
);


test.each(segmentsIntersectTests)(
  "isQuadrilateralConvex(%o) should be %s",
  ([p1, p2, p3, p4], expected) => {
    expect(isQuadrilateralConvex([p1, p3, p2, p4])).toEqual(expected);
  }
);

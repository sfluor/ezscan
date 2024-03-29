import path from 'path';
import { Quadrilateral } from './geometry';
import {
  Color,
  inverseColor,
  colorToCSS,
  inverse,
  averageColorRaw,
  averageInverseColorRaw,
  transposeMatrixInPlace,
  argmax,
  imageToImageData,
  distortImageRaw,
  Direction,
  rotateImageRaw,
  grayscaleRaw,
} from './imgkit';

const inverseColorsTests: [Color, Color][] = [
  [
    {
      R: 10,
      G: 240,
      B: 19,
    },
    {
      R: 245,
      G: 15,
      B: 236,
    },
  ],
  [
    {
      R: 0,
      G: 0,
      B: 0,
    },
    {
      R: 255,
      G: 255,
      B: 255,
    },
  ],
];

test.each(inverseColorsTests)(
  'inverseColor(%o) should be %o and vice-versa',
  (input, expected) => {
    expect(inverseColor(input)).toEqual(expected);
    expect(inverseColor(expected)).toEqual(input);
  }
);

const colorToCSSTests: [Color, string][] = [
  [
    {
      R: 10,
      G: 240,
      B: 19,
    },
    'rgb(10, 240, 19)',
  ],
  [
    {
      R: 0,
      G: 0,
      B: 0,
    },
    'rgb(0, 0, 0)',
  ],
];

test.each(colorToCSSTests)('colorToCSS(%o) should be %s', (input, expected) => {
  expect(colorToCSS(input)).toEqual(expected);
});

describe('should compute average image color', () => {
  // This is a 255x255 image
  // Pixel at position (x, y) has color (x, y, (x+y/2), 1)
  const data = [];

  for (let y = 0; y < 255; y += 1) {
    for (let x = 0; x < 255; x += 1) {
      data.push(x);
      data.push(y);
      data.push(Math.round((x + y) / 2));
      data.push(1);
    }
  }

  const imageData = Uint8ClampedArray.from(data);
  const width = 255;
  const height = 255;

  test('pixel line of size 4', () => {
    const sHeight = 4;
    const sWidth = 255;
    const computed = averageColorRaw(
      imageData,
      { width, height },
      { x: 0, y: 100 },
      { width: sWidth, height: sHeight }
    );
    const computedInverse = averageInverseColorRaw(
      imageData,
      { width, height },
      { x: 0, y: 100 },
      { width: sWidth, height: sHeight }
    );

    const expected = {
      R: 127,
      G: 102,
      B: 115,
    };
    expect(computed).toEqual(expected);
    expect(computedInverse).toEqual(inverseColor(expected));
  });

  test('pixel column of size 4', () => {
    const sHeight = 255;
    const sWidth = 4;
    const computed = averageColorRaw(
      imageData,
      { width, height },
      { x: 100, y: 0 },
      { width: sWidth, height: sHeight }
    );
    const computedInverse = averageInverseColorRaw(
      imageData,
      { width, height },
      { x: 100, y: 0 },
      { width: sWidth, height: sHeight }
    );

    const expected = {
      R: 102,
      G: 127,
      B: 115,
    };
    expect(computed).toEqual(expected);
    expect(computedInverse).toEqual(inverseColor(expected));
  });

  test('pixel column of size 4 with negative start', () => {
    const sHeight = 255;
    const sWidth = 4;
    const computed = averageColorRaw(
      imageData,
      { width, height },
      { x: 100, y: -200 },
      { width: sWidth, height: sHeight }
    );
    const computedInverse = averageInverseColorRaw(
      imageData,
      { width, height },
      { x: 100, y: -200 },
      { width: sWidth, height: sHeight }
    );

    const expected = {
      R: 102,
      G: 127,
      B: 115,
    };
    expect(computed).toEqual(expected);
    expect(computedInverse).toEqual(inverseColor(expected));
  });
});

const transposeMatrixTests: [number[][], number[][]][] = [
  [
    [
      [0, 1],
      [2, 3],
    ],
    [
      [0, 2],
      [1, 3],
    ],
  ],
  [
    [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
    ],
    [
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
    ],
  ],
];

test.each(transposeMatrixTests)(
  'transposeMatrix(%o) should be %o and vice-versa',
  (input, expected) => {
    const matrix = JSON.parse(JSON.stringify(input));
    transposeMatrixInPlace(matrix);
    expect(matrix).toEqual(expected);
    transposeMatrixInPlace(matrix);
    expect(matrix).toEqual(input);
  }
);

const argMaxTests: [number[], number][] = [
  [[10, 5, 12, 4], 2],
  [[10, 0, 5, 12, 4], 3],
  [[150, 140, 10, 0, 5, 12, 4], 0],
  [[-4], 0],
];

test.each(argMaxTests)('argMax(%o) should be %o', (input, expected) => {
  expect(argmax(input)).toEqual(expected);
});

const inverseTests: [number[][], number[][]][] = [
  [[[1]], [[1]]],
  [
    [
      [1, 0],
      [0, 1],
    ],
    [
      [1, 0],
      [0, 1],
    ],
  ],
  [
    [
      [1, 0, 0],
      [0, 0, 1],
      [0, 1, 0],
    ],
    [
      [1, 0, 0],
      [0, 0, 1],
      [0, 1, 0],
    ],
  ],
  [
    [
      [1, 0, 0],
      [0, -1, 0],
      [0, 0, -1],
    ],
    [
      [1, 0, 0],
      [0, -1, 0],
      [0, 0, -1],
    ],
  ],
  [
    [
      [9, 21, 23, 8, 18, 7, 12, 7],
      [8, 13, 15, 5, 10, 5, 9, 6],
      [0, 13, 11, 2, 13, 1, 3, 0],
      [13, 11, 16, 13, 6, 11, 13, 10],
      [11, 21, 23, 7, 17, 7, 13, 8],
      [10, 8, 12, 9, 4, 8, 10, 8],
      [11, 16, 19, 7, 12, 7, 12, 8],
      [6, 12, 14, 6, 10, 5, 8, 5],
    ],
    [
      [0, 2, -1, 2, 1, -3, -2, 0],
      [-1, 1, 2, -1, -2, 2, 2, -1],
      [2, 1, 1, -1, -5, 1, 4, -2],
      [-2, 4, 0, 2, 0, -3, -2, 2],
      [0, -1, -3, 2, 6, -3, -6, 2],
      [4, -7, 0, -3, 0, 5, 3, -4],
      [-3, -4, 1, -1, 1, 1, 3, 3],
      [0, 3, -2, 1, 4, -1, -7, 1],
    ],
  ],
];

// Normalize the matrix to avoid the test failing because 2.999999 != 3
const normalizeMatrix = (matrix: number[][]) =>
  matrix.map((row) =>
    row.map(Math.round).map((v) => (Object.is(v, -0) ? 0 : v))
  );

test.each(inverseTests)(
  'inverse(%o) should be %o and vice versa',
  (input, expected) => {
    expect(normalizeMatrix(inverse(input))).toEqual(expected);
    expect(normalizeMatrix(inverse(expected))).toEqual(input);
  }
);

const distortTests: [Quadrilateral, string][] = [
  [
    [
      {
        x: 444,
        y: 79,
      },
      {
        x: 624,
        y: 77,
      },
      {
        x: 618,
        y: 327,
      },
      {
        x: 440,
        y: 327,
      },
    ],
    'red.png',
  ],
  [
    [
      {
        x: 180,
        y: 158,
      },
      {
        x: 276,
        y: 161,
      },
      {
        x: 281,
        y: 214,
      },
      {
        x: 203,
        y: 218,
      },
    ],
    'yellow.png',
  ],
  [
    [
      {
        x: 305,
        y: 109,
      },
      {
        x: 401,
        y: 122,
      },
      {
        x: 408,
        y: 230,
      },
      {
        x: 315,
        y: 234,
      },
    ],
    'blue.png',
  ],
];

const baseDistortImage = 'red_blue_yellow.png';
test.each(distortTests)(
  `distortImage(${baseDistortImage}, %o) should be like image stored at %s`,
  (srcCorners, expectedImageFile) => {
    const basePath = path.join(__dirname, '__fixtures__', baseDistortImage);
    const imagePath = path.join(__dirname, '__fixtures__', expectedImageFile);

    const promise = new Promise((resolve, reject) => {
      const readImage = (imgpath: string) => `file://${imgpath}`;

      const newImage = (
        imgpath: string,
        callback: (i: HTMLImageElement) => void
      ) => {
        const image = new Image();
        image.onload = () => callback(image);
        image.onerror = () => {
          reject(
            new Error(`Something went wrong loading image at: ${imgpath}`)
          );
        };
        image.src = readImage(imgpath);

        return image;
      };

      newImage(basePath, (base: HTMLImageElement) => {
        newImage(imagePath, (image: HTMLImageElement) => {
          const baseData: Uint8ClampedArray = imageToImageData(base).data;
          const imgData: Uint8ClampedArray = imageToImageData(image).data;

          const distorted = distortImageRaw(baseData, base, srcCorners);
          // Wrap into uint8clamped array because otherwise it's return as an object instead of an array
          // making the test fail.
          expect(distorted).toEqual(new Uint8ClampedArray(imgData));
          resolve('Finished');
        });
      });
    });

    return promise;
  }
);

// 1 2 3
// 4 5 6
const rotateTestImage: Uint8ClampedArray = Uint8ClampedArray.from([
  1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6,
]);

// 6 5 4
// 3 2 1
const rotateTestImageReversed: Uint8ClampedArray = Uint8ClampedArray.from([
  6, 6, 6, 6, 5, 5, 5, 5, 4, 4, 4, 4, 3, 3, 3, 3, 2, 2, 2, 2, 1, 1, 1, 1,
]);

// 4 1
// 5 2
// 6 3
const rotateTestImageRight: Uint8ClampedArray = Uint8ClampedArray.from([
  4, 4, 4, 4, 1, 1, 1, 1, 5, 5, 5, 5, 2, 2, 2, 2, 6, 6, 6, 6, 3, 3, 3, 3,
]);

// 3 6
// 2 5
// 1 4
const rotateTestImageLeft: Uint8ClampedArray = Uint8ClampedArray.from([
  3, 3, 3, 3, 6, 6, 6, 6, 2, 2, 2, 2, 5, 5, 5, 5, 1, 1, 1, 1, 4, 4, 4, 4,
]);

const rotateImageRawTests: [
  Uint8ClampedArray,
  number,
  number,
  Direction,
  Uint8ClampedArray
][] = [
  // Base
  [rotateTestImage, 3, 2, Direction.Left, rotateTestImageLeft],
  [rotateTestImage, 3, 2, Direction.Right, rotateTestImageRight],
  // Right
  [rotateTestImageRight, 2, 3, Direction.Right, rotateTestImageReversed],
  [rotateTestImageRight, 2, 3, Direction.Left, rotateTestImage],
  // Left
  [rotateTestImageLeft, 2, 3, Direction.Right, rotateTestImage],
  [rotateTestImageLeft, 2, 3, Direction.Left, rotateTestImageReversed],
  // Reversed
  [rotateTestImageReversed, 3, 2, Direction.Right, rotateTestImageLeft],
  [rotateTestImageReversed, 3, 2, Direction.Left, rotateTestImageRight],
];

test.each(rotateImageRawTests)(
  'rotateImageRaw(%o, %o, %o, %o) should be %o',
  (src, width, height, direction, expected) => {
    expect(rotateImageRaw(src, { width, height }, direction)).toEqual(expected);
  }
);

// 4 pixels: 100, 50, 200 / 50, 100, 200 / 200, 50, 100 / 200, 100, 50
const grayscaleTestImage = Uint8ClampedArray.from([
  100, 50, 200, 12, 50, 100, 200, 255, 200, 50, 100, 18, 200, 100, 50, 27,
]);

const grayscaleTestImageOut = Uint8ClampedArray.from([
  71, 71, 71, 12, 97, 97, 97, 255, 86, 86, 86, 18, 118, 118, 118, 27,
]);

const grayscaleTests: [Uint8ClampedArray, Uint8ClampedArray][] = [
  [grayscaleTestImage, grayscaleTestImageOut],
  // Should be idempotent
  [grayscaleTestImageOut, grayscaleTestImageOut],
];

test.each(grayscaleTests)(
  'grayscaleRaw(%o) should be %o',
  (input, expected) => {
    expect(grayscaleRaw(input)).toEqual(expected);
  }
);

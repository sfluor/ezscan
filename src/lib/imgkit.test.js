import {
  Color,
  inverseColor,
  colorToCSS,
  averageColorRaw,
  averageInverseColorRaw,
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
      width,
      height,
      0, // start x
      100, // start y
      sWidth, // width
      sHeight // height
    );
    const computedInverse = averageInverseColorRaw(
      imageData,
      width,
      height,
      0, // start x
      100, // start y
      sWidth, // width
      sHeight // height
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
      width,
      height,
      100, // start x
      0, // start y
      sWidth, // width
      sHeight // height
    );
    const computedInverse = averageInverseColorRaw(
      imageData,
      width,
      height,
      100, // start x
      0, // start y
      sWidth, // width
      sHeight // height
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

import React, { forwardRef, HTMLAttributes, useEffect, useState } from 'react';
import { Size } from './lib/geometry';

// Shamelessly stolen from: https://github.com/mvasin/react-div-100vh/blob/ff4189f041c40a8bbc4adc3571a51c03bf0bb78d/packages/react-div-100vh/src/index.tsx#L1

function isClient() {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

// Once we ended up on the client, the first render must look the same as on
// the server so hydration happens without problems. _Then_ we immediately
// schedule a subsequent update and return the height measured on the client.
// It's not needed for CSR-only apps, but is critical for SSR.
function useWasRenderedOnClientAtLeastOnce() {
  const [wasRenderedOnClientAtLeastOnce, setWasRenderedOnClientAtLeastOnce] =
    useState(false);

  useEffect(() => {
    if (isClient()) {
      setWasRenderedOnClientAtLeastOnce(true);
    }
  }, []);
  return wasRenderedOnClientAtLeastOnce;
}

function measureSize(): Size | null {
  return isClient()
    ? { width: window.innerWidth, height: window.innerHeight }
    : null;
}

export function useFullSize(): Size | null {
  const [size, setSize] = useState<Size | null>(measureSize);

  const wasRenderedOnClientAtLeastOnce = useWasRenderedOnClientAtLeastOnce();

  useEffect(() => {
    if (wasRenderedOnClientAtLeastOnce) {
      return () => {}; //eslint-disable-line
    }

    function setMeasuredSize() {
      const measuredSize = measureSize();
      setSize(measuredSize);
    }

    window.addEventListener('resize', setMeasuredSize);
    return () => {
      window.removeEventListener('resize', setMeasuredSize);
    };
  }, [wasRenderedOnClientAtLeastOnce]);
  return wasRenderedOnClientAtLeastOnce ? size : null;
}

const FullScreenDiv = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ style, ...other }, ref) => {
  const size = useFullSize();

  const styleWithFullSize = {
    ...style,
    height: size ? `${size.height}px` : '100vh',
    width: size ? `${size.width}px` : '100vw',
  };

  return <div ref={ref} style={styleWithFullSize} {...other} />;
});

export default FullScreenDiv;

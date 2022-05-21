import React from 'react';
import { Link } from 'react-router-dom';
import { ImagePair } from './lib/imgkit';
import colors from './colors';

export type NamedImage = ImagePair & { name: string };

function PagesList({
  images,
  onReset,
}: {
  images: Array<NamedImage>;
  onReset: () => void;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '5%',
        justifyContent: 'space-between',
      }}
    >
      {images.map((img) => (
        <div
          style={{
            padding: '5px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <img
            key={img.name}
            src={img.element.src}
            alt={img.name}
            style={{
              maxWidth: '100px',
              maxHeight: '100px',
            }}
          />
          <span style={{ color: colors.primary, paddingLeft: '20px' }}>
            {img.name}
          </span>
        </div>
      ))}
      <Link to="/capture"> Add more </Link>
      <button type="button" onClick={() => onReset()}>
        Reset
      </button>
    </div>
  );
}

export default PagesList;

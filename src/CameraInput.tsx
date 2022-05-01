import React, { useState } from 'react';
import InteractiveCanvas from './InteractiveCanvas';

// Unstyled button component
function Button({ name }: { name: string }) {
  const lowerName = name.toLowerCase();

  return (
    <button
      id={`${lowerName}-btn`}
      type="button"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        border: 'none',
        color: 'inherit',
        cursor: 'pointer',
        padding: 0,
        outline: 'inherit',
        font: 'inherit',
        background: 'none',
      }}
      onClick={() => alert(name)}
    >
      <img
        style={{ height: '3vh' }}
        src={`${process.env.PUBLIC_URL}/icons/${lowerName}.svg`}
        alt={name}
      />
      <span className="menu-label">{name}</span>
    </button>
  );
}

function CameraInput() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const reader = new FileReader();

  reader.onload = () => {
    if (reader.result) {
      const loadedImage = new Image();
      loadedImage.src = reader.result as string;
      setImage(loadedImage);
    }
  };

  return (
    <div>
      <div
        id="container"
        style={{
          width: '100vw',
          height: '90vh',
        }}
      >
        <input
          type="file"
          name="camera"
          id="camera"
          accept="image/*"
          onChange={(event) => {
            if (event.target.files) {
              reader.readAsDataURL(event.target.files[0]);
            }
          }}
          style={{
            height: '5vh',
          }}
        />
        {image && (
          <InteractiveCanvas
            widthPercentage={100}
            heightPercentage={85}
            image={image}
          />
        )}
      </div>
      <footer id="footer" style={{ height: '10vh' }}>
        <Button name="Back" />
        <Button name="Crop" />
        <Button name="Next" />
      </footer>
    </div>
  );
}

export default CameraInput;

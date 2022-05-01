import React, { useState } from 'react';
import InteractiveCanvas from './InteractiveCanvas';

// Unstyled button component
function Button({ name, action }) {
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
      onClick={action}
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
  const [image, setImage] = useState(null);
  const reader = new FileReader();

  reader.onload = () => {
    const loadedImage = new Image();
    loadedImage.src = reader.result;
    setImage(loadedImage);
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
          capture="camera"
          onChange={(event) => {
            reader.readAsDataURL(event.target.files[0]);
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
        <Button name="Back" action={() => alert('Back')} />
        <Button name="Crop" action={() => alert('Crop')} />
        <Button name="Next" action={() => alert('Next')} />
      </footer>
    </div>
  );
}

export default CameraInput;

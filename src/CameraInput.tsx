import React, { useState } from 'react';
import { ReactComponent as Crop } from '@material-design-icons/svg/round/crop.svg';
import { ReactComponent as RotateLeft } from '@material-design-icons/svg/round/rotate_left.svg';
import { ReactComponent as RotateRight } from '@material-design-icons/svg/round/rotate_right.svg';
import { ReactComponent as Camera } from '@material-design-icons/svg/round/camera.svg';
import FullScreenDiv from './FullScreenDiv';
import InteractiveCanvas from './InteractiveCanvas';
import {
  ImagePair,
  distortImage,
  imageToImageData,
  openImageInNewTab,
  rotateImage,
  Direction,
} from './lib/imgkit';
import { Quadrilateral } from './lib/geometry';

// For icons: https://marella.me/material-design-icons/demo/svg/

// TODO: move colors to file
const primaryColor = '#232946';
const secondaryColor = 'white';

const buttonStyle: React.CSSProperties = {
  alignItems: 'center',
  background: 'none',
  border: 'none',
  color: 'inherit',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  font: 'inherit',
  justifyContent: 'center',
  lineHeight: '3vh',
  outline: 'inherit',
  padding: '1vh 2vh',
  textAlign: 'center',
  animationName: 'slideLeft,fadeIn',
  animationDuration: '500ms',
};

function LandingDocumentation() {
  return (
    <div style={{ color: primaryColor }}>
      <h2>Welcome on ezscan</h2>
      <div>
        To start scanning stuff hit the <b>Load</b> button below !
      </div>
    </div>
  );
}

function FileInput({
  onChange,
}: {
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}) {
  return (
    <label htmlFor="camera" style={buttonStyle}>
      <input
        type="file"
        name="camera"
        id="camera"
        accept="image/*"
        onChange={onChange}
        style={{ display: 'none' }}
      />
      <Camera color={secondaryColor} />
      <span>Load</span>
    </label>
  );
}

// Unstyled button component
function Button({
  name,
  action,
  children,
}: {
  name: string;
  children: React.ReactNode;
  action: () => void;
}) {
  const lowerName = name.toLowerCase().replace(' ', '_');

  return (
    <button
      id={`${lowerName}-btn`}
      type="button"
      style={buttonStyle}
      onClick={action}
      onKeyDown={action}
    >
      {children}
      <span>{name}</span>
    </button>
  );
}

function CameraInput() {
  const [image, setImage] = useState<ImagePair | null>(null);
  const [corners, setCorners] = useState<Quadrilateral | null>(null);
  const reader = new FileReader();

  // TODO: show loading
  reader.onload = () => {
    if (reader.result) {
      const loadedImage = new Image();
      loadedImage.addEventListener('load', () => {
        setImage({
          element: loadedImage,
          data: imageToImageData(loadedImage),
        });
      });

      loadedImage.src = reader.result as string;
    }
  };

  const onCrop = () => {
    // TODO: use a web worker
    openImageInNewTab(
      distortImage((image as ImagePair).data, corners as Quadrilateral)
    );
  };

  const onRotate = (direction: Direction) => {
    rotateImage(image as ImagePair, direction, setImage);
  };

  return (
    <FullScreenDiv style={{ display: 'flex', flexDirection: 'column' }}>
      <div
        id="container"
        style={{
          width: '100%',
          height: '90%',
        }}
      >
        {image ? (
          <InteractiveCanvas
            sizePct={{ width: 100, height: 85 }}
            onCornersChange={setCorners}
            style={{
              animationName: 'fadeIn',
              animationDuration: '500ms',
            }}
            image={image}
          />
        ) : (
          <LandingDocumentation />
        )}
      </div>
      <footer
        style={{
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
          width: '100%',
          backgroundColor: primaryColor,
          height: '10%',
          alignItems: 'center',
        }}
      >
        <FileInput
          onChange={(event) => {
            if (event.target.files) {
              reader.readAsDataURL(event.target.files[0]);
            }
          }}
        />
        {image && (
          <Button name="Rotate left" action={() => onRotate(Direction.Left)}>
            <RotateLeft color={secondaryColor} />
          </Button>
        )}
        {image && (
          <Button name="Rotate right" action={() => onRotate(Direction.Right)}>
            <RotateRight color={secondaryColor} />
          </Button>
        )}
        {image && (
          <Button name="Crop" action={onCrop}>
            <Crop color={secondaryColor} />
          </Button>
        )}
      </footer>
    </FullScreenDiv>
  );
}

export default CameraInput;

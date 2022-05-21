import React, { useState } from 'react';
import { ReactComponent as Crop } from '@material-design-icons/svg/round/crop.svg';
import { ReactComponent as RotateLeft } from '@material-design-icons/svg/round/rotate_left.svg';
import { ReactComponent as RotateRight } from '@material-design-icons/svg/round/rotate_right.svg';
import { ReactComponent as Camera } from '@material-design-icons/svg/round/camera.svg';
import { ReactComponent as ArrowBack } from '@material-design-icons/svg/round/arrow_back.svg';
import { ReactComponent as ArrowForward } from '@material-design-icons/svg/round/arrow_forward.svg';
import FullScreenDiv from './FullScreenDiv';
import InteractiveCanvas from './InteractiveCanvas';
import {
  ImagePair,
  distortImage,
  imageToImageData,
  imageDataToImage,
  openImageInNewTab,
  rotateImage,
  Direction,
} from './lib/imgkit';
import { Quadrilateral } from './lib/geometry';
import colors from './colors';

// For icons: https://marella.me/material-design-icons/demo/svg/

// TODO: move colors to file
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
    <div style={{ color: colors.primary }}>
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
      <Camera color={colors.secondary} />
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
  const [images, setImages] = useState<Array<ImagePair>>([]);
  const [corners, setCorners] = useState<Quadrilateral | null>(null);
  const reader = new FileReader();

  // TODO: show loading
  reader.onload = () => {
    if (reader.result) {
      const loadedImage = new Image();
      loadedImage.addEventListener('load', () => {
        setImages([
          {
            element: loadedImage,
            data: imageToImageData(loadedImage),
          },
        ]);
      });

      loadedImage.src = reader.result as string;
    }
  };

  const imageIsLoaded = images.length > 0;
  const currentImage = imageIsLoaded ? images[images.length - 1] : null;

  const onCrop = () => {
    // TODO: use a web worker
    const distorted = distortImage(
      (currentImage as ImagePair).data,
      corners as Quadrilateral
    );
    const htmlImage = new Image();
    htmlImage.addEventListener('load', () => {
      setImages([...images, { element: htmlImage, data: distorted }]);
    });

    htmlImage.src = imageDataToImage(distorted);
  };

  const onPrevious = () => {
    setImages(images.slice(0, -1) || []);
  };

  const onNext = () => {
    openImageInNewTab((currentImage as ImagePair).data);
  };

  const onRotate = (direction: Direction) => {
    rotateImage(currentImage as ImagePair, direction, (rotated) =>
      setImages([...images, rotated])
    );
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
        {imageIsLoaded ? (
          <InteractiveCanvas
            sizePct={{ width: 100, height: 85 }}
            onCornersChange={setCorners}
            style={{
              animationName: 'fadeIn',
              animationDuration: '500ms',
            }}
            image={currentImage as ImagePair}
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
          backgroundColor: colors.primary,
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
        {imageIsLoaded && (
          <Button name="Previous" action={onPrevious}>
            <ArrowBack color={colors.secondary} />
          </Button>
        )}
        {imageIsLoaded && (
          <Button name="Rotate left" action={() => onRotate(Direction.Left)}>
            <RotateLeft color={colors.secondary} />
          </Button>
        )}
        {imageIsLoaded && (
          <Button name="Rotate right" action={() => onRotate(Direction.Right)}>
            <RotateRight color={colors.secondary} />
          </Button>
        )}
        {imageIsLoaded && (
          <Button name="Crop" action={onCrop}>
            <Crop color={colors.secondary} />
          </Button>
        )}
        {imageIsLoaded && (
          <Button name="Next" action={onNext}>
            <ArrowForward color={colors.secondary} />
          </Button>
        )}
      </footer>
    </FullScreenDiv>
  );
}

export default CameraInput;

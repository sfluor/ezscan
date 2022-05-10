import React, { useState } from 'react';
import { ReactComponent as Crop } from '@material-design-icons/svg/round/crop.svg';
import { ReactComponent as RotateLeft } from '@material-design-icons/svg/round/rotate_left.svg';
import { ReactComponent as RotateRight } from '@material-design-icons/svg/round/rotate_right.svg';
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
      style={{
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
      }}
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
    <FullScreenDiv>
      <div
        id="container"
        style={{
          width: '100%',
          height: '90%',
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
            height: '5%',
          }}
        />
        {image && (
          <InteractiveCanvas
            sizePct={{ width: 100, height: 85 }}
            onCornersChange={setCorners}
            image={image}
          />
        )}
      </div>
      <footer
        style={{
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
          width: '100%',
          backgroundColor: '#232946',
          height: '10%',
          alignItems: 'center',
        }}
      >
        {image && (
          <Button name="Rotate left" action={() => onRotate(Direction.Left)}>
            <RotateLeft color="white" />
          </Button>
        )}
        {image && (
          <Button name="Crop" action={onCrop}>
            <Crop color="white" />
          </Button>
        )}
        {image && (
          <Button name="Rotate right" action={() => onRotate(Direction.Right)}>
            <RotateRight color="white" />
          </Button>
        )}
      </footer>
    </FullScreenDiv>
  );
}

export default CameraInput;

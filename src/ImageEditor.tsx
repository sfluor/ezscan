import React, { useState } from 'react';
import { ReactComponent as Crop } from '@material-design-icons/svg/round/crop.svg';
import { ReactComponent as RotateLeft } from '@material-design-icons/svg/round/rotate_left.svg';
import { ReactComponent as RotateRight } from '@material-design-icons/svg/round/rotate_right.svg';
import { ReactComponent as Camera } from '@material-design-icons/svg/round/camera.svg';
import { ReactComponent as ArrowBack } from '@material-design-icons/svg/round/arrow_back.svg';
import { ReactComponent as ArrowForward } from '@material-design-icons/svg/round/arrow_forward.svg';
import InteractiveCanvas from './InteractiveCanvas';
import {
  ImagePair,
  distortImage,
  imageToImageData,
  imageDataToImage,
  rotateImage,
  Direction,
} from './lib/imgkit';
import { Quadrilateral } from './lib/geometry';
import Footer from './Footer';
import FooterButton, { footerButtonStyle } from './FooterButton';
import colors from './colors';

// For icons: https://marella.me/material-design-icons/demo/svg/

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
    <label htmlFor="camera" style={footerButtonStyle}>
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

function ImageEditor({ onAdd }: { onAdd: (pair: ImagePair) => void }) {
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

  const onNext = () => onAdd(currentImage as ImagePair);

  const onRotate = (direction: Direction) => {
    rotateImage(currentImage as ImagePair, direction, (rotated) =>
      setImages([...images, rotated])
    );
  };

  return (
    <>
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
      <Footer>
        <FileInput
          onChange={(event) => {
            if (event.target.files) {
              reader.readAsDataURL(event.target.files[0]);
            }
          }}
        />
        {imageIsLoaded && (
          <>
            <FooterButton name="Previous" action={onPrevious}>
              <ArrowBack color={colors.secondary} />
            </FooterButton>
            <FooterButton
              name="Rotate left"
              action={() => onRotate(Direction.Left)}
            >
              <RotateLeft color={colors.secondary} />
            </FooterButton>
            <FooterButton
              name="Rotate right"
              action={() => onRotate(Direction.Right)}
            >
              <RotateRight color={colors.secondary} />
            </FooterButton>
            <FooterButton name="Crop" action={onCrop}>
              <Crop color={colors.secondary} />
            </FooterButton>
            <FooterButton name="Next" action={onNext}>
              <ArrowForward color={colors.secondary} />
            </FooterButton>
          </>
        )}
      </Footer>
    </>
  );
}

export default ImageEditor;

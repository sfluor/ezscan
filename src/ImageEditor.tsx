import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as Crop } from '@material-design-icons/svg/round/crop.svg';
import { ReactComponent as RotateLeft } from '@material-design-icons/svg/round/rotate_90_degrees_ccw.svg';
import { ReactComponent as RotateRight } from '@material-design-icons/svg/round/rotate_90_degrees_cw.svg';
import { ReactComponent as Camera } from '@material-design-icons/svg/round/camera_alt.svg';
import { ReactComponent as ArrowBack } from '@material-design-icons/svg/round/arrow_back.svg';
import { ReactComponent as ArrowForward } from '@material-design-icons/svg/round/arrow_forward.svg';
import { ReactComponent as Undo } from '@material-design-icons/svg/round/undo.svg';
import { ReactComponent as Grayscale } from '@material-design-icons/svg/round/format_color_reset.svg';
import InteractiveCanvas from './InteractiveCanvas';
import {
  ImagePair,
  imageToImageData,
  imageDataToImage,
  Direction,
} from './lib/imgkit';
import { Quadrilateral } from './lib/geometry';
import Footer from './Footer';
import FooterButton from './FooterButton';
import routes from './routes';
import { typography as typo } from './language';
import ImageProcessor from './lib/workers/image_processor';
import Loader from './Loader';

function FileInput({
  triggerUpload,
  inputElement,
}: {
  triggerUpload: () => void;
  inputElement: React.ReactElement;
}) {
  return (
    <>
      <FooterButton
        name={typo.actions.scan}
        icon={<Camera />}
        action={triggerUpload}
      />
      {inputElement}
    </>
  );
}

function ImageEditor({ onAdd }: { onAdd: (pair: ImagePair) => void }) {
  const [images, setImages] = useState<Array<ImagePair>>([]);
  const [corners, setCorners] = useState<Quadrilateral | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  const inputRef = useRef<HTMLInputElement | null>(null);
  const triggerUpload = () => {
    if (inputRef.current !== null) {
      inputRef.current.click();
    }
  };
  const inputElement = (
    <input
      type="file"
      ref={inputRef}
      hidden
      name="camera"
      id="camera"
      accept="image/*"
      onChange={(event) => {
        if (event.target.files) {
          reader.readAsDataURL(event.target.files[0]);
        }
      }}
      style={{ display: 'none' }}
    />
  );

  const imageIsLoaded = images.length > 0;
  const hasMoreThanOneImage = images.length > 1;
  const currentImage = imageIsLoaded ? images[images.length - 1] : null;

  // If we don't have an image loaded already trigger an upload
  useEffect(() => {
    if (!imageIsLoaded) {
      triggerUpload();
    }
  }, []);

  const onProcessed = (data: ImageData) => {
    const htmlImage = new Image();

    htmlImage.addEventListener('load', () => {
      setImages([...images, { element: htmlImage, data }]);
      setIsLoading(false);
    });

    htmlImage.src = imageDataToImage(data);
  };

  const processor = new ImageProcessor({ onProcessed });

  const onCrop = () => {
    setIsLoading(true);
    processor.distort(
      (currentImage as ImagePair).data,
      corners as Quadrilateral
    );
  };

  const onRotate = (direction: Direction) => {
    setIsLoading(true);
    processor.rotate((currentImage as ImagePair).data, direction);
  };

  const onGrayscale = () => {
    setIsLoading(true);
    processor.grayscale((currentImage as ImagePair).data);
  };

  const onUndo = () => {
    setImages(images.slice(0, -1) || []);
  };

  const onNext = () => onAdd(currentImage as ImagePair);

  const navigate = useNavigate();

  let component;
  if (isLoading) {
    component = <Loader />;
  } else if (imageIsLoaded) {
    component = (
      <InteractiveCanvas
        sizePct={{ width: 100, height: 85 }}
        onCornersChange={setCorners}
        style={{
          animationName: 'fadeIn',
          animationDuration: '500ms',
        }}
        image={currentImage as ImagePair}
      />
    );
  } else {
    component = null;
  }

  return (
    <>
      <div
        id="container"
        style={{
          width: '100%',
          height: '90%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {component}
      </div>
      <Footer>
        {!imageIsLoaded && (
          <FileInput
            inputElement={inputElement}
            triggerUpload={triggerUpload}
          />
        )}
        {imageIsLoaded && (
          <>
            {hasMoreThanOneImage ? (
              <FooterButton
                name={typo.actions.undo}
                action={onUndo}
                icon={<Undo />}
              />
            ) : (
              <FooterButton
                name={typo.actions.back}
                action={() => navigate(routes.home)}
                icon={<ArrowBack />}
              />
            )}
            <FooterButton
              name={typo.actions.rotateLeft}
              action={() => onRotate(Direction.Left)}
              icon={<RotateLeft />}
            />
            <FooterButton
              name={typo.actions.rotateRight}
              action={() => onRotate(Direction.Right)}
              icon={<RotateRight />}
            />
            <FooterButton
              name={typo.actions.grayscale}
              action={onGrayscale}
              icon={<Grayscale />}
            />
            <FooterButton
              name={typo.actions.crop}
              action={onCrop}
              icon={<Crop />}
            />
            <FooterButton
              name={typo.actions.next}
              action={onNext}
              icon={<ArrowForward />}
            />
          </>
        )}
      </Footer>
    </>
  );
}

export default ImageEditor;

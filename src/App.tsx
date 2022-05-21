import React, { useState } from 'react';

import './App.css';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
// TODO: rename camera input
import CameraInput from './CameraInput';
import ImagesList, { NamedImage } from './ImagesList';

function App() {
  const [images, setImages] = useState<Array<NamedImage>>([]);
  const [count, setCount] = useState<number>(1);

  const navigate = useNavigate();

  const onReset = () => {
    setImages([]);
    navigate('/', { replace: true });
  };

  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <Link to="/capture">Start capturing</Link>
            </div>
          }
        />
        <Route
          path="/capture"
          element={
            <CameraInput
              onAdd={(image) => {
                const newImages = [
                  ...images,
                  { ...image, name: `image-${count}` },
                ];
                setCount(count + 1);
                setImages(newImages);
                navigate('/pages', { replace: true });
              }}
            />
          }
        />
        <Route
          path="/pages"
          element={
            <ImagesList
              images={images}
              onReset={onReset}
              setImages={setImages}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;

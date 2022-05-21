import React, { useState } from 'react';

import './App.css';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
// TODO: rename camera input
import CameraInput from './CameraInput';
import PagesList, { NamedImage } from './PagesList';

function App() {
  const [images, setImages] = useState<Array<NamedImage>>([]);

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
                  { ...image, name: `image-${images.length + 1}` },
                ];
                setImages(newImages);
                navigate('/pages', { replace: true });
              }}
            />
          }
        />
        <Route
          path="/pages"
          element={<PagesList images={images} onReset={onReset} />}
        />
      </Routes>
    </div>
  );
}

export default App;

import React, { useState } from 'react';

import './App.css';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
// TODO: rename camera input
import ImageEditor from './ImageEditor';
import ImagesList, { NamedImage } from './ImagesList';
import FullScreenDiv from './FullScreenDiv';
import colors from './colors';

function App() {
  const [images, setImages] = useState<Array<NamedImage>>([]);
  const [count, setCount] = useState<number>(1);

  const navigate = useNavigate();

  const onReset = () => {
    setImages([]);
    setCount(1);
    navigate('/', { replace: true });
  };

  return (
    <FullScreenDiv
      style={{
        display: 'flex',
        flexDirection: 'column',
        color: colors.secondary,
        backgroundColor: colors.primary,
      }}
    >
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
            <ImageEditor
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
    </FullScreenDiv>
  );
}

export default App;

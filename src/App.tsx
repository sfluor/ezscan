import React, { useState } from 'react';

import './App.css';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
// TODO: rename camera input
import ImageEditor from './ImageEditor';
import ImagesList from './ImagesList';
import { NamedImage } from './lib/imgkit';
import LandingPage from './LandingPage';
import FullScreenDiv from './FullScreenDiv';
import colors from './colors';
import routes from './routes';

function App() {
  const [images, setImages] = useState<Array<NamedImage>>([]);
  const [count, setCount] = useState<number>(1);

  const navigate = useNavigate();

  const onReset = () => {
    setImages([]);
    setCount(1);
    navigate(routes.home, { replace: true });
  };

  return (
    <FullScreenDiv
      style={{
        display: 'flex',
        flexDirection: 'column',
        color: colors.tertiary,
        backgroundColor: colors.lightPrimary,
      }}
    >
      <Routes>
        <Route path={routes.home} element={<LandingPage />} />
        <Route
          path={routes.editor}
          element={
            <ImageEditor
              onAdd={(image) => {
                const newImages = [
                  ...images,
                  { ...image, name: `Scan ${count}` },
                ];
                setCount(count + 1);
                setImages(newImages);
                navigate(routes.list);
              }}
            />
          }
        />
        <Route
          path={routes.list}
          element={
            <ImagesList
              images={images}
              onReset={onReset}
              setImages={setImages}
            />
          }
        />
        <Route path="*" element={<Navigate to={routes.home} replace />} />
      </Routes>
    </FullScreenDiv>
  );
}

export default App;

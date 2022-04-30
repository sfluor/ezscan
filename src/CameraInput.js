import React, { useState } from 'react';
import Canvas from './Canvas';

const Button = ({ name, action }) => {
    const lowerName = name.toLowerCase();

    return (<a id={`${lowerName}-btn`} className="menu-button" onClick={action}>
      <img
        className="menu-icon"
        src={`${process.env.PUBLIC_URL}/icons/${lowerName}.svg`}
        alt={name}
      />
      <span className="menu-label">{name}</span>
    </a>)
}



const CameraInput = () => {
  const [image, setImage] = useState(null);
  const reader = new FileReader();
    reader.onload = function(event) {
        console.log("done loading")
        const image = new Image();
        image.src = reader.result;
        setImage(image);
    };


  return (
    <div>
      <div id="container">
        <input
          type="file"
          name="camera"
          id="camera"
          accept="image/*"
          capture="camera"
            onChange={event => {
                reader.readAsDataURL(event.target.files[0]);
            }}
        />
          <Canvas image={image} />
        <label id="camera-label" htmlFor="camera"></label>
        <img className="main-icon" src="icons/camera.svg" />
      </div>
      <footer id="footer">
          <Button name="Back" action={() => alert("Back")} />
          <Button name="Crop" action={() => alert("Crop")} />
          <Button name="Next" action={() => alert("Next")} />
      </footer>
    </div>
  );
}

export default CameraInput;

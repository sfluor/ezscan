import "./App.css";

function App() {
  return (
    <div>
      <div id="container"></div>
      <footer id="footer">
        <a id="back-btn" class="menu-button">
          <img
            class="menu-icon"
            src={process.env.PUBLIC_URL + "icons/back.svg"}
            alt="back"
          />
          <span class="menu-label">Back</span>
        </a>
        <a id="crop-btn" class="menu-button">
          <img
            class="menu-icon"
            src={process.env.PUBLIC_URL + "icons/crop.svg"}
            alt="crop"
          />
          <span class="menu-label">Crop</span>
        </a>
        <a id="next-btn" class="menu-button">
          <img
            class="menu-icon"
            src={process.env.PUBLIC_URL + "icons/next.svg"}
            alt="next"
          />
          <span class="menu-label">Next</span>
        </a>
      </footer>
      <div id="loader">
        <img
          class="loader-icon"
          src={process.env.PUBLIC_URL + "icons/cog.svg"}
          alt="loading"
        />
        <span class="loader-desc">Loading...</span>
      </div>
      {/*
    <!-- Hidden ugly file input that will be reached by a label tag -->
    <!-- TODO remove capture=camera to allow gallery files -->
        */}
      <input
        type="file"
        name="camera"
        id="camera"
        accept="image/*"
        capture="camera"
      />
    </div>
  );
}

export default App;

import Background from "./components/Background";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import UploadSection from "./components/UploadSection";
import { Routes, Route } from "react-router-dom";
import StoryboardViewer from "./pages/StoryboardViewer";
import { useState } from "react";

function App() {
  const [storyboard, setStoryboard] = useState(null);
  return (
    <Routes>

      <Route
        path="/"
        element={
          <>
            <Background />
            <Navbar />
            <Hero />
            <UploadSection setStoryboard={setStoryboard} />
          </>
        }
      />

      <Route
        path="/viewer"
        element={<StoryboardViewer storyboard={storyboard} />}
      />

    </Routes>
  );
}

export default App;
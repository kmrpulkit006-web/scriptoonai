import "../styles/StoryboardViewer.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";



function StoryboardViewer({ storyboard }) {
    const navigate = useNavigate();
    if (!storyboard) {
        return <div style={{ color: "white", padding: "40px" }}>No storyboard found</div>;
    }
    const [currentScene, setCurrentScene] = useState(0);

    return (

        <div className="viewer">

            <aside className="sidebar">
                <button
                    className="back-btn"
                    onClick={() => navigate("/")}
                >
                    ← Back
                </button>

                <h2>NarraFrame</h2>

                {storyboard.scenes.map((scene, index) => (
                    <div
                        key={scene.id}
                        className={`scene ${currentScene === index ? "active" : ""}`}
                        onClick={() => setCurrentScene(index)}
                    >
                        🎬 {scene.title}
                    </div>
                ))}

            </aside>

            <main className="workspace">

                <div className="topbar">

                    <div>

                        <h1>Project: {storyboard.project}</h1>

                        <p>4 Scenes • Generated just now</p>

                    </div>

                    <button className="export-btn">
                        Export PDF
                    </button>

                </div>

                <motion.div
                    className="canvas"
                    key={currentScene}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                >

                    <div className="storyboard-frame">

                        <div className="frame-image">
                            🎨
                        </div>

                        <div className="frame-info">
                            <h3>{storyboard.scenes[currentScene].title}</h3>
                            <p>{storyboard.scenes[currentScene].description}</p>
                        </div>

                    </div>

                </motion.div>

                <motion.div
                    className="details"
                    key={`details-${currentScene}`}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35 }}
                >

                    <div className="card">

                        <h3>Scene Description</h3>

                        <p>{storyboard.scenes[currentScene].description}</p>

                        <div className="scene-meta">

                            <span>🎥 {storyboard.scenes[currentScene].camera}</span>

                            <span>🌙 {storyboard.scenes[currentScene].mood}</span>

                        </div>

                    </div>

                    <div className="card">

                        <h3>Characters</h3>

                        <ul>
                            {storyboard.scenes[currentScene].characters.map((character) => (
                                <li key={character}>👤 {character}</li>
                            ))}
                        </ul>

                    </div>

                </motion.div>

            </main>

        </div>

    );

}

export default StoryboardViewer;
import React, { useState, useRef } from 'react';
import Character from './Character';
import Sparkles from './Sparkles';
import EmotionDisplay from './EmotionDisplay';
import '../styles/Canvas.css';


const InteractiveCanvas = () => {
  const [characterPos, setCharacterPos] = useState({ x: 400, y: 300 });
  const [sparkles, setSparkles] = useState(null);
  const [emotion, setEmotion] = useState('happy');
  const [isMoving, setIsMoving] = useState(false);
  const canvasRef = useRef(null);

 const handleCanvasClick = (e) => {
  const rect = canvasRef.current.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const clickY = e.clientY - rect.top;


    setCharacterPos({ 
    x: e.clientX - rect.left - 60, // half of the 120px width
    y: e.clientY - rect.top - 80   // roughly half the height
    });  
  setSparkles({ x: clickX, y: clickY });
  setIsMoving(true);

  setTimeout(() => {
    setIsMoving(false);
  }, 800);
};

  return (
    <div className="canvas-container" ref={canvasRef} onClick={handleCanvasClick}>
      <div className="background-grid"></div>

      {/* Pass isMoving to the Character */}
      <Character 
        position={characterPos} 
        emotion={emotion} 
        isMoving={isMoving} 
      />

      {sparkles && <Sparkles position={sparkles} count={12} />}
      <EmotionDisplay emotion={emotion} />

      <div className="instructions">
        Click anywhere to move Melody! 💕
      </div>
    </div>
  );
};
export default InteractiveCanvas;
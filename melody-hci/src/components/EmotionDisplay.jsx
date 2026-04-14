import React from 'react';
import { motion } from 'framer-motion';

const EmotionDisplay = ({ emotion }) => {
  const emotionMessages = {
    happy: '🎀 Happy!',
    excited: '✨ Excited!',
    walking: '🚶 Moving...',
    idle: '💭 Thinking...'
  };

  return (
    <motion.div
      className="emotion-display"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'absolute',
        top: 30,
        right: 30,
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#FF1493',
        padding: '10px 20px',
        background: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '20px',
        backdropFilter: 'blur(10px)',
      }}
    >
      {emotionMessages[emotion]}
    </motion.div>
  );
};

export default EmotionDisplay;
import React from 'react';
import { motion } from 'framer-motion';
// Use the relative path from Character.js to your assests folder
import melodyImg from '../assests/mymelody.png'; 
import '../styles/Character.css';

const Character = ({ position, isMoving }) => {
  return (
    <motion.div
      className="character-container"
      animate={{
        x: position.x,
        y: position.y,
      }}
      transition={{
        type: 'spring',
        stiffness: 100,
        damping: 20
      }}
      style={{ 
        position: 'absolute', 
        left: 0, 
        top: 0,
        zIndex: 10,
        pointerEvents: 'none'
      }}
    >
      <motion.img 
        src={melodyImg} 
        alt="My Melody" 
        // Animate the bounce on the image only when moving
        animate={isMoving ? {
          rotate: [0, -8, 8, 0],
          y: [0, -10, 0] 
        } : { rotate: 0, y: 0 }}
        transition={{
          repeat: Infinity,
          duration: 0.2
        }}
        style={{ 
          width: '120px', 
          height: 'auto',
          display: 'block',
          /* BLEND FIX: Removes the white background from the JPEG */
          mixBlendMode: 'multiply' 
        }}
      />
    </motion.div>
  );
};
export default Character;
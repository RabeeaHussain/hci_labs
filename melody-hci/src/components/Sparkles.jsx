import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import '../styles/Sparkles.css';

const Sparkles = ({ position, count = 8 }) => {
  const [sparkles, setSparkles] = useState([]);

  useEffect(() => {
    const newSparkles = Array.from({ length: count }).map((_, i) => ({
      id: Math.random(),
      angle: (360 / count) * i + Math.random() * 20,
      delay: i * 0.05,
    }));
    setSparkles(newSparkles);
  }, [position, count]);

  return (
    <>
      {sparkles.map(sparkle => {
        const radians = (sparkle.angle * Math.PI) / 180;
        const distance = 60;
        const endX = Math.cos(radians) * distance;
        const endY = Math.sin(radians) * distance;

        return (
          <motion.div
            key={sparkle.id}
            className="sparkle"
            initial={{
              x: position.x,
              y: position.y,
              opacity: 1,
              scale: 1
            }}
            animate={{
              x: position.x + endX,
              y: position.y + endY,
              opacity: 0,
              scale: 0
            }}
            transition={{
              duration: 0.8,
              delay: sparkle.delay,
              ease: 'easeOut'
            }}
          >
            ✨
          </motion.div>
        );
      })}
    </>
  );
};

export default Sparkles;
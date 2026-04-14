import React from 'https://esm.sh/react@19.2.5';
import ReactDOM from 'https://esm.sh/react-dom@19.2.5/client';

const { useEffect, useRef, useState } = React;

const lerp = (a, b, t) => a + (b - a) * t;

const createNodes = (count, width, height) =>
  Array.from({ length: count }, (_, index) => ({
    x: width * 0.5,
    y: height * 0.5,
    radius: 8 + index * 1.8,
    speed: 0.05 + index * 0.005,
    phase: Math.random() * Math.PI * 2,
    hueOffset: index * 15,
  }));

function App() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const targetRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const nodesRef = useRef([]);
  const pulsesRef = useRef([]);
  
  const [ease, setEase] = useState(0.1);
  const [count, setCount] = useState(15);
  const [glow, setGlow] = useState(true);
  const [palette, setPalette] = useState('modern');

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      nodesRef.current = createNodes(count, canvas.width, canvas.height);
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Render Pulses (Ripples)
      pulsesRef.current = pulsesRef.current.filter((p) => {
        p.radius += 3;
        p.alpha -= 0.02;
        if (p.alpha <= 0) return false;
        ctx.strokeStyle = `rgba(59, 130, 246, ${p.alpha})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.stroke();
        return true;
      });

      // Render Swarm
      nodesRef.current.forEach((node) => {
        const tX = targetRef.current.x + Math.sin(node.phase) * 20;
        const tY = targetRef.current.y + Math.cos(node.phase) * 20;
        
        node.x = lerp(node.x, tX, ease * node.speed * 7);
        node.y = lerp(node.y, tY, ease * node.speed * 7);
        node.phase += 0.015;

        const hue = palette === 'modern' ? (210 + node.hueOffset / 10) : (node.hueOffset % 360);
        const color = `hsla(${hue}, 70%, 50%, 0.6)`;

        ctx.shadowColor = glow ? color : 'transparent';
        ctx.shadowBlur = glow ? 20 : 0;
        ctx.fillStyle = color;
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(render);
    };

    window.addEventListener('resize', resize);
    resize();
    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [ease, count, glow, palette]);

  const handlePointer = (e) => {
    targetRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleClick = (e) => {
    pulsesRef.current.push({ x: e.clientX, y: e.clientY, radius: 0, alpha: 0.6 });
  };

  return React.createElement('div', { 
    style: { width: '100%', height: '100%' },
    onMouseMove: handlePointer,
    onClick: handleClick 
  }, 
    React.createElement('canvas', { ref: canvasRef }),
    React.createElement('div', { className: 'panel' },
      React.createElement('h1', null, 'Motion Lab'),
      React.createElement('p', null, 'Fluid interpolation experiments .'),
      
      React.createElement('div', { className: 'control' },
        React.createElement('label', null, 
          React.createElement('span', null, 'Viscosity'),
          React.createElement('span', null, ease.toFixed(2))
        ),
        React.createElement('input', { 
          type: 'range', min: '0.02', max: '0.3', step: '0.01', value: ease, 
          onChange: (e) => setEase(parseFloat(e.target.value)) 
        })
      ),

      React.createElement('div', { className: 'control' },
        React.createElement('label', null, 
          React.createElement('span', null, 'Density'),
          React.createElement('span', null, count)
        ),
        React.createElement('input', { 
          type: 'range', min: '5', max: '40', step: '1', value: count, 
          onChange: (e) => setCount(parseInt(e.target.value)) 
        })
      ),

      React.createElement('div', { className: 'actions' },
        React.createElement('button', { onClick: () => setGlow(!glow) }, glow ? 'Flat' : 'Glow'),
        React.createElement('button', { onClick: () => setPalette(p => p === 'modern' ? 'vivid' : 'modern') }, 'Palette')
      )
    ),
    React.createElement('div', { className: 'hint' }, 'Interact with the canvas to see physics in motion.')
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
# Three.js Rotating Cube Setup

This project demonstrates a basic setup of Three.js to display a 3D rotating cube.

## Project Structure

```
threejs-rotating-cube/
├── index.html          # Main HTML file with Three.js code
└── README.md           # This documentation file
```

## Setup Instructions

1. **Create a new folder**: Inside your HCI folder, create a new directory named `threejs-rotating-cube`.

2. **Create index.html**: Copy the provided HTML code into `index.html` in the new folder.

3. **Open in browser**: Open `index.html` in a web browser to view the rotating cube.

## Code Explanation

### HTML Structure
- Basic HTML5 document with a title and viewport meta tag.
- CSS to remove margins and hide overflow for full-screen display.

### Three.js Setup
- **Scene**: The root object that contains all objects, lights, and cameras.
- **Camera**: PerspectiveCamera with 75° field of view, aspect ratio based on window size, near and far clipping planes.
- **Renderer**: WebGLRenderer that renders the scene using WebGL.

### Cube Creation
- **Geometry**: BoxGeometry creates a cube shape.
- **Material**: MeshBasicMaterial with green color (0x00ff00).
- **Mesh**: Combines geometry and material into a renderable object, added to the scene.

### Animation
- **animate() function**: Uses requestAnimationFrame for smooth animation.
- Rotates the cube on both X and Y axes by 0.01 radians per frame.
- Renders the scene with the camera.

### Responsiveness
- Window resize event listener updates camera aspect ratio and renderer size.

## Dependencies

- Three.js library loaded from CDN: https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js

## Running the Project

Simply open `index.html` in any modern web browser. No server required for this basic setup.

## Notes

- This is a client-side only implementation.
- For more complex projects, consider using a build tool like Vite or Webpack.
- Three.js version used: r128 (can be updated to latest if needed).
import React, {useRef, useEffect} from 'react';
import './canvas.css'; // Import CSS file nếu cần
const CanvasImage = ({imageUrl}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    console.log('rerender image');
    const image = new Image();
    image.src = imageUrl;
    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);
    };
  }, [imageUrl]);

  return (
    <div className="canvas-container">
      <canvas ref={canvasRef} id="canvas"></canvas>
    </div>
  );
};

export default CanvasImage;

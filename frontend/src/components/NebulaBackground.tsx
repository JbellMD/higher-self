import React, { useEffect, useState } from 'react';

const NebulaBackground: React.FC = () => {
  const [stars, setStars] = useState<React.ReactElement[]>([]);
  
  useEffect(() => {
    // Generate random stars
    const starCount = 200;
    const newStars: React.ReactElement[] = [];
    
    for (let i = 0; i < starCount; i++) {
      const size = Math.random() * 3 + 1;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const delay = Math.random() * 5;
      const duration = Math.random() * 4 + 2;
      
      newStars.push(
        <div
          key={i}
          style={{
            position: 'absolute',
            width: `${size}px`,
            height: `${size}px`,
            left: `${x}%`,
            top: `${y}%`,
            borderRadius: '50%',
            backgroundColor: 'white',
            boxShadow: `0 0 ${size + 2}px rgba(255, 255, 255, 0.8), 0 0 ${size + 5}px rgba(70, 131, 255, 0.6)`,
            animation: `twinkle ${duration}s infinite alternate`,
            animationDelay: `${delay}s`,
            opacity: Math.random() * 0.8 + 0.2
          }}
        />
      );
    }
    
    setStars(newStars);
  }, []);
  
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: '#000',
        zIndex: -100
      }}
    >
      {/* Deep space background */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(ellipse at center, #0a1a3f 0%, #050520 50%, #000 100%)',
          opacity: 1,
          zIndex: -99
        }}
      />
      
      {/* Blue nebula cloud */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '20%',
          width: '60%',
          height: '60%',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(30, 80, 255, 0.2) 0%, rgba(0, 0, 50, 0.1) 50%, rgba(0, 0, 0, 0) 70%)',
          filter: 'blur(20px)',
          opacity: 0.7,
          animation: 'pulse 15s infinite alternate',
          zIndex: -98
        }}
      />
      
      {/* Purple nebula cloud */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '40%',
          width: '50%',
          height: '50%',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(100, 30, 255, 0.2) 0%, rgba(30, 0, 70, 0.1) 50%, rgba(0, 0, 0, 0) 70%)',
          filter: 'blur(25px)',
          opacity: 0.6,
          animation: 'pulse 20s infinite alternate-reverse',
          zIndex: -97
        }}
      />
      
      {/* Cyan nebula cloud */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '10%',
          width: '40%',
          height: '40%',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(0, 180, 255, 0.2) 0%, rgba(0, 50, 100, 0.1) 50%, rgba(0, 0, 0, 0) 70%)',
          filter: 'blur(15px)',
          opacity: 0.5,
          animation: 'pulse 18s infinite alternate',
          zIndex: -96
        }}
      />
      
      {/* Stars */}
      {stars}
      
      {/* CSS animations */}
      <style>
        {`
          @keyframes twinkle {
            0% { opacity: 0.2; }
            100% { opacity: 1; }
          }
          
          @keyframes pulse {
            0% { transform: scale(1); opacity: 0.5; }
            50% { transform: scale(1.1); opacity: 0.7; }
            100% { transform: scale(1); opacity: 0.5; }
          }
        `}
      </style>
    </div>
  );
};

export default NebulaBackground;

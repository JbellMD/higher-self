import React from 'react';

// Use a direct import with require to avoid TypeScript issues
const nebula = require('../nebula.jpg');

const NebulaBackgroundNew: React.FC = () => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1000, // Use a very low z-index to ensure it's behind everything
        overflow: 'hidden',
      }}
    >
      <img 
        src={nebula.default || nebula} 
        alt="Nebula Background"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          position: 'absolute',
          top: 0,
          left: 0,
          opacity: 0.8,
        }}
      />
      {/* Overlay to improve text readability */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)',
        }}
      />
    </div>
  );
};

export default NebulaBackgroundNew;

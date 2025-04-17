import React, { useEffect } from 'react';

const DirectNebulaBackground: React.FC = () => {
  useEffect(() => {
    // Apply the background directly to the body element
    document.body.style.background = 'black';
    
    // Create a new div for the nebula background
    const nebulaDiv = document.createElement('div');
    nebulaDiv.style.position = 'fixed';
    nebulaDiv.style.top = '0';
    nebulaDiv.style.left = '0';
    nebulaDiv.style.width = '100%';
    nebulaDiv.style.height = '100%';
    nebulaDiv.style.zIndex = '-1000';
    nebulaDiv.style.backgroundImage = 'url("/nebula.jpg")';
    nebulaDiv.style.backgroundSize = 'cover';
    nebulaDiv.style.backgroundPosition = 'center';
    nebulaDiv.style.opacity = '0.8';
    
    // Create a new div for the overlay
    const overlayDiv = document.createElement('div');
    overlayDiv.style.position = 'fixed';
    overlayDiv.style.top = '0';
    overlayDiv.style.left = '0';
    overlayDiv.style.width = '100%';
    overlayDiv.style.height = '100%';
    overlayDiv.style.zIndex = '-999';
    overlayDiv.style.background = 'radial-gradient(circle at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)';
    
    // Add the divs to the document
    document.body.appendChild(nebulaDiv);
    document.body.appendChild(overlayDiv);
    
    // Clean up when component unmounts
    return () => {
      document.body.removeChild(nebulaDiv);
      document.body.removeChild(overlayDiv);
    };
  }, []);
  
  return null; // This component doesn't render anything
};

export default DirectNebulaBackground;

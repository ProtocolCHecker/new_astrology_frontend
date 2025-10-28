import React from 'react';

const VideoBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'brightness(0.4) contrast(1.2)' }}
      >
        <source
          src="https://raw.githubusercontent.com/ProtocolCHecker/Liquidity_provider_project/main/back_hole_video.mp4"
          type="video/mp4"
        />
      </video>
      
      {/* Cosmic overlay gradients for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-cosmic-dark/30 via-transparent to-cosmic-dark/50" />
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-blue-900/20" />
    </div>
  );
};

export default VideoBackground;
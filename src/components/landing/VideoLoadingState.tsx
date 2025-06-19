
import React from 'react';

const VideoLoadingState: React.FC = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-700 to-indigo-800">
      <div className="video-loading"></div>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm opacity-70">
        Loading experience...
      </div>
    </div>
  );
};

export default VideoLoadingState;

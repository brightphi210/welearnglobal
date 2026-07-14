import React from 'react';

interface LoadingOverlayProps {
  visible: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
}) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-50!">
      <div className="bg-white p-2.5 rounded-lg shadow-lg flex flex-col items-center">
        <div className="w-3 h-3 border-2 border-[#038332] border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
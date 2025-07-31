// src/components/ui/ButtonMobile.jsx
import React from 'react';

const ButtonMobile = ({ label, isSelected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full py-3 px-4 mb-2 rounded-xl font-semibold text-base transition 
        ${isSelected 
          ? 'bg-yellow-500 text-gray-900 shadow-md' 
          : 'bg-gray-800 text-yellow-400 hover:bg-gray-700'}
      `}
    >
      {label}
    </button>
  );
};

export default ButtonMobile;

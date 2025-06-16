import React, { useState } from 'react';
import './Toast.css';  // Assuming you have a CSS file for styling

const Toast = ({ message, type, duration }) => {
  const [isVisible, setIsVisible] = useState(true);

  setTimeout(() => setIsVisible(false), duration);

  return (
    isVisible && (
      <div className={`toast ${type}`}>
        <span>{message}</span>
      </div>
    )
  );
};

export default Toast;

'use client';

import { useState, useEffect } from 'react';

// Notification types as constants
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info'
};

export default function NotificationPopup({ 
  show, 
  onClose, 
  message, 
  type = NOTIFICATION_TYPES.SUCCESS, 
  duration = 3000 
}) {
  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    if (show) {
      // Clear any existing timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Set new timeout to auto-hide
      const newTimeout = setTimeout(() => {
        onClose();
        setTimeoutId(null);
      }, duration);

      setTimeoutId(newTimeout);
    }

    // Cleanup on unmount or when show changes to false
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [show, duration, onClose]);

  const handleManualClose = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    onClose();
  };

  if (!show) return null;

  const getTypeStyles = () => {
    switch (type) {
      case NOTIFICATION_TYPES.SUCCESS:
        return {
          bg: 'bg-green-500',
          iconBg: 'bg-green-600',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )
        };
      case NOTIFICATION_TYPES.ERROR:
        return {
          bg: 'bg-red-500',
          iconBg: 'bg-red-600',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )
        };
      case NOTIFICATION_TYPES.INFO:
      default:
        return {
          bg: 'bg-blue-500',
          iconBg: 'bg-blue-600',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[60]">
      <div className={`${styles.bg} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-top-2 duration-300`}>
        <div className={`flex items-center justify-center w-6 h-6 ${styles.iconBg} rounded-full`}>
          {styles.icon}
        </div>
        <span className="font-medium">{message}</span>
        <button
          onClick={handleManualClose}
          className="ml-2 text-white/80 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

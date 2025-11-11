/**
 * Simple Toast Notification - Color Only (No Text)
 * Green = Success, Red = Error
 */

export const showSuccessToast = () => {
  const toastElement = document.createElement('div');
  toastElement.className = 'fixed top-4 right-4 w-20 h-20 bg-green-400 rounded-full shadow-lg z-[9999] animate-bounce';
  toastElement.style.animation = 'bounce 0.5s ease-in-out';
  document.body.appendChild(toastElement);
  
  setTimeout(() => {
    toastElement.style.opacity = '0';
    toastElement.style.transition = 'opacity 0.3s ease-out';
    setTimeout(() => {
      toastElement.remove();
    }, 300);
  }, 1500);
};

export const showErrorToast = () => {
  const toastElement = document.createElement('div');
  toastElement.className = 'fixed top-4 right-4 w-20 h-20 bg-red-400 rounded-full shadow-lg z-[9999] animate-bounce';
  toastElement.style.animation = 'bounce 0.5s ease-in-out';
  document.body.appendChild(toastElement);
  
  setTimeout(() => {
    toastElement.style.opacity = '0';
    toastElement.style.transition = 'opacity 0.3s ease-out';
    setTimeout(() => {
      toastElement.remove();
    }, 300);
  }, 1500);
};

// Export as default for easy import
export default {
  success: showSuccessToast,
  error: showErrorToast,
};

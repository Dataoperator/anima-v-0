// Simple toast implementation
const defaultDelay = 3000;

interface ToastOptions {
  title?: string;
  description?: string;
  duration?: number;
  variant?: 'default' | 'destructive' | 'success';
}

let toastElement: HTMLDivElement | null = null;

const createToastContainer = () => {
  if (typeof document === 'undefined') return null;
  
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '1rem';
  container.style.right = '1rem';
  container.style.zIndex = '9999';
  document.body.appendChild(container);
  return container;
};

export const toast = (options: ToastOptions) => {
  if (typeof document === 'undefined') return;

  if (!toastElement) {
    toastElement = createToastContainer();
  }

  if (!toastElement) return;

  const toastDiv = document.createElement('div');
  toastDiv.className = `bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mb-4 
    ${options.variant === 'destructive' ? 'border-red-500' : 
      options.variant === 'success' ? 'border-green-500' : 'border-gray-200'} 
    border-l-4`;

  const title = document.createElement('h3');
  title.className = 'font-medium text-gray-900 dark:text-white';
  title.textContent = options.title || '';
  toastDiv.appendChild(title);

  if (options.description) {
    const description = document.createElement('p');
    description.className = 'mt-1 text-sm text-gray-500 dark:text-gray-400';
    description.textContent = options.description;
    toastDiv.appendChild(description);
  }

  toastElement.appendChild(toastDiv);

  setTimeout(() => {
    toastDiv.remove();
  }, options.duration || defaultDelay);
};
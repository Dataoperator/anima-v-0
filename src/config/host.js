export const getHost = () => {
  // Local development
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:4943';
  }
  // Production/mainnet
  return 'https://icp0.io';
};
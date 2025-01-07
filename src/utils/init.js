import { anima } from '../declarations';

export const initializeApp = async () => {
  try {
    const response = await anima.get_user_state([]);
    console.log('Backend connection successful:', response);
    return true;
  } catch (e) {
    console.error('Error initializing app:', e);
    return false;
  }
};

const BASE_URL = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:8000' 
    : '';

export const initCsrf = async () => {
  try {
    await fetch(`${BASE_URL}/sanctum/csrf-cookie`, {
      credentials: 'include',
    });
  } catch (error) {
    console.error('Failed to initialize CSRF:', error);
  }
};
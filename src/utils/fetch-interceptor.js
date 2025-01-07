const originalFetch = window.fetch;

window.fetch = async (...args) => {
  try {
    const response = await originalFetch(...args);
    
    // Handle non-200 responses
    if (!response.ok) {
      const error = new Error(`HTTP error! status: ${response.status}`);
      error.response = response;
      throw error;
    }
    
    return response;
  } catch (error) {
    // Enhance error with more details
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      error.message = `Network error while fetching ${args[0]}. This might be due to Content Security Policy restrictions or network connectivity issues.`;
    }
    
    // Re-throw the enhanced error
    throw error;
  }
};
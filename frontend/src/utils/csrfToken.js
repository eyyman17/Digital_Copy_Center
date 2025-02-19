// src/utils/csrfToken.js
const getCsrfToken = () => {
    // Function to get CSRF token from cookies
    return document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='))
      ?.split('=')[1];
  };
  
  // Function to add CSRF token to fetch requests
  const fetchWithCSRF = async (url, options = {}) => {
    const csrfToken = getCsrfToken();
    
    const defaultOptions = {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
    };
  
    const mergedOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };
  
    return fetch(url, mergedOptions);
  };
  
  export { getCsrfToken, fetchWithCSRF };
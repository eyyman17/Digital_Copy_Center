import axios from 'axios';

// Create an Axios instance
const api = axios.create({
    baseURL: 'https://digital-copy-center-backend.onrender.com', // Replace with your API base URL
    withCredentials: true, // Include cookies in cross-origin requests
});

// Add an interceptor to include the CSRF token in requests
api.interceptors.request.use((config) => {
    const csrfToken = document.cookie
        .split('; ')
        .find((cookie) => cookie.startsWith('csrftoken='))
        ?.split('=')[1]; // Extract the CSRF token from cookies
    
    if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken; // Add the token to the headers
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Export the Axios instance
export default api;
import axios from 'axios';

const api = axios.create({
    baseURL: 'https://digital-copy-center-backend.onrender.com',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});


// Add axios interceptor for CSRF token
api.interceptors.request.use(function (config) {
    const csrfToken = document.cookie
        .split('; ')
        .find(cookie => cookie.startsWith('csrftoken='))
        ?.split('=')[1];
    
    if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken;
    }
    return config;
});

// Handle 404 for login redirect
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 404 && window.location.pathname === '/accounts/login/') {
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

// Export the configured axios instance
export default api;
const API_BASE_URL = '/api';  // Note: no need for full URL

export const fetchWithCredentials = async (url, options = {}) => {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
        }
    };

    const response = await fetch(`${API_BASE_URL}${url}`, {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers,
        }
    });

    if (!response.ok) {
        if (response.status === 403 || response.status === 401) {
            window.location.href = '/login';
        }
        throw new Error('Network response was not ok');
    }

    return response.json();
};
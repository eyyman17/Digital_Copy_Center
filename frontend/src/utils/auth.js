// src/utils/auth.js
import { fetchWithCSRF } from './csrfToken';

// Authentication utility
export const getAuthenticatedUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};

export const logout = async () => {
  try {
    const response = await fetchWithCSRF('/accounts/logout_api/', {
      method: 'POST',
    });
    
    if (response.ok) {
      // Clear local storage
      localStorage.removeItem('user');
      // Redirect to login page
      window.location.href = '/accounts/login/';
      return true;
    }
    return false;
  } catch (error) {
    console.error('Logout error:', error);
    return false;
  }
};
/**
 * Shared API Service Module
 * Reusable across all frontend applications
 */

const API_BASE = 'http://localhost:5000/api';

/**
 * Main API function
 * @param {string} endpoint - API endpoint (e.g., '/students')
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
 * @param {object} data - Request body data
 * @returns {Promise} - API response
 */
export async function api(endpoint, method = 'GET', data = null) {
  const token = localStorage.getItem('token');
  
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(API_BASE + endpoint, options);
    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.error || json.message || 'Request failed');
    }

    return json;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

/**
 * GET request
 */
export async function get(endpoint) {
  return api(endpoint, 'GET');
}

/**
 * POST request
 */
export async function post(endpoint, data) {
  return api(endpoint, 'POST', data);
}

/**
 * PUT request
 */
export async function put(endpoint, data) {
  return api(endpoint, 'PUT', data);
}

/**
 * DELETE request
 */
export async function del(endpoint) {
  return api(endpoint, 'DELETE');
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
  return !!localStorage.getItem('token');
}

/**
 * Get current user from localStorage
 */
export function getCurrentUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

/**
 * Save auth data
 */
export function saveAuth(token, user) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

/**
 * Clear auth data
 */
export function clearAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

/**
 * Redirect to login if not authenticated
 */
export function requireAuth(loginUrl = '/login.html') {
  if (!isAuthenticated()) {
    window.location.href = loginUrl;
  }
}

// Export API_BASE for direct use
export { API_BASE };

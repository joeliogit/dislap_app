/* ============================================
   DISSLAPP — API Service Layer
   ============================================ */

const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('disslapp_token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  
  if (response.status === 401) {
    localStorage.removeItem('disslapp_token');
    localStorage.removeItem('disslapp_user');
    window.location.href = '/login';
    throw new Error('Sesión expirada');
  }

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Error en la solicitud');
  }

  return data;
}

// ---- Auth ----
export const authAPI = {
  login: (credentials) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),

  register: (userData) => request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  getMe: () => request('/auth/me'),

  googleLogin: (credential) => request('/auth/google', {
    method: 'POST',
    body: JSON.stringify({ credential }),
  }),
};

// ---- Games ----
export const gamesAPI = {
  saveSession: (sessionData) => request('/games/session', {
    method: 'POST',
    body: JSON.stringify(sessionData),
  }),

  getSessions: () => request('/games/sessions'),

  getProgress: () => request('/games/progress'),
};

// ---- Progress ----
export const progressAPI = {
  getProgress: (patientId) => request(`/progress/${patientId}`),
  
  getWeeklyXP: (patientId) => request(`/progress/${patientId}/weekly`),
  
  getSkills: (patientId) => request(`/progress/${patientId}/skills`),
  
  getSessions: (patientId) => request(`/progress/${patientId}/sessions`),
};

// ---- Achievements ----
export const achievementsAPI = {
  getAll: (patientId) => request(`/achievements/${patientId}`),
  
  unlock: (achievementData) => request('/achievements/unlock', {
    method: 'POST',
    body: JSON.stringify(achievementData),
  }),
};

// ---- Levels ----
export const levelsAPI = {
  getAll: (patientId) => request(`/levels${patientId ? `?userId=${patientId}` : ''}`),
};

// ---- Payments ----
export const paymentsAPI = {
  getPlans:       ()     => request('/payments/plans'),
  getSubscription:()     => request('/payments/subscription'),
  createCheckout: (plan) => request('/payments/checkout', { method: 'POST', body: JSON.stringify({ plan }) }),
  demoCheckout:       (plan)            => request('/payments/demo-checkout',        { method: 'POST', body: JSON.stringify({ plan }) }),
  cancel:             ()                => request('/payments/cancel',               { method: 'POST', body: JSON.stringify({}) }),
  createPaypalOrder:  (plan)            => request('/payments/paypal/create-order',  { method: 'POST', body: JSON.stringify({ plan }) }),
  capturePaypalOrder: (orderId, plan)   => request('/payments/paypal/capture-order', { method: 'POST', body: JSON.stringify({ orderId, plan }) }),
};

// ---- Contact ----
export const contactAPI = {
  send: (contactData) => request('/contact', {
    method: 'POST',
    body: JSON.stringify(contactData),
  }),
};

export default {
  authAPI,
  gamesAPI,
  progressAPI,
  achievementsAPI,
  levelsAPI,
  contactAPI,
};

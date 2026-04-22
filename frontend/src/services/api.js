// src/services/api.js
import axios from 'axios';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: BASE, timeout: 8000 });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('57arts_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('57arts_token');
      localStorage.removeItem('57arts_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ── PRODUCTS ──────────────────────────────────────────────────────────────────
export const productAPI = {
  getAll:        (params = {}) => api.get('/products', { params }),
  getFeatured:   ()            => api.get('/products/featured'),
  getTrending:   ()            => api.get('/products/trending'),
  getBySlug:     (slug)        => api.get(`/products/${slug}`),
  search:        (q)           => api.get('/products', { params: { search: q } }),
  getByCategory: (category)    => api.get('/products', { params: { category } }),
  add:           (data)        => api.post('/products', data),
  update:        (id, data)    => api.put(`/products/${id}`, data),
  remove:        (id)          => api.delete(`/products/${id}`),
};

// ── AUTH ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  register:       (data) => api.post('/auth/register', data),
  verifyEmail:    (data) => api.post('/auth/verify-email', data),
  resendOTP:      (data) => api.post('/auth/resend-otp', data),
  login:          (data) => api.post('/auth/login', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data), // ✅
  resetPassword:  (data) => api.post('/auth/reset-password', data),  // ✅
  getMe:          ()     => api.get('/auth/me'),
  updateProfile:  (data) => api.put('/auth/me', data),
};

// ── ORDERS ────────────────────────────────────────────────────────────────────
export const orderAPI = {
  create:            (data)       => api.post('/orders', data),
  getMyOrders:       ()           => api.get('/orders/my-orders'),
  getById:           (id)         => api.get(`/orders/${id}`),
  cancel:            (id, reason) => api.put(`/orders/${id}/cancel`, { reason }),
  getVendorOrders:   ()           => api.get('/orders/vendor/all'),
  updateStatus:      (id, status) => api.put(`/orders/${id}/status`, { status }),
};

// ── VENDORS ───────────────────────────────────────────────────────────────────
export const vendorAPI = {
  register:      (data) => api.post('/vendors/register', data),
  getProfile:    ()     => api.get('/vendors/profile'),
  updateProfile: (data) => api.put('/vendors/profile', data),
  getStats:      ()     => api.get('/vendors/stats'),
  getAll:        ()     => api.get('/vendors'),
};

// ── AFFILIATES ────────────────────────────────────────────────────────────────
export const affiliateAPI = {
  register:   (data)          => api.post('/affiliates/register', data),
  getProfile: ()              => api.get('/affiliates/profile'),
  getStats:   ()              => api.get('/affiliates/stats'),
  trackClick: (affiliateCode) => api.post('/affiliates/track-click', { affiliateCode }),
};

// ── REVIEWS ───────────────────────────────────────────────────────────────────
export const reviewAPI = {
  add:           (data)      => api.post('/reviews', data),
  getForProduct: (productId) => api.get(`/reviews/${productId}`),
  markHelpful:   (id)        => api.put(`/reviews/${id}/helpful`),
  remove:        (id)        => api.delete(`/reviews/${id}`),
};

// ── AI ────────────────────────────────────────────────────────────────────────
export const aiAPI = {
  getRecommendations: (params = {}) => api.get('/ai/recommendations', { params }),
  recordInteraction:  (body)        => api.post('/ai/interactions', body),
  getSimilar:         (productId)   => api.get(`/ai/similar/${productId}`),
  chat:               (message, userId) => api.post('/ai/chat', { message, user_id: userId || null }),
};

// ── ADMIN ─────────────────────────────────────────────────────────────────────
export const adminAPI = {
  getStats:          ()             => api.get('/admin/stats'),
  getUsers:          ()             => api.get('/admin/users'),
  toggleUser:        (id)           => api.put(`/admin/users/${id}/toggle`),
  updateUserRole:    (id, role)     => api.put(`/admin/users/${id}/role`, { role }),
  deleteUser:        (id)           => api.delete(`/admin/users/${id}`),
  getVendors:        ()             => api.get('/admin/vendors'),
  approveVendor:     (id)           => api.put(`/admin/vendors/${id}/approve`),
  rejectVendor:      (id)           => api.put(`/admin/vendors/${id}/reject`),
  getOrders:         ()             => api.get('/admin/orders'),
  updateOrderStatus: (id, status)   => api.put(`/admin/orders/${id}/status`, { orderStatus: status }),
  getProducts:       ()             => api.get('/admin/products'),
  deleteProduct:     (id)           => api.delete(`/admin/products/${id}`),
  getAffiliates:     ()             => api.get('/admin/affiliates'),
  getSettings:       ()             => api.get('/admin/settings'),
  updateSettings:    (data)         => api.put('/admin/settings', data),
};

export default api;
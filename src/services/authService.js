import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login/', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register/', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout/');
    } catch {
      // Ignorar errores — el token ya puede estar expirado
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  getProfile: async () => {
    const response = await api.get('/dueños/mi_perfil/');
    // Actualizar user en localStorage con datos frescos
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  },

  updateProfile: async (data, photoFile = null) => {
    let payload;
    let headers = {};
    if (photoFile) {
      payload = new FormData();
      Object.entries(data).forEach(([k, v]) => {
        if (v !== null && v !== undefined) payload.append(k, v);
      });
      payload.append('photo', photoFile);
      headers = { 'Content-Type': 'multipart/form-data' };
    } else {
      payload = data;
    }
    const response = await api.patch('/dueños/actualizar_perfil/', payload, { headers });
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  googleLogin: async (accessToken) => {
    const response = await api.post('/auth/google/', { access_token: accessToken });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  facebookLogin: async (accessToken) => {
    const response = await api.post('/auth/facebook/', { access_token: accessToken });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  updateLocation: async (latitude, longitude) => {
    const ubicación = `${latitude},${longitude}`;
    const response = await api.patch('/dueños/actualizar_perfil/', { ubicación });
    if (response.data.user) {
      const updated = response.data.user;
      localStorage.setItem('user', JSON.stringify(updated));
    }
    return response.data;
  },
};

import api from './api';

export const matchService = {
  getPotentialMatches: async (petId, radius = 10) => {
    const response = await api.get(`/matches/potential/${petId}/`, { params: { radius } });
    return response.data;
  },

  likeMatch: async (petId, targetPetId) => {
    const response = await api.post('/matches/like/', { pet_id: petId, target_pet_id: targetPetId });
    return response.data;
  },

  passMatch: async (petId, targetPetId) => {
    const response = await api.post('/matches/pass/', { pet_id: petId, target_pet_id: targetPetId });
    return response.data;
  },

  getMyMatches: async (petId) => {
    const response = await api.get(`/matches/my-matches/${petId}/`);
    return response.data;
  },

  getAllMatches: async () => {
    const response = await api.get('/matches/all-matches/');
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/matches/stats/');
    return response.data;
  },

  getActivity: async (limit = 8) => {
    const response = await api.get('/matches/activity/', { params: { limit } });
    return response.data;
  },

  getPetsOverview: async () => {
    const response = await api.get('/matches/my-pets-overview/');
    return response.data;
  },
};

import api from './api';

export const matchService = {
  getPotentialMatches: async (petId, radius = 10) => {
    const response = await api.get(`/matches/potential/${petId}/`, {
      params: { radius },
    });
    return response.data;
  },

  likeMatch: async (petId, targetPetId) => {
    const response = await api.post('/matches/like/', {
      pet_id: petId,
      target_pet_id: targetPetId,
    });
    return response.data;
  },

  passMatch: async (petId, targetPetId) => {
    const response = await api.post('/matches/pass/', {
      pet_id: petId,
      target_pet_id: targetPetId,
    });
    return response.data;
  },

  getMyMatches: async (petId) => {
    const response = await api.get(`/matches/my-matches/${petId}/`);
    return response.data;
  },
};

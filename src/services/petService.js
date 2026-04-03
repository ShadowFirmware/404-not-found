import api from './api';

export const petService = {
  getMyPets: async () => {
    const response = await api.get('/pets/my-pets/');
    return response.data;
  },

  getPetById: async (id) => {
    const response = await api.get(`/pets/${id}/`);
    return response.data;
  },

  createPet: async (petData) => {
    const response = await api.post('/pets/', petData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updatePet: async (id, petData) => {
    const response = await api.put(`/pets/${id}/`, petData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deletePet: async (id) => {
    const response = await api.delete(`/pets/${id}/`);
    return response.data;
  },

  discoverPets: async () => {
    const response = await api.get('/pets/discover/');
    return response.data;
  },
};

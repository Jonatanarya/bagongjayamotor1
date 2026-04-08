import { apiFetch } from './apiClient.js';

export const motorService = {
  getMotors: async () => {
    const response = await apiFetch('/motors');
    return response?.data?.motors ?? [];
  },
};

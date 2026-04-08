import { apiFetch } from './apiClient.js';

export const requestService = {
  submitSellRequest: async (payload) => {
    const response = await apiFetch('/requests', {
      method: 'POST',
      body: payload,
    });

    return response?.data;
  },
};

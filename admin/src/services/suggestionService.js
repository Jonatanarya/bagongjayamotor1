import { apiFetch } from './apiClient.js';

const SUGGESTION_PATH = '/suggestions';

export const suggestionService = {
  getSuggestions: async () => {
    const response = await apiFetch(SUGGESTION_PATH);
    return response?.data ?? [];
  },
  submitSuggestion: async (payload) => {
    const response = await apiFetch(SUGGESTION_PATH, {
      method: 'POST',
      body: payload,
    });
    return response?.data;
  },
  deleteSuggestion: async (id) => {
    const response = await apiFetch(`${SUGGESTION_PATH}/${id}`, {
      method: 'DELETE',
    });
    return response?.data;
  },
};

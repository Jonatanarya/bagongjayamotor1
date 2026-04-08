import { useMutation, useQueryClient } from '@tanstack/react-query';
import { suggestionService } from '../services/suggestionService.js';

export function useSubmitSuggestion(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => suggestionService.submitSuggestion(payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['suggestions'] });
      options.onSuccess?.(data, variables, context);
    },
    onError: options.onError,
    onSettled: options.onSettled,
  });
}

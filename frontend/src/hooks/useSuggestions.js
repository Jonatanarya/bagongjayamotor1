import { useQuery } from '@tanstack/react-query';
import { suggestionService } from '../services/suggestionService.js';

export function useSuggestions() {
  return useQuery({
    queryKey: ['suggestions'],
    queryFn: suggestionService.getSuggestions,
    staleTime: 1000 * 60,
  });
}

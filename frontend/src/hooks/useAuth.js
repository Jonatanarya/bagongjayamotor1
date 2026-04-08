import { authClient } from '../services/authClient.js';

export function useAuth() {
  return authClient;
}

import { useEffect, useState } from 'react';
import { apiFetch } from './apiClient.js';
import {
  clearStoredSession,
  readStoredSession,
  subscribeToSession,
  writeStoredSession,
} from './authSession.js';

function useSession() {
  const [session, setSession] = useState(() => readStoredSession());

  useEffect(() => subscribeToSession(setSession), []);

  return session;
}

async function signInWithEmail({ body }) {
  const response = await apiFetch('/admin/login', {
    method: 'POST',
    body,
  });

  const session = response?.data ?? null;

  if (session) {
    writeStoredSession(session);
  }

  return response;
}

async function signOut() {
  try {
    await apiFetch('/admin/logout', {
      method: 'POST',
    });
  } catch {
    // ignore logout errors and clear local session anyway
  }

  clearStoredSession();
}

async function getSession() {
  const currentSession = readStoredSession();

  if (!currentSession?.token) {
    return { data: null };
  }

  const response = await apiFetch('/admin/session');
  const nextSession = {
    token: currentSession.token,
    user: response?.data?.user ?? null,
  };

  writeStoredSession(nextSession);
  return { data: nextSession };
}

export const authClient = {
  useSession,
  signIn: {
    email: signInWithEmail,
  },
  signOut,
  getSession,
};

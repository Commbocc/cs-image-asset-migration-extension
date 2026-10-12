import { computed, ref } from "vue";
import {
  CONTENTSTACK_AUTH_SESSION_KEY,
  type ContentstackSession,
} from "@/utils/contentstack-auth";
import { sendMessage } from "@/utils/messages";
import { useState } from "./state";

export function useContentstackAuth() {
  const session = useState<ContentstackSession | null>(
    "contentstack-session",
    () => null
  );
  const isLoading = ref(false);
  const error = useState("contentstack-auth-error", () => "");
  const isAuthenticated = computed(() => Boolean(session.value?.accessToken));

  async function loadSession() {
    const stored = await chrome.storage.session.get<{
      [CONTENTSTACK_AUTH_SESSION_KEY]?: ContentstackSession;
    }>(CONTENTSTACK_AUTH_SESSION_KEY);
    const savedSession = stored[CONTENTSTACK_AUTH_SESSION_KEY] ?? null;

    if (savedSession?.expiresAt && savedSession.expiresAt <= Date.now()) {
      await clearExpiredSession();
      return;
    }

    session.value = savedSession;
  }

  async function login() {
    isLoading.value = true;
    error.value = "";

    try {
      const response = await sendMessage("CONTENTSTACK_LOGIN", undefined);

      if (!response?.ok) {
        throw new Error(response?.error ?? "Contentstack sign-in failed.");
      }

      await loadSession();
    } catch (cause) {
      error.value = cause instanceof Error ? cause.message : "Sign-in failed.";
    } finally {
      isLoading.value = false;
    }
  }

  async function logout() {
    if (!confirm("Logout?")) return;
    await chrome.storage.session.remove(CONTENTSTACK_AUTH_SESSION_KEY);
    session.value = null;
    error.value = "";
    await loadSession();
  }

  async function clearExpiredSession() {
    session.value = null;
    error.value = "Your Contentstack session expired. Please sign in again.";
    await chrome.storage.session.remove(CONTENTSTACK_AUTH_SESSION_KEY);
  }

  loadSession().catch(() => {
    error.value = "Could not load the saved Contentstack session.";
  });

  return {
    loadSession,
    session,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    clearExpiredSession,
  };
}

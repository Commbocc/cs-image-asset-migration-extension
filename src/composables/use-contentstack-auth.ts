import { computed, ref } from "vue";
import {
  CONTENTSTACK_AUTH_SESSION_KEY,
  type ContentstackSession,
} from "@/utils/contentstack-auth";
import { sendMessage } from "@/utils/messages";

export function useContentstackAuth() {
  const session = ref<ContentstackSession | null>(null);
  const isLoading = ref(false);
  const error = ref("");
  const isAuthenticated = computed(() => Boolean(session.value?.accessToken));

  async function loadSession() {
    const stored = await chrome.storage.local.get<{
      [CONTENTSTACK_AUTH_SESSION_KEY]?: ContentstackSession;
    }>(CONTENTSTACK_AUTH_SESSION_KEY);
    session.value = stored[CONTENTSTACK_AUTH_SESSION_KEY] ?? null;
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
    await chrome.storage.local.remove(CONTENTSTACK_AUTH_SESSION_KEY);
    session.value = null;
    error.value = "";
  }

  void loadSession().catch(() => {
    error.value = "Could not load the saved Contentstack session.";
  });

  return { session, isAuthenticated, isLoading, error, login, logout };
}

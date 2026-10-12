<script setup lang="ts">
import { useContentstackAuth } from "@/composables/contentstack-auth";
import { computed } from "vue";

const { session, isAuthenticated, isLoading, error, login, logout } =
  useContentstackAuth();

const color = computed(() => {
  if (error.value) return "error";
  if (isAuthenticated.value) return "neutral";
  return "primary";
});
</script>

<template>
  <UButton
    :label="isAuthenticated ? session?.userUid : 'Login'"
    :variant="isAuthenticated ? 'subtle' : 'solid'"
    :color="color"
    @click="() => (isAuthenticated ? logout() : login())"
    :icon="isAuthenticated ? 'i-lucide-log-out' : 'i-lucide-log-in'"
    :loading="isLoading"
  />
</template>

<script setup lang="ts">
import { useContentstackAuth } from "@/composables/use-contentstack-auth";

const { session, isAuthenticated, isLoading, error, login, logout } =
  useContentstackAuth();
</script>

<template>
  <UContainer class="my-10">
    <div v-if="isAuthenticated">
      <p class="text-sm font-medium">Account connected</p>
      <p v-if="session?.userUid" class="mt-1 text-xs">
        User {{ session.userUid }}
      </p>
      <UButton @click="logout"> Disconnect </UButton>
    </div>

    <div v-else>
      <p class="text-sm">Sign in to connect your Contentstack account.</p>
      <UButton block :loading="isLoading" @click="login">
        {{ isLoading ? "Connecting..." : "Continue with Contentstack" }}
      </UButton>
      <p v-if="error" class="mt-3 text-sm text-error" role="alert">
        {{ error }}
      </p>
    </div>
  </UContainer>
</template>

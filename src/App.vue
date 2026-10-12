<script setup lang="ts">
import { useContentstackAuth } from "@/composables/contentstack-auth";
import { useAppSettings } from "@/composables/settings";
import { onBeforeMount, onBeforeUnmount } from "vue";

const { isAuthenticated, error, login, loadSession } = useContentstackAuth();
const { settings, unwatch, overlay } = useAppSettings();

onBeforeMount(async () => {
  await loadSession();
});

onBeforeUnmount(unwatch);
</script>

<template>
  <UApp>
    <div class="flex-1 flex flex-col">
      <UDashboardNavbar
        :toggle="false"
        class="sticky top-0 z-50 shrink-0"
        :style="{
          background: 'var(--ui-bg)',
        }"
      >
        <template #leading>
          <Settings />
        </template>

        <template #right>
          <LoginButton v-if="settings.apiKey" />
        </template>
      </UDashboardNavbar>

      <UContainer v-if="settings.apiKey && error">
        <UAlert
          color="error"
          variant="subtle"
          title="Contentstack authentication"
          :description="error"
          icon="i-lucide-circle-alert"
        />
      </UContainer>

      <div class="flex-1">
        <RouterView v-if="settings.apiKey && isAuthenticated" />
        <UPageHero
          v-else
          title="Image Migration Extension"
          description="Connect your ContentStack workspace, easily upload Cloudinary images as ContentStack assets directly from your browser."
          :links="[
            settings.apiKey
              ? {
                  label: 'Sign in with ContentStack',
                  color: 'primary',
                  trailingIcon: 'i-lucide-log-in',
                  onClick: login,
                }
              : {
                  label: 'Get Started',
                  color: 'info',
                  trailingIcon: 'i-lucide-settings',
                  onClick: () => (overlay = true),
                },
          ]"
        />
      </div>
    </div>
  </UApp>
</template>

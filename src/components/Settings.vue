<script setup lang="ts">
import { useContentstackAuth } from "@/composables/contentstack-auth";
import { useAppSettings } from "@/composables/settings";

const { settings, overlay } = useAppSettings();
const { isAuthenticated } = useContentstackAuth();
</script>

<template>
  <USlideover
    side="left"
    dismissible
    close
    title="Settings"
    description=""
    v-model:open="overlay"
    :ui="{ body: 'space-y-5' }"
  >
    <UButton
      title="Settings"
      color="info"
      variant="subtle"
      icon="i-lucide-folder-cog"
    />

    <template #description>
      <UColorModeButton />
    </template>

    <template #body>
      <!--  -->
      <UFormField label="ContentStack API Key">
        <UInput v-model="settings.apiKey" placeholder="blt..." class="w-full" />
      </UFormField>

      <!--  -->
      <UFormField label="Cloudinary Base">
        <UInput
          v-model="settings.cloudinaryBase"
          placeholder="https://..."
          class="w-full"
        />
      </UFormField>

      <!--  -->
      <UFormField
        v-if="isAuthenticated && settings.apiKey"
        label="Select Folder"
        description="Saving an image will place it in the selected ContentStack folder."
      >
        <FolderTreeModal />
      </UFormField>

      <!--  -->
      <UFormField
        label="Ignored Images"
        description="Ignored images will not show in the list of images on a page."
      >
        <!--  -->
        <IgnoredImagesModal />
      </UFormField>
    </template>
  </USlideover>
</template>

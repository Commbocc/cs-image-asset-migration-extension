<script setup lang="ts">
import { useCloudinaryImages } from "@/composables/cloudinary-images";
import { useAppSettings } from "@/composables/settings";
import { onMounted } from "vue";

const { executeImmediate, images, isLoading } = useCloudinaryImages();
const { settings, overlay } = useAppSettings();

onMounted(() => {
  executeImmediate();
});
</script>

<template>
  <UContainer class="mb-5">
    <template v-if="!settings.folderUid">
      <UPageCard
        title="Choose a Save Folder"
        @click="overlay = true"
        block
        class="mt-5"
        icon="i-lucide-folder"
        description="Choose a Save Folder to continue"
      />
    </template>

    <template v-else>
      <UPageHeader
        :ui="{
          headline: 'text-neutral',
        }"
        :links="[
          {
            label: 'Rescan Images',
            icon: 'i-lucide-rotate-cw',
            target: '_blank',
            variant: 'soft',
            color: 'neutral',
            onClick: executeImmediate,
            loading: isLoading,
            size: 'xs',
          },
        ]"
      >
        <template #headline>
          <UAlert
            color="warning"
            variant="subtle"
            title="Heads up!"
            icon="i-lucide-folder"
          >
            <template #description>
              Cloudinary images in this tab will be saved to the ContentStack
              folder:
              <ULink
                :href="`https://app.contentstack.com/#!/stack/${settings.apiKey}/assets/${settings.folderUid}/browse`"
                target="_blank"
                external
              >
                {{ settings.folderName }}
              </ULink>
            </template>
          </UAlert>
        </template>
      </UPageHeader>

      <UPageList v-if="images?.length" divide>
        <UPageCard
          v-for="(item, index) in images"
          :key="index"
          variant="ghost"
          :ui="{
            container: 'lg:grid-cols-1',
            wrapper: 'flex flex-row gap-2 justify-between max-w-xs',
            footer: 'flex gap-1 shrink',
          }"
        >
          <template #footer>
            <!-- actions -->
            <UButton
              :href="item.url"
              target="_blank"
              size="sm"
              title="View"
              variant="subtle"
              icon="i-lucide-eye"
              color="info"
            />

            <IgnoreImageButton
              :image="item"
              size="sm"
              title="Ignore"
              variant="subtle"
              icon="i-lucide-square-slash"
              color="warning"
            />

            <UploadAssetButton
              :image="item"
              size="sm"
              title="Save"
              variant="subtle"
              icon="i-lucide-save"
            />
          </template>

          <template #body>
            <UUser
              :name="item.filename"
              :description="item.alt"
              :avatar="{ src: item.avatar }"
              class="relative"
              :ui="{
                name: 'truncate max-w-40',
              }"
            />
          </template>
        </UPageCard>
      </UPageList>

      <UEmpty
        v-else
        icon="i-lucide-image-off"
        title="No images found"
        description="No Cloudinary images found in the active tab."
      />
    </template>
  </UContainer>
</template>

<script setup lang="ts">
import { useContentstackClient } from "@/composables/contentstack-client";
import { useAppSettings } from "@/composables/settings";
import { useAsyncState } from "@vueuse/core";

const props = defineProps<{
  image: CloudinaryImage;
}>();

const { client } = useContentstackClient();
const toast = useToast();

const { settings } = useAppSettings();

const { isLoading, execute } = useAsyncState(
  async () => {
    const imageResponse = await fetch(props.image.url);
    const blob = await imageResponse.blob();

    const body = new FormData();
    body.append("asset[upload]", blob, props.image.filename);
    body.append("asset[parent_uid]", settings.value.folderUid);
    body.append("asset[title]", props.image.filename);
    body.append("asset[description]", props.image.alt);

    const res = await client.value("/assets", {
      method: "POST",
      body,
    });

    toast.add({
      title: "Image saved",
      description: `This image was saved`,
      icon: "i-lucide-save-check",
    });

    console.log(res);
  },
  undefined,
  { immediate: false }
);
</script>

<template>
  <UButton @click="() => execute()" :loading="isLoading" />
</template>

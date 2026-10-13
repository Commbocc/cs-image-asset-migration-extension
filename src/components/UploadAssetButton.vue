<script setup lang="ts">
import { useContentstackClient } from "@/composables/contentstack-client";
import { useAppSettings } from "@/composables/settings";
import { useToast } from "@nuxt/ui/composables";
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
    const contentType = imageResponse.headers
      .get("content-type")
      ?.split(";")[0]
      .trim()
      .toLowerCase();
    const mimeExtensions: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/svg+xml": "svg",
    };
    const extension = contentType?.startsWith("image/")
      ? mimeExtensions[contentType] ?? contentType.split("/")[1].split("+")[0]
      : undefined;
    const filename = extension
      ? `${props.image.filename}.${extension}`
      : props.image.filename;

    const body = new FormData();
    body.append("asset[upload]", blob, filename);
    body.append("asset[parent_uid]", settings.value.folderUid);
    body.append("asset[title]", filename);
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

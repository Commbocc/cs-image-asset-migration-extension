<script setup lang="ts">
import { useIgnoredImages } from "@/composables/ignored-images";

const props = defineProps<{
  image: CloudinaryImage;
}>();

const { ignored } = useIgnoredImages();
</script>

<template>
  <UButton @click="ignored.set(image.filename, image)" />
</template>

<script setup lang="ts">
import { useIgnoredImages } from "@/composables/ignored-images";

//
const { ignored } = useIgnoredImages();
</script>

<template>
  <UModal title="Ignored Images">
    <UPageCard
      title="Ignored Images"
      block
      icon="i-lucide-image-off"
      variant="subtle"
      :description="[ignored.size, 'Ignored Images'].join(' ')"
    />

    <template #body>
      <UPageList v-if="ignored.size" divide>
        <UPageCard
          v-for="(item, index) in ignored.values()"
          :key="index"
          variant="ghost"
          :ui="{
            container: 'lg:grid-cols-1',
            footer: 'w-full flex gap-1 justify-end',
          }"
        >
          <template #footer>
            <!-- actions -->
            <UButton
              :image="item"
              size="sm"
              title="Restore"
              variant="subtle"
              icon="i-lucide-archive-restore"
              color="warning"
              @click="ignored.delete(item.filename)"
            />
          </template>

          <template #body>
            <UUser
              :name="item.filename"
              :description="item.alt"
              :avatar="{ src: item.avatar }"
              class="relative"
              :ui="{
                name: 'truncate max-w-xs',
              }"
            />
          </template>
        </UPageCard>
      </UPageList>

      <UEmpty
        v-else
        icon="i-lucide-image-off"
        title="No ignored images"
        description="It looks like you haven't ignored any images yet."
      />
    </template>
  </UModal>
</template>

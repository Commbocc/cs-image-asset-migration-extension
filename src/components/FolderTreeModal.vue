<script setup lang="ts">
import { useContentstackClient } from "@/composables/contentstack-client";
import { useAppSettings } from "@/composables/settings";
import type { TreeItem } from "@nuxt/ui";
import { useAsyncState } from "@vueuse/core";
import { onMounted } from "vue";

const { settings } = useAppSettings();

type AssetFolderTreeItem = TreeItem & {
  uid: string;
};

const { client } = useContentstackClient();

async function fetchFolders(
  parentUid?: string
): Promise<AssetFolderTreeItem[]> {
  const data = await client.value<{ assets: ContentStackAsset[] }>("/assets", {
    query: {
      include_folders: true,
      query: { is_dir: true, parent_uid: parentUid ?? null },
      folder: parentUid,
    },
  });

  return data.assets.map((asset) => ({
    uid: asset.uid,
    label: asset.name,
    children: [],
    trailingIcon: "i-lucide-chevron-down",
    icon: "i-lucide-folder",
  }));
}

const { state, execute } = useAsyncState(
  (parentUid?: string) => fetchFolders(parentUid),
  [] as AssetFolderTreeItem[],
  { immediate: false, shallow: false }
);

const loading = new Set<string>();

async function loadChildren(item: AssetFolderTreeItem) {
  if (item.children?.length !== 0 || item.disabled || loading.has(item.uid))
    return;

  loading.add(item.uid);
  try {
    const children = await fetchFolders(item.uid);
    item.children = children.length
      ? children
      : [{ label: "Empty", disabled: true }];
  } finally {
    loading.delete(item.uid);
  }
}

async function handleSelect(item: AssetFolderTreeItem) {
  settings.value.folderUid = item.uid;
  settings.value.folderName = item.label ?? "";
}

onMounted(execute);
</script>

<template>
  <UModal title="Choose a Save Folder">
    <UPageCard
      title="Choose a Save Folder"
      block
      icon="i-lucide-folder"
      variant="subtle"
      :description="[settings.folderUid, settings.folderName].join(' : ')"
    />

    <template #description>
      <UButton
        icon="i-lucide-rotate-cw"
        size="xs"
        title="Refresh"
        color="neutral"
        variant="ghost"
        @click="() => execute()"
        label="Refresh"
      />
    </template>

    <template #body>
      <UTree
        :as="{ link: 'div' }"
        :items="state"
        selection-behavior="replace"
        :loading="state === null"
        @toggle="(_, item) => loadChildren(item)"
        @select="(_, item) => loadChildren(item)"
      >
        <template #item-leading="{ item }">
          <UCheckbox
            :model-value="settings.folderUid === item.uid"
            tabindex="-1"
            @change="handleSelect(item)"
            @click.stop
          />
        </template>
      </UTree>
    </template>
  </UModal>
</template>

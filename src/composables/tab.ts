import { computed } from "vue";
import { useState } from "@/composables/use-state";

export const useTab = () => {
  const tab = useState<chrome.tabs.Tab | undefined>("tab", () => undefined);

  const tabUrl = computed(() =>
    tab.value?.url ? new URL(tab.value.url) : undefined,
  );

  const fetchActiveTab = () => {
    return new Promise<chrome.tabs.Tab>((resolve) => {
      chrome.tabs.query(
        { active: true, currentWindow: true },
        ([activeTab]) => {
          tab.value = activeTab;
          resolve(activeTab);
        },
      );
    });
  };

  return { tab, tabUrl, fetchActiveTab };
};

import { useAsyncState } from "@vueuse/core";
import { useAppSettings } from "./settings";
import { useIgnoredImages } from "./ignored-images";
import { computed } from "vue";

export function useCloudinaryImages() {
  const { settings } = useAppSettings();
  const { ignored } = useIgnoredImages();

  const data = useAsyncState<CloudinaryImage[] | undefined>(
    async () => {
      const [activeTab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!activeTab?.id) {
        return [];
      }

      const BASE = settings.value.cloudinaryBase;

      const results = await chrome.scripting.executeScript({
        target: { tabId: activeTab.id, allFrames: true },
        args: [BASE],
        func: (base: string): CloudinaryImage[] => {
          const images = new Map<string, CloudinaryImage>();

          document.querySelectorAll("img").forEach((img) => {
            const src = img.currentSrc || img.src;
            if (!src.startsWith(base)) return;

            const last = new URL(src).pathname.split("/").at(-1);
            if (!last) return;

            const filename = decodeURIComponent(last).replace(
              /\.[a-z0-9]+$/i,
              ""
            );
            if (images.has(filename)) return;

            images.set(filename, {
              url: `${base}/${last}`,
              alt: img.alt.trim(),
              filename,
              avatar: `${base}/c_fit,w_150/t_WebP/${last}`,
            });
          });

          return Array.from(images.values());
        },
      });

      return results.flatMap(({ result }) => result ?? []);
    },
    [],
    { immediate: false }
  );

  const images = computed(
    () => data.state.value?.filter((r) => !ignored.value.has(r.filename)) ?? []
  );

  return { ...data, images };
}

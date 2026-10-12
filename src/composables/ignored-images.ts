import { watch } from "vue";
import { useState } from "./state";

const STORAGE_KEY = "ignored-images";

type IgnoredImagesStorage = Record<string, CloudinaryImage>;

export function useIgnoredImages() {
  const ignored = useState<Map<string, CloudinaryImage>>(
    "ignored-images",
    () => new Map()
  );

  //

  const unwatch = watch(
    ignored,
    (value) => {
      chrome.storage.local.set<{ [STORAGE_KEY]: IgnoredImagesStorage }>({
        [STORAGE_KEY]: Object.fromEntries(value),
      });
    },
    { deep: true, immediate: false }
  );

  //

  const fetchIgnoredImages = async () => {
    const savedStorage = await chrome.storage.local.get<{
      [STORAGE_KEY]: IgnoredImagesStorage | undefined;
    }>(STORAGE_KEY);

    ignored.value = new Map(Object.entries(savedStorage[STORAGE_KEY] ?? []));
  };

  fetchIgnoredImages();

  return {
    //
    ignored,
    fetchIgnoredImages,
    unwatch,
  };
}

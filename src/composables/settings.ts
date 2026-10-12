import { watch } from "vue";
import { useState } from "./state";

type AppSettings = {
  apiKey: string;
  cloudinaryBase: string;
  folderUid: string;
  folderName: string;
};

export const DEFAULT_APP_STORAGE: AppSettings = {
  apiKey: "",
  cloudinaryBase: "",
  folderUid: "",
  folderName: "",
};

const STORAGE_KEY = "app-settings";

export const useAppSettings = () => {
  //

  const overlay = useState<boolean>("settings-overlay", () => false);

  const settings = useState<AppSettings>(
    STORAGE_KEY,
    () => DEFAULT_APP_STORAGE
  );

  //

  const unwatch = watch(
    settings,
    (value) => {
      chrome.storage.local.set<{ [STORAGE_KEY]: AppSettings }>({
        [STORAGE_KEY]: value,
      });
    },
    { deep: true, immediate: false }
  );

  //

  const fetchAppStorage = async () => {
    const savedStorage = await chrome.storage.local.get<{
      [STORAGE_KEY]: AppSettings | undefined;
    }>(STORAGE_KEY);

    Object.assign(
      settings.value,
      savedStorage[STORAGE_KEY] ?? DEFAULT_APP_STORAGE
    );
  };

  //

  fetchAppStorage();

  return {
    settings,
    unwatch,
    fetchAppStorage,
    overlay,
  };
};

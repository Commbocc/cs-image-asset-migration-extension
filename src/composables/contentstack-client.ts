import { useContentstackAuth } from "@/composables/contentstack-auth";
import { computed } from "vue";
import { $fetch } from "ofetch";
import { useAppSettings } from "./settings";

export function useContentstackClient() {
  const { session, clearExpiredSession } = useContentstackAuth();
  const { settings } = useAppSettings();

  const client = computed(() => {
    const authtoken = session.value?.accessToken;
    return $fetch.create({
      baseURL: "https://api.contentstack.io/v3",
      headers: {
        Authorization: `Bearer ${authtoken}`,
        api_key: settings.value.apiKey,
      },
      async onResponseError({ response }) {
        if (response.status === 401) {
          await clearExpiredSession().catch(() => undefined);
        }
      },
    });
  });

  return { client };
}

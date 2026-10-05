import { addMessageListener } from "@/utils/messages";
import { loginToContentstack } from "@/utils/contentstack-auth";

addMessageListener({
  CONTENTSTACK_LOGIN: async () => {
    try {
      await loginToContentstack();
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : "Sign-in failed.",
      };
    }
  },
});

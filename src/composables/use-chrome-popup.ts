import { computed } from "vue";

export function useChromePopup() {
  const isInPopup = computed<boolean>(() => {
    return window.location.pathname.includes(`popup.html`);
  });

  return { isInPopup };
}

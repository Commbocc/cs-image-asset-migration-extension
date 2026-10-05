# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).

## Contentstack sign-in

The popup signs in with OAuth authorization code + PKCE. In Contentstack Developer Hub, add the extension's Chrome identity redirect URL to the OAuth app's allowed redirect URLs. Find the extension ID at `chrome://extensions`, then use `https://<extension-id>.chromiumapp.org/`. The redirect URL must match the one returned by `chrome.identity.getRedirectURL()`.

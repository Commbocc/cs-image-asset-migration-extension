# CS Image Asset Migration Extension

## Install in Chrome

1. Open the [extension releases](https://github.com/Commbocc/cs-image-asset-migration-extension/releases) and download the ZIP from the latest release.
2. Extract the downloaded ZIP to a folder on your computer.
3. Open [chrome://extensions](chrome://extensions) in Chrome and turn on **Developer mode**.
4. Select **Load unpacked** and choose the extracted folder containing `manifest.json`.

Keep the extracted folder in place while using the extension. To update, download and extract the latest release, then load the new folder from [chrome://extensions](chrome://extensions).

## Development

### Contentstack sign-in

The popup signs in with OAuth authorization code + PKCE. In Contentstack Developer Hub, add the extension's Chrome identity redirect URL to the OAuth app's allowed redirect URLs. Find the extension ID at `chrome://extensions`, then use `https://<extension-id>.chromiumapp.org/`. The redirect URL must match the one returned by `chrome.identity.getRedirectURL()`.

### Releases

From the project root, bump the version in `package.json` with Bun. Bun also creates a local Git tag for the new version:

```sh
bun pm version patch
# or: bun pm version minor
# or: bun pm version major
#manually: git tag vX.Y.Z
```

Keep the version in `public/manifest.json` in sync with `package.json`. To manually set or reset the tag to the current commit, replace `X.Y.Z` with the version and push it to the release remote:

```sh
git push origin vX.Y.Z
```

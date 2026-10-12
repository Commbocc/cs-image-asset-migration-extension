export const CONTENTSTACK_AUTH_SESSION_KEY = "contentstack-auth-session";

const APP_ID = "678a853b0398f20012b8dc75";
const CLIENT_ID = "9lkV1RqNV2U_-Za0";
const APP_URL = "https://app.contentstack.com";

export type ContentstackSession = {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
  userUid?: string;
  organizationUid?: string;
};

type TokenResponse = {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  user_uid?: string;
  organization_uid?: string;
  error?: string;
  error_description?: string;
};

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function randomBase64Url(byteLength: number): string {
  return toBase64Url(crypto.getRandomValues(new Uint8Array(byteLength)));
}

async function createCodeChallenge(verifier: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(verifier)
  );
  return toBase64Url(new Uint8Array(digest));
}

export async function loginToContentstack(): Promise<void> {
  let redirectUri = "";

  try {
    redirectUri = chrome.identity.getRedirectURL();
    const verifier = randomBase64Url(32);
    const state = randomBase64Url(32);
    const authorizeUrl = new URL(`${APP_URL}/apps/${APP_ID}/authorize`);
    authorizeUrl.search = new URLSearchParams({
      response_type: "code",
      client_id: CLIENT_ID,
      redirect_uri: redirectUri,
      scope: [
        "user:read",
        "cm.asset:read",
        "cm.asset:write",
        "cm.asset:publish",
        "cm.asset:unpublish",
        "cm.assets.management:read",
        "cm.assets.management:write",
        // "cm.assets.rt:read",
        // "cm.assets.rt:write",
        // "cm.environments.management:read",
      ].join(" "),
      state,
      code_challenge: await createCodeChallenge(verifier),
      code_challenge_method: "S256",
    }).toString();

    const callbackUrl = await chrome.identity.launchWebAuthFlow({
      url: authorizeUrl.toString(),
      interactive: true,
    });
    if (!callbackUrl) throw new Error("Sign-in was canceled.");

    const callback = new URL(callbackUrl);
    const callbackState = callback.searchParams.get("state");
    if (callbackState && callbackState !== state) {
      throw new Error("Sign-in could not be verified. Please try again.");
    }

    const providerError =
      callback.searchParams.get("error_description") ??
      callback.searchParams.get("error");
    if (providerError) throw new Error(providerError);

    const code = callback.searchParams.get("code");
    if (!code) {
      throw new Error("Contentstack did not return an authorization code.");
    }

    const tokenResponse = await fetch(`${APP_URL}/apps-api/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        client_id: CLIENT_ID,
        code_verifier: verifier,
      }),
    });

    const tokens = (await tokenResponse.json()) as TokenResponse;
    if (!tokenResponse.ok || !tokens.access_token) {
      throw new Error(
        tokens.error_description ??
          tokens.error ??
          "Contentstack sign-in failed."
      );
    }

    const session: ContentstackSession = {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: tokens.expires_in
        ? Date.now() + tokens.expires_in * 1000
        : undefined,
      userUid: tokens.user_uid,
      organizationUid: tokens.organization_uid,
    };

    await chrome.storage.session.set({
      [CONTENTSTACK_AUTH_SESSION_KEY]: session,
    });
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : "Sign-in failed.";
    if (/invalid.*redirect.?uri|redirect.?uri.*invalid/i.test(message)) {
      throw new Error(
        `${message} Add this exact redirect URI to the Contentstack OAuth app: ${redirectUri}`
      );
    }
    throw cause;
  }
}

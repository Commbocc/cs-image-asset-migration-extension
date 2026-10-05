type Messages = {
  TEST: {
    request: any;
    response: any;
  };
  CONTENTSTACK_LOGIN: {
    request: undefined;
    response: {
      ok: boolean;
      error?: string;
    };
  };
};

type Message = {
  [K in keyof Messages]-?: {
    type: K;
    payload: Messages[K]["request"];
  };
}[keyof Messages];

type Handlers = {
  [K in keyof Messages]: (
    payload: Messages[K]["request"]
  ) => Messages[K]["response"] | Promise<Messages[K]["response"]>;
};

/**
 *
 * @param tabId
 * @param type
 * @param payload
 * @returns
 */
export function sendTabMessage<K extends keyof Messages>(
  tabId: number,
  type: K,
  payload: Messages[K]["request"]
): Promise<Messages[K]["response"]> {
  return chrome.tabs.sendMessage(tabId, {
    type,
    payload,
  });
}

/**
 *
 * @param type
 * @param payload
 * @returns
 */
export function sendMessage<K extends keyof Messages>(
  type: K,
  payload: Messages[K]["request"]
): Promise<Messages[K]["response"]> {
  return chrome.runtime.sendMessage({
    type,
    payload,
  });
}

/**
 *
 * @param handlers
 */
export function addMessageListener(handlers: Partial<Handlers>) {
  chrome.runtime.onMessage.addListener(
    (message: Message, _sender, sendResponse) => {
      console.log("📨 RECEIVED:", message);
      const handler = handlers[message.type];

      Promise.resolve(handler?.(message.payload as never)).then(sendResponse);

      return true;
    }
  );
}

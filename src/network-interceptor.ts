import { insertNetworkRequest } from "./api/mutations/insertNetworkRequest.mutation";

let isInterceptorInitialized = false;

export const setupNetworkInterceptor = ({
  microfrontendId,
  sessionId,
  name,
}: {
  microfrontendId: string;
  sessionId: string;
  name: string;
}) => {
  if (isInterceptorInitialized) return;
  isInterceptorInitialized = true;

  //   console.log("[Spectra] Network Interceptor Initialized.");

  

  // Intercept fetch
  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    // console.log("request");
    const [resource, config] = args;
    const method = config?.method;

    if (method !== "GET" && method !== "POST") return originalFetch(...args);

    let requestUrl = "";

    if (typeof resource === "string") {
      requestUrl = resource;
    } else if (resource instanceof URL) {
      requestUrl = resource.toString();
    } else if (resource instanceof Request) {
      requestUrl = resource.url;
    }

    if (requestUrl.includes(import.meta.env.VITE_HASURA_GRAPHQL_ENDPOINT)) {
      //   console.log("log request, skipping...");
      return originalFetch(...args); // skip logging and use original fetch
    }

    // Check for the x-spectra-microfrontend header
    const isSpectraRequest =
      getHeaderValue(config?.headers, "x-spectra-microfrontend") === name;

    if (!isSpectraRequest) {
      // If this request is not from the intended microfrontend, skip it
      //   console.log("no spectra marked request, skipping ...");
      return originalFetch(...args);
    }

    const requestPayload =
      config?.body && typeof config.body === "string"
        ? config.body
        : config?.body instanceof FormData
        ? "[FormData]"
        : config?.body
        ? "[Non-String Body]"
        : "[No Body]";

    const startTime = performance.now();

    try {
      const response = await originalFetch(...args);
      const endTime = performance.now();

      const cloned = response.clone();
      const contentType = cloned.headers.get("content-type") || "";
      let responseBody: any = "[Non-JSON Response]";

      if (contentType.includes("application/json")) {
        try {
          responseBody = await cloned.json();
        } catch {
          responseBody = "[Invalid JSON]";
        }
      } else if (contentType.includes("text")) {
        responseBody = await cloned.text();
      }

      //   console.log("[Spectra] HTTP Request", {
      //     method,
      //     url: requestUrl,
      //     payload: requestPayload,
      //     timeTaken: `${(endTime - startTime).toFixed(2)} ms`,
      //     responseSize:
      //       typeof responseBody === "string"
      //         ? responseBody.length
      //         : JSON.stringify(responseBody).length,
      //     status: response.status,
      //     response: responseBody,
      //     headers: config?.headers,
      //   });

      insertNetworkRequest({
        microfrontend_id: microfrontendId,
        session_id: sessionId,
        url: requestUrl,
        method,
        time_taken_ms: endTime - startTime,
        payload: JSON.stringify(requestPayload),
        headers: JSON.stringify(config?.headers),
        response_body: JSON.stringify(responseBody),
        response_size_bytes:
          typeof responseBody === "string"
            ? responseBody.length
            : JSON.stringify(responseBody).length,
        status: response.status,
      });

      return response;
    } catch (error) {
      console.error("[Spectra] Fetch Error:", {
        method,
        url: requestUrl,
        error,
      });
      throw error;
    }
  };

  const OriginalWebSocket = window.WebSocket;
  class SpectraWebSocket extends OriginalWebSocket {
    constructor(url: string | URL, protocols?: string | string[]) {
      super(url, protocols);
      //   console.log("[Spectra] WebSocket Connected:", url);

      this.addEventListener("open", () => {
        // console.log("[Spectra] WebSocket Opened:", url);
      });

      this.addEventListener("message", (event) => {
        // console.log("[Spectra] WebSocket Message Received:", {
        //   url,
        //   data: event.data,
        // });
      });

      this.addEventListener("close", () => {
        // console.log("[Spectra] WebSocket Closed:", url);
      });

      this.addEventListener("error", (e) => {
        // console.error("[Spectra] WebSocket Error:", {
        //   url,
        //   error: e,
        // });
      });
    }

    send(data: string | ArrayBufferLike | Blob | ArrayBufferView) {
      //   console.log("[Spectra] WebSocket Message Sent:", {
      //     url: this.url,
      //     data,
      //   });
      super.send(data);
    }
  }

  window.WebSocket = SpectraWebSocket;
};

const getHeaderValue = (
  headers: HeadersInit | undefined,
  headerName: string
): string | null => {
  if (!headers) return null;

  if (Array.isArray(headers)) {
    // headers is of type [string, string][] (array of tuples)
    const header = headers.find(
      ([key]) => key.toLowerCase() === headerName.toLowerCase()
    );
    return header ? header[1] : null;
  }

  if (headers instanceof Headers) {
    // headers is an instance of Headers (browser Headers object)
    return headers.get(headerName);
  }

  if (typeof headers === "object") {
    // headers is of type Record<string, string>
    return headers[headerName] || null;
  }

  return null;
};

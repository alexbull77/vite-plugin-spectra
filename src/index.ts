import { insertMicrofrontend } from "./api/mutations/insertMicrofrontend.mutation";
import { setupNetworkInterceptor } from "./network-interceptor";
import { setupPerformanceTracking } from "./performance-tracker";

export type SpectraPluginOptions = {
  networkInterceptor?: boolean;
  performanceTracking?: boolean;
  name: string;
  version: string;
  sessionId: string;
};

export const SpectraMonitor = (options: SpectraPluginOptions) => {
  setupMonitor(options);
  return null;
};

const setupMonitor = async ({
  networkInterceptor,
  name,
  performanceTracking,
  version,
  sessionId,
}: SpectraPluginOptions) => {
  if (performanceTracking) setupPerformanceTracking({ sessionId });

  const microfrontendId = await insertMicrofrontend({
    name,
    version,
    session_id: sessionId,
  });

  const globalKey = `__spectra_tracking_${microfrontendId}_${sessionId}`;

  if ((window as any)[globalKey]) {
    console.log(`[Spectra] Skipping duplicate tracker for ${microfrontendId}`);
    return;
  }

  (window as any)[globalKey] = true;

  if (!sessionId || !microfrontendId) {
    throw new Error(
      `Failed to start plugin: sessionId:${sessionId}, microfrontendId:${microfrontendId}`
    );
  }

  if (networkInterceptor)
    setupNetworkInterceptor({ microfrontendId, sessionId, name });
};

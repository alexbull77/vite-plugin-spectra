import { setupEventLoopTracker } from "./event-loop-tracker";
import { setupFpsCounter } from "./fps-counter";
import { setupLocalStorageTracker } from "./local-storage-tracker";
import { setupMemoryTracker } from "./memory-tracker";

export const setupPerformanceTracking = ({
  sessionId,
}: {
  sessionId: string;
}) => {
  const globalKey = `__spectra_performance_tracking_session_${sessionId}`;

  if ((window as any)[globalKey]) {
    // console.log(
    //   `[Spectra] Skipping duplicate tracker for sessionId: ${globalKey}`
    // );
    return;
  }

  (window as any)[globalKey] = true;

  setupFpsCounter({ sessionId });
  setupMemoryTracker({ sessionId });
  setupEventLoopTracker({ sessionId });
  setupLocalStorageTracker({ sessionId });

  //   console.log("[Spectra] Performance Tracking Initialized ✅");
};

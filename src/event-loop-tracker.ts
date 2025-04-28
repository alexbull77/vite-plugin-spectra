import { insertEventLoopLog } from "./api";

export const setupEventLoopTracker = ({ sessionId }: { sessionId: string }) => {
  const eventLoopObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();

    entries.forEach((entry) => {
      const { entryType, duration } = entry;

      insertEventLoopLog({
        type: entryType,
        session_id: sessionId,
        duration_ms: +duration.toFixed(2),
      });
    });
  });

  eventLoopObserver.observe({
    entryTypes: [
      "longtask",
      "paint",
      "long-animation-frame",
      "layout-shift",
      "largest-contentful-paint",
      "first-input",
    ],
  });
};

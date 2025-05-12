import { insertLocalStorageMetrics } from "./api";

export const setupLocalStorageTracker = ({
  sessionId,
}: {
  sessionId: string;
}) => {
  let readCount = 0;
  let writeCount = 0;

  const originalGetItem = localStorage.getItem;
  const originalSetItem = localStorage.setItem;

  // Monkey-patch for counting read/write
  localStorage.getItem = function (...args) {
    readCount++;
    return originalGetItem.apply(this, args);
  };

  localStorage.setItem = function (...args) {
    writeCount++;
    return originalSetItem.apply(this, args);
  };

  const estimateQuota = async () => {
    if ("storage" in navigator && "estimate" in navigator.storage) {
      const { usage, quota } = await navigator.storage.estimate();
      return { usage: usage ?? 0, quota: quota ?? 0 };
    }
    return { usage: 0, quota: 5 * 1024 * 1024 }; // fallback: assume 5MB
  };

  const getLocalStorageSize = () => {
    let totalSize = 0;
    let maxEntrySize = 0;
    let largestKey = "";
    const keys = Object.keys(localStorage);

    for (const key of keys) {
      const value = localStorage.getItem(key) ?? "";
      const size = (key.length + value.length) * 2; // bytes
      totalSize += size;

      if (size > maxEntrySize) {
        maxEntrySize = size;
        largestKey = key;
      }
    }

    return {
      totalSizeKB: totalSize / 1024,
      entryCount: keys.length,
      averageSizeKB: keys.length > 0 ? totalSize / keys.length / 1024 : 0,
      largestKey,
      largestKeySizeKB: maxEntrySize / 1024,
    };
  };

  const interval = setInterval(async () => {
    const {
      totalSizeKB,
      entryCount,
      averageSizeKB,
      largestKey,
      largestKeySizeKB,
    } = getLocalStorageSize();
    const { usage, quota } = await estimateQuota();

    insertLocalStorageMetrics({
      session_id: sessionId,
      total_keys: entryCount,
      total_size_kb: totalSizeKB,
      average_entry_size_kb: averageSizeKB,
      largest_key: largestKey,
      largest_key_size_kb: largestKeySizeKB,
      read_ops: readCount,
      write_ops: writeCount,
      quota_used_percentage: (usage / quota) * 100,
    });
  }, 3000);

  return () => {
    clearInterval(interval);
    localStorage.getItem = originalGetItem;
    localStorage.setItem = originalSetItem;
  };
};

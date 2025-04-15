import { insertMemoryLog } from './api/mutations/insertMemoryLog.mutation'

export const setupMemoryTracker = ({ sessionId }: { sessionId: string }) => {
    if ('memory' in performance) {
        setInterval(() => {
            const memory = (performance as any).memory
            const used = (memory.usedJSHeapSize / 1024 / 1024).toFixed(2)
            const total = (memory.totalJSHeapSize / 1024 / 1024).toFixed(2)
            const limit = (memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)

            insertMemoryLog({
                session_id: sessionId,
                js_heap_limit_mb: +used,
                js_heap_total_mb: +total,
                heap_limit: +limit,
            })
        }, 3000)
    }
}

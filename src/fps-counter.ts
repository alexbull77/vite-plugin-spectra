import { insertFpsLog } from "./api/mutations/insertFpsLog.mutation"

export const setupFpsCounter = ({ sessionId }: { sessionId: string }) => {
    let lastTimestamp = performance.now()
    let minEstimatedFPS = 60

    const expected = 100

    setInterval(() => {
        const now = performance.now()
        const delta = now - lastTimestamp
        lastTimestamp = now

        const drift = delta - expected

        if (drift > 50) {
            const estimatedFPS = Math.round(1000 / delta)
            minEstimatedFPS = Math.min(minEstimatedFPS, estimatedFPS)

            console.warn('[Spectra] Possible Lag Detected:', {
                drift: drift.toFixed(2) + ' ms',
                estimatedFPS,
            })
        }
    }, 100)

    // ✅ Every 3 seconds, insert the worst (min) FPS observed
    setInterval(() => {
        const reportedFPS = minEstimatedFPS

        insertFpsLog({
            session_id: sessionId,
            fps: reportedFPS,
        })

        console.log('[Spectra] Inserted FPS log:', reportedFPS)

        // Reset for next window
        minEstimatedFPS = 60
    }, 3000)
}

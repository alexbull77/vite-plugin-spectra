import { insertCpuMetrics } from './api/mutations/insertCpuMetrics.mutation'
import { setupFpsCounter } from './fps-counter'
import { setupMemoryTracker } from './memory-tracker'

export const setupPerformanceTracking = ({ sessionId }: { sessionId: string }) => {
    // Guard: Skip setup if already initialized for this session
    const globalKey = `__spectra_performance_tracking_session_${sessionId}`

    if (localStorage.getItem(globalKey)) {
        console.log(`[Spectra] Skipping duplicate tracker for sessionId: ${sessionId}`)
        return
    }

    // ✅ Mark as initialized for this session in localStorage
    localStorage.setItem(globalKey, 'true')
    setupFpsCounter({ sessionId })
    setupMemoryTracker({ sessionId })

    // window.addEventListener('load', () => {
    //     setTimeout(() => {
    //         const paintEntries = performance.getEntriesByType('paint') as PerformanceEntry[]
    //         const fcp = paintEntries.find((entry) => entry.name === 'first-contentful-paint')
    //         const fp = paintEntries.find((entry) => entry.name === 'first-paint')

    //         const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    //         const tti = nav.domInteractive - nav.startTime
    //         const load = nav.loadEventEnd - nav.startTime

    //         console.log('[Spectra] Page Performance:', {
    //             firstPaint: fp?.startTime.toFixed(2) + ' ms',
    //             firstContentfulPaint: fcp?.startTime.toFixed(2) + ' ms',
    //             timeToInteractive: tti.toFixed(2) + ' ms',
    //             totalLoadTime: load.toFixed(2) + ' ms',
    //         })
    //     }, 0)
    // })

    // setInterval(() => {
    //     const t0 = performance.now()
    //     for (let i = 0; i < 1000000; i++) {
    //         Math.sqrt(i) // simulate work
    //     }
    //     const t1 = performance.now()
    //     const cpuEstimate = (t1 - t0).toFixed(2)
    //     insertCpuMetrics({ estimated_load_ms: +cpuEstimate })
    //     console.log('[Spectra] Estimated CPU Load:', `${cpuEstimate} ms for loop of 1M`)
    // }, 10000)

    console.log('[Spectra] Performance Tracking Initialized ✅')
}

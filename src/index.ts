import { insertMicrofrontend } from './api/mutations/insertMicrofrontend.mutation'
import { setupNetworkInterceptor } from './network-interceptor'
import { setupPerformanceTracking } from './performance-tracker'
import { PluginOption } from 'vite'

export type SpectraPluginOptions = {
    networkInterceptor?: boolean
    performanceTracking?: boolean
    name: string
    version: string
    sessionId: string
}

export const SpectraMonitor = (options: SpectraPluginOptions) => {
    setupMonitor(options)
    return null
}

const setupMonitor = async ({
    networkInterceptor,
    name,
    performanceTracking,
    version,
    sessionId,
}: SpectraPluginOptions) => {
    if (performanceTracking) setupPerformanceTracking({ sessionId })

    const microfrontendId = await insertMicrofrontend({ name, version, session_id: sessionId })

    const globalKey = `__spectra_tracking_${microfrontendId}_${sessionId}`

    if ((window as any)[globalKey]) {
        console.log(`[Spectra] Skipping duplicate tracker for ${microfrontendId}`)
        return
    }

    // ✅ Set only after confirming it wasn't already set
    ;(window as any)[globalKey] = true

    if (!sessionId || !microfrontendId) {
        throw new Error(`Failed to start plugin: sessionId:${sessionId}, microfrontendId:${microfrontendId}`)
    }

    if (networkInterceptor) setupNetworkInterceptor({ microfrontendId, sessionId, name })
}

// export const viteSpectraHeaderPlugin = (name: string) => {
//     const plugin: PluginOption = {
//         name: 'vite-plugin-spectra-header',
//         transform(code, id) {
//             if (id.endsWith('.ts')) {
//                 const headerInjection = `
//                     const originalFetch = window.fetch;
//                     window.fetch = async (...args) => {
//                         let [resource, config] = args;
//                         config = config || {};
//                         config.headers = config.headers || {};

//                         // Add the x-spectra-microfrontend header
//                         config.headers['x-spectra-microfrontend'] = '${name}';

//                         return originalFetch(resource, config);
//                     };
//                 `
//                 return {
//                     code: headerInjection + code,
//                     map: null, // You can generate source maps here if needed
//                 }
//             }
//             return code
//         },
//     }

//     return plugin
// }

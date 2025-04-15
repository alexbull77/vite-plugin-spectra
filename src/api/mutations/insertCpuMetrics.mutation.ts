import { getSpectraClient, graphql, VariablesOf } from '../client'

const insertCpuMetricsMutation = graphql(`
    mutation insertCpuMetrics($object: cpu_metrics_insert_input!) {
        insert_cpu_metrics_one(object: $object) {
            id
        }
    }
`)

export const insertCpuMetrics = async (object: VariablesOf<typeof insertCpuMetricsMutation>['object']) => {
    try {
        const client = await getSpectraClient()

        const { data, error } = await client.mutation(insertCpuMetricsMutation, { object })

        if (error) console.error(error)

        return data?.insert_cpu_metrics_one?.id
    } catch (e) {
        console.error(e)
    }
}

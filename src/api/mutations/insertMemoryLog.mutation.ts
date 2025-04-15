import { getSpectraClient, graphql, VariablesOf } from '../client'

const insertMemoryLogMutation = graphql(`
    mutation insertMemoryLog($object: memory_logs_insert_input!) {
        insert_memory_logs_one(object: $object) {
            id
        }
    }
`)

export const insertMemoryLog = async (object: VariablesOf<typeof insertMemoryLogMutation>['object']) => {
    try {
        const client = await getSpectraClient()

        const { data, error } = await client.mutation(insertMemoryLogMutation, { object })

        if (error) console.error(error)

        return data?.insert_memory_logs_one?.id
    } catch (e) {
        console.error(e)
    }
}

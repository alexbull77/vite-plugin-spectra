import { getSpectraClient, graphql, VariablesOf } from '../client'

const insertFpsLogMutation = graphql(`
    mutation insertFpsLog($object: fps_logs_insert_input!) {
        insert_fps_logs_one(object: $object) {
            id
        }
    }
`)

export const insertFpsLog = async (object: VariablesOf<typeof insertFpsLogMutation>['object']) => {
    try {
        const client = await getSpectraClient()

        const { data, error } = await client.mutation(insertFpsLogMutation, { object })

        if (error) console.error(error)

        return data?.insert_fps_logs_one?.id
    } catch (e) {
        console.error(e)
    }
}

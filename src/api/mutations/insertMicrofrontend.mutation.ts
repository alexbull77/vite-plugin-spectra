import { getSpectraClient, graphql, VariablesOf } from '../client'

const insertMicrofrontendMutation = graphql(`
    mutation registerMicrofrontend($object: microfrontends_insert_input!) {
        insert_microfrontends_one(
            object: $object
            on_conflict: { constraint: microfrontends_name_version_key, update_columns: loaded_at }
        ) {
            id
        }
    }
`)

export const insertMicrofrontend = async (object: VariablesOf<typeof insertMicrofrontendMutation>['object']) => {
    try {
        const client = await getSpectraClient()

        const { data, error } = await client.mutation(insertMicrofrontendMutation, { object })

        if (error) console.error(error)

        return data?.insert_microfrontends_one?.id
    } catch (e) {
        console.error(e)
    }
}

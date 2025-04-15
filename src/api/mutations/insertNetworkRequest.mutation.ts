import { getSpectraClient, graphql, VariablesOf } from '../client'

const insertNetworkRequestMutation = graphql(`
    mutation insertNetworkRequest($object: network_requests_insert_input!) {
        insert_network_requests_one(object: $object) {
            id
        }
    }
`)

export const insertNetworkRequest = async (object: VariablesOf<typeof insertNetworkRequestMutation>['object']) => {
    try {
        const client = await getSpectraClient()

        const { data, error } = await client.mutation(insertNetworkRequestMutation, { object })

        if (error) console.error(error)

        return data?.insert_network_requests_one?.id
    } catch (e) {
        console.error(e)
    }
}

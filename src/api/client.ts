import { initGraphQLTada } from "gql.tada";
import { introspection } from "../../generated/spectra-graphql-env";
import { Client, ClientOptions, createClient, fetchExchange } from "@urql/core";

const initTadaClient = ({
  clientOptions,
  url,
  secret,
}: {
  clientOptions?: Partial<ClientOptions>;
  url: string;
  secret: string;
}) => {
  let tadaClient: Client | undefined = undefined;

  const getClient = async (): Promise<Client> => {
    tadaClient = await createTadaClient({ clientOptions });
    return tadaClient;
  };

  async function createTadaClient({
    clientOptions,
  }: {
    clientOptions?: Partial<ClientOptions>;
  }): Promise<Client> {
    const _clientOptions = clientOptions || {};

    if (!clientOptions?.url) {
      _clientOptions.url = url;
    }

    _clientOptions.exchanges = [
      fetchExchange,
      ...(_clientOptions.exchanges || []),
    ];

    return createClient({
      ..._clientOptions,
      requestPolicy: _clientOptions.requestPolicy || "network_only",
      fetchOptions: {
        headers: {
          "x-hasura-admin-secret": secret,
        },
      },
    } as ClientOptions);
  }

  return { getClient };
};

export const graphql = initGraphQLTada<{
  introspection: introspection;
  scalars: {
    uuid: string;
    bigint: number;
    smallint: number;
    jsonb: any;
    date: string;
    timestamptz: string;
    String: string;
    Guid: string;
    DateTime: string;
  };
}>();

export type { introspection };
export type { FragmentOf, ResultOf, VariablesOf } from "gql.tada";
export { readFragment } from "gql.tada";
export const { getClient: getSpectraClient } = initTadaClient({
  url: import.meta.env.VITE_HASURA_GRAPHQL_ENDPOINT,
  secret: import.meta.env.VITE_HASURA_ADMIN_SECRET,
});

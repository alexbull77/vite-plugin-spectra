import { getSpectraClient, graphql, VariablesOf } from "../client";

const insertLocalStorageMetricsMutation = graphql(`
  mutation insertLocalStorageMetrics(
    $object: local_storage_metrics_insert_input!
  ) {
    insert_local_storage_metrics_one(object: $object) {
      id
    }
  }
`);

export const insertLocalStorageMetrics = async (
  object: VariablesOf<typeof insertLocalStorageMetricsMutation>["object"]
) => {
  try {
    const client = await getSpectraClient();

    const { data, error } = await client.mutation(
      insertLocalStorageMetricsMutation,
      { object }
    );

    if (error) console.error(error);

    return data?.insert_local_storage_metrics_one?.id;
  } catch (e) {
    console.error(e);
  }
};

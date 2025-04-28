import { getSpectraClient, graphql, VariablesOf } from "../client";

const insertEventLoopLogMutation = graphql(`
  mutation insertEventLoopLog($object: event_loop_logs_insert_input!) {
    insert_event_loop_logs_one(object: $object) {
      id
    }
  }
`);

export const insertEventLoopLog = async (
  object: VariablesOf<typeof insertEventLoopLogMutation>["object"]
) => {
  try {
    const client = await getSpectraClient();

    const { data, error } = await client.mutation(insertEventLoopLogMutation, {
      object,
    });

    if (error) console.error(error);

    return data?.insert_event_loop_logs_one?.id;
  } catch (e) {
    console.error(e);
  }
};

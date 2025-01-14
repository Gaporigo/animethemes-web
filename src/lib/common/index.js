import { graphql, print } from "graphql";

export function buildFetchData(schema, throwOnError = true) {
    return async (query, args = {}, context = {}) => {
        const result = await graphql(schema, typeof query === "string" ? query : print(query), null, context, args);

        if (result.errors) {
            console.error(JSON.stringify(result.errors, null, 2));
            if (throwOnError) {
                throw result.errors;
            }
        }

        result.apiRequests = context.apiRequests ?? 0;

        return result;
    };
}

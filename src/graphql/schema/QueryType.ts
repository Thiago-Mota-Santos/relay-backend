import { GraphQLNonNull, GraphQLObjectType } from "graphql";
import { connectionArgs, connectionFromArray } from "graphql-relay";

import * as PostLoader from '../post/PostLoader'
import { PostConnection } from "../post/PostType";

export const QueryType = new GraphQLObjectType({
    name: 'Query',
    description: "The root of all queries",
    fields: () => ({
        posts:{
            type: new GraphQLNonNull(PostConnection),
            args: connectionArgs,

            resolve: async (_, args) => {
                const data = await PostLoader.LoadAll();
                return connectionFromArray(data, args);
            }
        }
    })
})
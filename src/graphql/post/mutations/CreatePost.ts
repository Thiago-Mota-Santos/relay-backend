import { GraphQLNonNull, GraphQLString } from 'graphql'
import { mutationWithClientMutationId, toGlobalId } from 'graphql-relay'
import { resolve } from 'path'
import { readDatabase } from '../../../utils';
import { randomUUID } from 'node:crypto';
import { PostEdge } from '../PostType';
import fs from 'fs'

interface PostType {
    id: string;
    title: string;
    body: string
}

export default mutationWithClientMutationId({
    name: 'CreatePost',
    inputFields: {
        title: {
            type: new GraphQLNonNull(GraphQLString)
        },
        body:{
            type: new GraphQLNonNull(GraphQLString)
        }
    },

    mutateAndGetPayload: async ({ title, body }) => {
        const source = resolve(__dirname, '..', '..', '..', '..');

        const data = await readDatabase();

        const post = {
            id: randomUUID(),
            title,
            body
        }

        let posts: PostType[] = [];

        if(data.posts){
            posts =  [
                ...data.posts,
                {
                    ...post
                }
            ]
        }else{
            posts = [
                {
                    ...post
                }
            ]
        }


        await fs.writeFileSync(`${source}/data.json`, JSON.stringify({
            ...data,
            posts
        }));

        return{
            post,
            error: null,
            sucess: 'post sucessfully created'
        }

    },
        outputFields: {
            postEdge:{
                type: PostEdge,
                resolve: async ({ post }) => {
                    if(!post){
                        return null;
                    }
                    return {
                        cursor: toGlobalId('Post', post.id),
                        node: post
                    }
                }
            },
            error: {
                type: GraphQLString,
                resolve: ({ error}: { error: string}) => error
            },
            success: {
                type: GraphQLString,
                resolve: ({ success }: { success: string}) => success
            }
        }
})
import { readDatabase } from "../../utils";

export async function LoadAll(){
    const posts = await readDatabase("posts");

    if(!posts){
        return null;
    }

    return posts.reverse();
}
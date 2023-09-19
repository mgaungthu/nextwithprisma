'use client'
import axios from "axios"
import AddPost from './components/AddPost'
import {useQuery} from '@tanstack/react-query'
import Post from "./components/Post"

const allPosts = async() => {
  const response = await axios.get("/api/posts/getPosts")
 
  return response.data
}

type IPost =  {
  title:string
  id:string
  user:{
    name:string
    image:string
  }
}

export default function Home() {

  const {data, error, isLoading} = useQuery<IPost[]>({queryFn: allPosts, queryKey: ["posts"]})
  if(error) return error
  if(isLoading) return "Loading...."


  return (
    <main>
        <h1>Hello Next</h1> 
        <AddPost />

        {data?.map((post) => (
          <Post key={post.id} id={post.id} name={post.user.name} avator={post.user.image} postTitle={post.title} />
        ))}
    </main>
  )
}

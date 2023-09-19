"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast"
import axios, {AxiosError} from "axios";


export default function CreatePost() {
  const [title, setTitle] = useState<string>("");
  const [isDisabled, SetIsDisabled] = useState<boolean>(false);
  let toastPostID : string = "box1"
  const queryClient = useQueryClient()
  //Create a post
  const { mutate } = useMutation(
    async (title : string) => await axios.post("/api/posts/addPost", { title }),
    {
        onError: (error) => {
            if (error instanceof AxiosError) {
                toast.error(error?.response?.data.message, { id: toastPostID })
              }
            SetIsDisabled(false);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['posts'])
            toast.success("Post has been made!!!", { id: toastPostID })
            setTitle("")
            SetIsDisabled(false)
        }
    }
  )

  const submitPost = async (e : React.FormEvent) => {
    e.preventDefault()
    SetIsDisabled(true)
    toastPostID = toast.loading("Creating your post", { id: toastPostID } )
    mutate(title)
  };

  return (
    <form onSubmit={submitPost} className="bg-white my-8 p-5 rounded-md">
      <div className="flex flex-col my-4">
        <textarea
          name="title"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          placeholder="What`s on your mind?"
          className="p-4 text-lg rounded-md my-2 bg-gray-200"
        ></textarea>
      </div>
      <div className="flex items-center justify-between gap-2">
        <p
          className={`font-bold text-sm 
                ${title.length > 300 ? "text-red-700" : "text-gray-700"} `}
        >
          {`${title.length}/300`}
        </p>
        <button
          disabled={isDisabled}
          className="text-sm bg-teal-600 text-white py-2 px-6 rounded-xl disabled:opacity-25"
          type="submit"
        >
          Create a post
        </button>
      </div>
    </form>
  );
}

"use client"
import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {Plus} from 'lucide-react'
import { useMutation } from "@tanstack/react-query";
import { addTodo } from "@/action/todo-action";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export function TodoForm() {
    const queryClient = useQueryClient()
    const [title, setTitle] = useState("")
    const mutation = useMutation({
        mutationFn:(data)=>addTodo(data),
        onSuccess:()=>{
            //toto : invalidation 
            queryClient.invalidateQueries({queryKey:["todos"]})
            toast.success("Todo Added sucessfully")
        },
        onError:(e)=>{
            toast.error("Failed to Add todo")
        }
    })

    const handleSubmit = async (e) => {
        e.preventDefault();
        mutation.mutate({title},{
            onSuccess:()=>{
                setTitle("")
            }
        })
    }

    return (
        <form onSubmit={handleSubmit} className="flex gap-3 mb-8">
            <Input 
            value = {title}
            type={"text"}
            placeholder="Add a new task"
            onChange={(e)=>setTitle(e.target.value)}
            className={"flex-1"}
            disabled={mutation.isPending}
            />
            <Button type="submit">
                <Plus size={20} className='mr-2' />
                {
                    mutation.isPending ? "Adding....." : "Add"
                }
            </Button>
        </form>
    )
}
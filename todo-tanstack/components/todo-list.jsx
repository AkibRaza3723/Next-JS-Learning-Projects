"use client"
import React from "react";
import {TodoItem} from './todo-item';
import { useQuery } from "@tanstack/react-query";
import { getTodos } from "@/action/todo-action";
import { Loader2 } from "lucide-react";

export const TodoList = () => {
    const {data:todos , isPending, error}= useQuery({
        queryKey:["todos"],
        queryFn:()=>getTodos()
    }) //named the data to todos so that we can use them using todos - simple javascript logic

    if(isPending){
        return(
            <Loader2 className="animate-spin" />
        )
    }

    if(error){
        return(
            <div className="flex justify-center p-8">
                Failed to load todos. {error}
            </div>
        )
    }

    if(!todos && todos.length === 0){
        return(
            <div className="text-center p-8 text-muted-foreground">
                No Task yet, Add one todo to get started.
            </div>
        )
    }

    return(
        <div className="space-y-1">
            {
                todos.map((todo)=>(
                    <TodoItem key={todo._id} todo={todo}/>
                ))
            }

        </div>
    )
}
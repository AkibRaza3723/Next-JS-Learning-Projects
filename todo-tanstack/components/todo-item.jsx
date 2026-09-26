import React, { use } from "react";
import { Checkbox } from "./ui/checkbox";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Trash } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTodo, toggleTodo } from "@/action/todo-action";
import { toast } from "sonner";

export const TodoItem = ({todo}) => {
    const queryClient = useQueryClient();

    const {mutate:toggle} = useMutation({
        mutationFn:({id,completed})=>toggleTodo(id,completed),
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:["todos"]})
        },
        onError:(err)=>{
            toast.err(err)
        }
    })

    const {mutate:remove} = useMutation({

        mutationFn:(id)=>deleteTodo(id),
        onSuccess:()=>{
            toast.success("Deleted sucesfully")
            queryClient.invalidateQueries({queryKey:["todos"]})
        },
        onError:(err)=>{
            toast.err(err)
        }
    })

    return (
        <div className="flex item-center justify-between p-4 bg-card border rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex item-center gap-3">
                <Checkbox 
                checked={todo.completed}
                onCheckedChange={(checked)=>toggle({id:todo._id, completed:checked})}
                id = {`todo-${todo._id}`}
                />
                <label
                htmlFor={`todo-${todo._id}`} // to uniquely identify it 
                className={cn(
                    "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer",
                    todo.completed && "line-through "
                )} //cn function help to write dynamic classname very easily
                >
                    {todo.title}
                </label>
            </div>
            <Button variant={"ghost"} size={"icon"} onClick={()=>remove(todo._id)}>
                <Trash size={18} className="text-destructive" />
            </Button>
        </div>
    )
}
import { Flex, Spinner, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import TodoItem from "./TodoItem";
import { useQuery } from "@tanstack/react-query";

export type Todo = {
    _id: number;
    body: string;
    completed: boolean;
}

const TodoList = () => {
	const { data: todos, isLoading } = useQuery({
        queryKey: ["todos"],
        queryFn: async () => {
            try {
                const res = await fetch("http://localhost:5000/api/todos");
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Something went wrong");
                }

                return data || [];
            } catch (error) {
                console.log(error);
            }
        }
    })

	return (
		<>
			<Text fontSize={"4xl"} textTransform={"uppercase"} fontWeight={"bold"} textAlign={"center"} my={2}>
				Today's Tasks
			</Text>
			{isLoading && (
				<Flex justifyContent={"center"} my={4}>
					<Spinner size={"xl"} />
				</Flex>
			)}
			{!isLoading && todos?.length === 0 && (
				<Stack alignItems={"center"} gap='3'>
					<Text fontSize={"xl"} textAlign={"center"} color={"gray.500"}>
						All tasks completed! 🤞
					</Text>
				</Stack>
			)}
			<Stack gap={3}>
				{todos?.map((todo : any) => (
					<TodoItem key={todo._id} todo={todo} />
				))}
			</Stack>
		</>
	);
};
export default TodoList;
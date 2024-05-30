import { Badge, Box, Flex, Spinner, Text } from "@chakra-ui/react";
import { FaCheckCircle } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Todo } from "./TodoList";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "../App";

const TodoItem = ({ todo }: { todo: Todo }) => {
    const queryClient = useQueryClient();
    var isDeleting: boolean = false
    var isUpdating: boolean = false
    
    const { mutate: updateTodo} = useMutation({
        mutationKey: ["updateTodo"],
        mutationFn: async (kind: string) => {
            if (kind == "PATCH") {
                isUpdating = true;
                if (todo.completed) {
                    return alert("Todo is already completed");
                }
            } else {
                isDeleting = true;
            }

            try {
                const res = await fetch(BASE_URL + `/todos/${todo._id}`, {
                    method: kind,
                });

                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.error || "Something went wrong");
                }

                isDeleting = false;
                isUpdating = false;
                return data;
            } catch (error) {
                console.log(error);
            }
            isDeleting = false;
            isUpdating = false;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todos"] });
        },
    });
	return (
		<Flex gap={2} alignItems={"center"}>
			<Flex
				flex={1}
				alignItems={"center"}
				border={"1px"}
				borderColor={"gray.600"}
				p={2}
				borderRadius={"lg"}
				justifyContent={"space-between"}
			>
				<Text
					color={todo.completed ? "green.200" : "yellow.100"}
					textDecoration={todo.completed ? "line-through" : "none"}
				>
					{todo.body}
				</Text>
				{todo.completed && (
					<Badge ml='1' colorScheme='green'>
						Done
					</Badge>
				)}
				{!todo.completed && (
					<Badge ml='1' colorScheme='yellow'>
						In Progress
					</Badge>
				)}
			</Flex>
			<Flex gap={2} alignItems={"center"}>
				<Box color={"green.500"} cursor={"pointer"} onClick={() => updateTodo("PATCH")}>
                    {!isUpdating && <FaCheckCircle size={20} />}
                    {isUpdating && <Spinner size={"sm"} />}
				</Box>
                <Box color={"red.500"} cursor={"pointer"} onClick={() => updateTodo("DELETE")}>
                    {!isDeleting && <MdDelete size={25} />}
                    {isDeleting && <Spinner size={"sm"} />}
				</Box>
			</Flex>
		</Flex>
	);
};
export default TodoItem;
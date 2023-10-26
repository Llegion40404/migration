import axios from "axios";
import type { Task } from "../../../types/Task";
export async function deleteTodo(todo: Task) {
	return (await axios.delete(`http://localhost:8043/todos/${todo.id}/`)).data;
}

import axios from "axios";
import type { Task } from "../../types/Task";
export async function updateTodo(todo: Task) {
	return (await axios.put("http://localhost:8080/todos/" + todo.id, todo)).data;
}

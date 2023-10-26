import axios from "axios";
import type { Task } from "../../../types/Task";

export async function postTodo(todo: Task) {
	return await axios.post(`http://localhost:8043/todos/`, todo);
}

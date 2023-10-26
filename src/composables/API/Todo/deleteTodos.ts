import axios from "axios";
import type { Project } from "../../../types/Project";
import type { Task } from "../../../types/Task";

export async function deleteTodos(project: Project) {
	let url = "http://localhost:8043/todos";
	let res = await axios.get(`${url}?prId=${project.id}`);
	res.data.forEach((t: Task) => {
		axios.delete(url + t.id);
	});
}

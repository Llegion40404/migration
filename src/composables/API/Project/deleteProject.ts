import axios from "axios";
import type { Project } from "../../../types/Project";
import { deleteTodos } from "../Todo/deleteTodos";

export async function deleteProject(project: Project) {
	const url = "http://localhost:8080/projects/";
	const res = axios.delete(url + project.id);
	await deleteTodos(project);
	return await res;
}

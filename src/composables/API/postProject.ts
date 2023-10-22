import axios from "axios";
import type { Project } from "../../types/Project";

export async function getProject(project: Project) {
	const url = "http://localhost:8080/projects";
	const res = axios.post(url, project);
	return await res;
}

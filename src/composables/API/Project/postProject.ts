import axios from "axios";
import type { Project } from "../../../types/Project";

export async function postProject(project: Project) {
	const url = "http://localhost:8043/projects/";
	const res = axios.post(url, project);
	return await res;
}

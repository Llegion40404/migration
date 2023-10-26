import axios from "axios";
import type { Project } from "../../../types/Project";

export async function updateProject(project: Project) {
	const url = "http://localhost:8043/projects/";
	const res = await axios.put(url + project.id, project);
	return res;
}

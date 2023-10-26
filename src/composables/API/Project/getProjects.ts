import axios from "axios";
import type { Project } from "../../../types/Project";

export async function getProjects(): Promise<Project[]> {
	const url = "http://localhost:8043/projects";
	const res = await axios.get(url);
	return res.data;
}

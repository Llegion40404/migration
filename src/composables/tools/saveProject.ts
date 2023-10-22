import axios from "axios";
import type { Project } from "../../types/Project";

export function saveProject(data: Project) {
	axios.put("http://localhost8080/projects/" + data.id, data);
}

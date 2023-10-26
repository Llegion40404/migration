import { getProjects } from "./API/Project/getProjects";
import { getTodos } from "./API/Todo/getTodos";

export async function initProject() {
	const projects = await getProjects();
	const project = projects.find((p) => p.lastUsed) || projects[0];
	const items = await getTodos(project?.id!);
	document.title = project?.title ?? "Create your first project";
	return {
		projects,
		project,
		items,
	};
}

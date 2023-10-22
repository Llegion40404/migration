import axios from "axios";

export async function getProject() {
	const url = "http://localhost:8080/projects";
	const res = axios.get(url);
	return (await res).data;
}

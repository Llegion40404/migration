import axios from "axios";

export async function getTodos(link: string = "") {
	if (link.length > 0) {
		const res = await axios.get(`http://localhost:8080/${link}_todos`);
		return res.data;
	}
	return 0;
}

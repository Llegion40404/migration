import axios from "axios";

export async function getTodos(link: string) {
	try {
		if (link.length > 0) {
			const res = await axios.get(`http://localhost:8080/todos?prId=${link}`);

			return res.data;
		}
	} catch (e) {}
	return 1;
}

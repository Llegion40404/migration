import axios from "axios";
export async function deleteTodo(id: string) {
	return (await axios.delete("http://localhost:8080/todos/" + id)).data;
}

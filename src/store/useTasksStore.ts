import { defineStore } from "pinia";
export const useTasksStore = defineStore("counter", () => {
	function getTasks() {
		return JSON.parse(localStorage.getItem("tasks") as string);
	}
	return {};
});

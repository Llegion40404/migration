<script setup lang="ts">
import { onMounted, ref, type Ref } from "vue";
import TaskItem from "../components/TaskItem.vue";
import { type Task } from "../types/Task";
import { toast } from "vue3-toastify";
import { immutable } from "../composables/tools/immutable";
import { getTodos } from "../composables/API/getTodos";
import { deleteTodo } from "../composables/API/deleteTodo";
import { postTodo } from "../composables/API/postTodo";
import { updateTodo } from "../composables/API/updateTodo";
import { saveProject } from "../composables/tools/saveProject";
import { getProject } from "../composables/API/getProject";
import { type Project } from "../types/Project";

const filters = [
	"Title",
	"Newest",
	"Oldest",
	"Priority",
	"Todo",
	"Completed",
	"In progress",
];
const tasks: Ref<Task[]> = ref([]);
const using: Ref<string[]> = ref([]);

let old: Task[] = [];

async function initProject() {
	try {
		let res2 = await getProject();
		const currentProject: Project = res2.find(
			(v: Project) => v.lastUsed == true
		);
		old = immutable(tasks.value);
		const res = await getTodos(currentProject.id);
		tasks.value = res;
		document.title = currentProject.title
			? currentProject.title
			: "Create your project!";
	} catch (e) {
		toast.error("Error while initializing site! " + e);
	}
}

async function deleteTask(id: string) {
	try {
		let idx = tasks.value.findIndex((t) => t.id == id);

		toast(
			`Deleted task\n\nTitle: ${tasks.value[idx].title}\n\ID: ${tasks.value[idx].id}\n\n<b>Click on me to revert changes</b>`,
			{
				type: "warning",
				toastClassName: "cursor-pointer",
				autoClose: 6000,
				onClick(event) {
					revert(old[idx].id as string);
				},
				closeOnClick: true,
				dangerouslyHTMLString: true,
			}
		);
		await deleteTodo(
			(tasks.value[idx].id as string) || (old[idx].id as string)
		);
		tasks.value = await getTodos();
	} catch (e) {
		toast("Error: " + e, { type: "error" });
	}
}
const addFilter = (str: string) => {
	let found = filters.find((val) => val == str) as string;
	if (!using.value.includes(found)) {
		using.value.push(found);
		// useFilter();
	}
};
const deleteFilter = (str: string) => {
	let idx = using.value.findIndex((val) => val == str);
	using.value.splice(idx, 1);
	// useFilter();
};
// function useFilter(filter: string = "temp") {
// 	tasks.value.sort((tsk, tsk2) => {
// 		if (
// 			tsk.title < tsk2.title ||
// 			tsk.priority < tsk2.priority ||
// 			tsk.createdAt < tsk2.createdAt
// 		) {
// 			return 1;
// 		}
// 		if (
// 			tsk.title > tsk2.title ||
// 			tsk.priority > tsk2.priority ||
// 			tsk.createdAt > tsk2.createdAt
// 		) {
// 			return -1;
// 		}
// 		return 0;
// 	});
// }

async function saveTasks(todo: Task) {
	let idx = tasks.value.findIndex((v) => v.id === todo.id);
	await updateTodo(tasks.value[idx]);
	old = immutable(tasks.value);
}
async function revert(id: string) {
	let returnTodo = old.find((v) => v.id === id);
	tasks.value = immutable(old);
	await postTodo(returnTodo as Task);
	let res = await getTodos();
	tasks.value = res;
}
onMounted(async () => {
	// saveProject({
	// 	title: "New project",
	// 	ID: "skdbfksbdfbdkf",
	// 	createdAt: "asdasd",
	// 	length: 10,
	// 	link: "asdjsajb",
	// });
	try {
		initProject();
	} catch (error) {
		toast("Error while fetching data" + error, { type: "error" });
	}
});
</script>

<template>
	<section>
		<section
			class="bg-stone-700 mx-auto w-1/2 p-5 flex items-center justify-between">
			<h3>Filter by:</h3>
			<div
				v-for="fil in filters"
				@click="addFilter(fil)"
				class="rounded p-3 bg-neutral-800 cursor-pointer hover:bg-neutral-600">
				{{ fil }}
			</div>
		</section>
		<section
			v-if="using.length > 0"
			class="bg-neutral-900 mx-auto w-1/2 rounded-b p-5 flex items-center gap-3">
			<h4>Filters used:</h4>
			<div
				v-for="fil in using"
				@click="deleteFilter(fil)"
				class="rounded p-2 bg-gray-700 cursor-pointer hover:bg-gray-600">
				{{ fil }}
			</div>
		</section>
		<div class="container">
			<div
				v-if="tasks.length > 0"
				class="flex items-start flex-wrap justify-between py-10 gap-10">
				<TransitionGroup :duration="500">
					<TaskItem
						@save-task="saveTasks"
						@delete-task="deleteTask"
						v-for="task in tasks"
						:key="task.id"
						:task="task" />
				</TransitionGroup>
			</div>
			<h1 v-else class="text-center mt-10 text-emerald-500">List is empty!</h1>
		</div>
	</section>
</template>
<style>
.Toastify__toast {
	width: 700px;
	right: 400px;
	padding: 20px;
	cursor: default;
	z-index: 2 !important;
}
.Toastify__toast-icon {
	width: 50px;
	margin-right: 50px;
}
.revertBtn {
	z-index: 9999 !important;
}
</style>
../composables/saveProject
../composables/tools/immutable../composables/tools/saveProject

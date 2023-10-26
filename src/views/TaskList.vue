<script setup lang="ts">
import { onMounted, ref } from "vue";
import TaskItem from "../components/TaskItem.vue";
import { type Task } from "../types/Task";
import { toast } from "vue3-toastify";
import { immutable } from "../composables/tools/immutable";
import { deleteTodo } from "../composables/API/Todo/deleteTodo";
import { postTodo } from "../composables/API/Todo/postTodo";
import { updateTodo } from "../composables/API/Todo/updateTodo";
import { getTodos } from "../composables/API/Todo/getTodos";
import type { Project } from "../types/Project";

const props = defineProps<{ project: Project; items: Task[] }>();

const filters = [
	{ val: "title", t: "Title" },
	{ val: "date", t: "Newest" },
	{ val: "date", t: "Oldest" },
	{ val: "priority", t: "Priority" },
	{ val: "completed", t: "Todo" },
	{ val: "completed", t: "Completed" },
	{ val: "completed", t: "In progress" },
];

const filter = ref<{ val: string; t: string }>(
	JSON.parse(localStorage.getItem("filter")!) || { val: "date", t: "Newest" }
);
const todos = ref<Task[]>([]);
let old = immutable(todos.value);

function useFilters() {
	localStorage.setItem("filter", JSON.stringify(filter.value));
	if (filter.value.t == "In progress") {
		todos.value = [
			...todos.value.filter((t) => t.completed.num == 20),
			...todos.value.filter((t) => t.completed.num != 20),
		];
	}
	todos.value.sort((a, b) => {
		if (filter.value.t == "Todo") {
			if (a.completed.num > b.completed.num) {
				return 1;
			}
			if (a.completed.num < b.completed.num) {
				return -1;
			}
			if (a.completed.num == b.completed.num) {
				return 0;
			}
		}
		if (filter.value.t == "Completed") {
			if (a.completed.num < b.completed.num) {
				return 1;
			}
			if (a.completed.num > b.completed.num) {
				return -1;
			}
			if (a.completed.num == b.completed.num) {
				return 0;
			}
		}
		if (filter.value.val == "title" || filter.value.t == "Oldest") {
			if (a[filter.value.val] > b[filter.value.val]) {
				return 1;
			}
			if (a[filter.value.val] < b[filter.value.val]) {
				return -1;
			}
			if (a[filter.value.val] == b[filter.value.val]) {
				return 0;
			}
		}
		if (a[filter.value.val] < b[filter.value.val]) {
			return 1;
		}
		if (a[filter.value.val] > b[filter.value.val]) {
			return -1;
		}
		if (a[filter.value.val] == b[filter.value.val]) {
			return 0;
		}
	});
}

async function deleteTask(id: string) {
	try {
		let idx = todos.value.findIndex((t) => t.id == id);

		toast(
			`Deleted task\n\nTitle: ${todos.value[idx].title}\n\ID: ${todos.value[idx].id}\n\n<b>Click on me to revert changes</b>`,
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
		await deleteTodo(todos.value[idx]);
		todos.value = await getTodos(props.project.id);
	} catch (e) {
		toast("Error: " + e, { type: "error" });
	}
}

async function saveTasks(todo: Task) {
	await updateTodo(todo);
	old = immutable(todos.value);
}
async function revert(id: string) {
	let returnTodo = old.find((v: Task) => v.id === id);
	todos.value = immutable(old);
	await postTodo(returnTodo);
	todos.value = await getTodos(props.project.id);
}
onMounted(async () => {
	try {
		let res = await getTodos(props.project.id);
		todos.value = res;
		old = todos.value;
		useFilters();
	} catch (e) {}
});
</script>

<template>
	<section>
		<section
			class="bg-stone-700 p-5 mx-auto flex items-center gap-5 w-fit justify-center">
			<h3>Filter by:</h3>
			<select
				@change="useFilters"
				v-model="filter"
				class="input border-blue-600"
				name="options"
				id="options">
				<option
					v-for="fil in filters"
					:key="fil.t"
					:value="fil"
					class="rounded p-3 bg-neutral-800 cursor-pointer hover:bg-neutral-600">
					{{ fil.t }}
				</option>
			</select>
		</section>

		<div class="container">
			<div
				v-if="todos.length > 0"
				class="flex items-start flex-wrap justify-between py-10 gap-10">
				<TransitionGroup :duration="500">
					<TaskItem
						@save-task="saveTasks"
						@delete-task="deleteTask"
						v-for="task in todos"
						:key="task.id"
						:task="task" />
				</TransitionGroup>
			</div>
			<h1 v-else class="text-center mt-10 text-emerald-500">
				No tasks! You're done
			</h1>
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

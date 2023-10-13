<script setup lang="ts">
import { onMounted, ref, type Ref } from "vue";
import TaskItem from "../components/TaskItem.vue";
import { type Task } from "../types/Task";
import { toast } from "vue3-toastify";
import { immutable } from "../composables/immutable";
const filters = [
	"Priority",
	"Name",
	"Completed",
	"In progress",
	"Todo",
	"Newest",
	"Oldest",
];
const tasks: Ref<Task[]> = ref([]);
const using: Ref<string[]> = ref([]);

let old: Task[] = [];
function deleteTask(id: string) {
	try {
		let idx = tasks.value.findIndex((t) => t.id == id);
		toast(
			`Deleted task\n\nTitle: ${old[idx].title}\n\ID: ${old[idx].id}\n\n<b>Click on me to revert changes</b>`,
			{
				type: "warning",
				autoClose: 6000,
				onClick: revert,
				containerId: "toastify",
			}
		);
		tasks.value = tasks.value.filter((task) => task.id !== id);
		localStorage.setItem("tasks", JSON.stringify(tasks.value));
	} catch (e) {
		toast("Error: " + e, { type: "error" });
	}
}
const addFilter = (str: string) => {
	let found = filters.find((val) => val == str) as string;
	if (!using.value.includes(found)) {
		using.value.push(found);
	}
};
const deleteFilter = (str: string) => {
	let idx = using.value.findIndex((val) => val == str);
	using.value.splice(idx, 1);
};
// function useFilter() {}
function saveTasks() {
	old = immutable(tasks.value);
	localStorage.setItem("tasks", JSON.stringify(tasks.value));
}
function revert() {
	tasks.value = immutable(old);
	localStorage.setItem("tasks", JSON.stringify(tasks.value));
}

onMounted(() => {
	tasks.value = JSON.parse(localStorage.getItem("tasks")!) || [];
	old = immutable(tasks.value);
});
</script>

<template>
	<section>
		<div id="toastify"></div>
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
			<div class="flex items-start flex-wrap justify-between py-10 gap-10">
				<TransitionGroup :duration="500">
					<TaskItem
						@save-task="saveTasks"
						@delete-task="deleteTask"
						v-for="task in tasks"
						:key="task.id"
						:task="task" />
				</TransitionGroup>
			</div>
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

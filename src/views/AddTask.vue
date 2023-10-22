<script setup lang="ts">
import { reactive, ref } from "vue";
import { datetime } from "../composables/tools/getDate";
import { v4 as uid } from "uuid";
import type { Task } from "../types/Task";
import { toast } from "vue3-toastify";
import router from "../router/index";
import { postTodo } from "../composables/API/postTodo";

const todo: Task = reactive({
	id: uid(),
	title: "",
	description: "",
	options: [],
	completed: "todo",
	createdAt: datetime,
	priority: 1,
});

const conditions = ["done", "in-progress", "todo"];

const optVal = ref("");
const isOptOpen = ref(false);

function removeOpt(find: string) {
	let idx = todo.options.findIndex((opt) => opt.text === find);
	todo.options.splice(idx, 1);
}
function addOpt() {
	if (optVal.value.trim().length > 0) {
		isOptOpen.value = false;
		const opt = {
			text: optVal.value,
			is: false,
		};
		todo.options.push(opt);
		optVal.value = "";
	}
}

async function createTask() {
	if (todo.title.length > 0) {
		await postTodo(todo);
		router.push({ name: "list" });
		toast("New task created!", {
			type: "success",
			hideProgressBar: true,
			closeOnClick: true,
		});
	} else {
		toast(`Fill in the "Title" field at least!`, {
			type: "error",
		});
	}
	todo.description = "";
	todo.title = "";
	todo.options = [];
}
</script>

<template>
	<main class="py-10 container">
		<h2>Create new todo:</h2>
		<section>
			<div class="flex items-baseline gap-10">
				<label for="name">
					Title:
					<input v-model="todo.title" id="name" type="text" class="input" />
				</label>
				<label for="description" class="flex items-baseline gap-2">
					Description:
					<textarea
						maxlength="70"
						v-model="todo.description"
						id="description"
						type="text"
						class="input"></textarea>
				</label>
			</div>
			<article class="relative editable flex flex-wrap flex-col pb-2 pl-1 my-5">
				<div
					v-show="isOptOpen"
					class="bg-slate-500 flex flex-col items-end gap-3 absolute p-4 rounded bottom-14">
					<input
						maxlength="15"
						v-model="optVal"
						class="editable bg-gray-700 px-2 py-1 rounded z-50"
						type="text" />
					<button @click="addOpt" class="revertBtn float-right">Ok</button>
				</div>
				<button @click="isOptOpen = true" class="refreshBtn w-max mb-3">
					Add option
				</button>
				<div class="flex items-center gap-2">
					<p>Options:</p>
					<label
						v-for="opt in todo?.options"
						:key="opt.text"
						class="group hover:bg-gray-600 px-3 py-1 max-w-[30%] relative rounded-md duration-500"
						:class="opt.is ? 'bg-emerald-600' : 'bg-red-900'">
						<input type="checkbox" class="hidden" :checked="opt.is" />

						<p class="group-hover:opacity-0 duration-200">
							{{ opt.text }}
						</p>

						<div class="group-hover:block hidden absolute top-0 left-0 w-full">
							<span class="p-5 absolute -left-16 -bottom-[14px]">
								<i
									@click="removeOpt(opt.text)"
									class="cursor-pointer fa-solid fa-trash text-2xl text-amber-800 bg-gray-200 px-2 rounded-md"></i>
							</span>
							<div class="flex items-center justify-between pl-2">
								<i
									@click="opt.is = false"
									class="cursor-pointer fa-solid fa-xmark text-3xl text-red-500"></i>
								<i
									@click="opt.is = true"
									class="cursor-pointer text-lime-500 text-4xl relative bottom-[1px]"
									>&#10003;</i
								>
							</div>
						</div>
					</label>
				</div>
			</article>
			<label for="completed">
				Status:
				<select v-model="todo.completed" id="completed" class="input">
					<option v-for="cond in conditions" :value="cond">{{ cond }}</option>
				</select>
			</label>
			<label for="priority">
				Priority:
				<select v-model="todo.priority" id="priority" class="input">
					<option v-for="pr in 5" :value="pr">{{ pr }}</option>
				</select>
			</label>
		</section>
		<button
			tabindex="10"
			@keydown.enter="createTask"
			@click="createTask"
			class="revertBtn p-3 mt-10 float-right">
			Create todo
		</button>
	</main>
</template>
../composables/tools/getDate

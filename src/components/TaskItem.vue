<script setup lang="ts">
import { ref, type Ref } from "vue";
import { type Task } from "../types/Task";
import { toast } from "vue3-toastify";
import { immutable } from "../composables/immutable";

const props = defineProps<{
	task: Task;
}>();
const emits = defineEmits(["deleteTask", "saveTask"]);
const editing = ref(false);
const open = ref(false);

const todo = ref(props.task);
const dom: Ref<HTMLDivElement> = ref(null);
const optVal = ref("");
const isOptOpen = ref(false);

const conditions = ["done", "in-progress", "todo"];
let old = immutable(props.task);

function scroll() {
	dom.value.scrollTo({ top: 0 });
}
function saveChanges() {
	scroll();
	old = immutable(todo.value);
	open.value = false;
	editing.value = false;
	emits("saveTask");
	toast("Saved changes!", { type: "success" });
}

function toggleTodo() {
	scroll();
	open.value = !open.value;
	if (editing.value) {
		cancelEditing();
		editing.value = false;
		open.value = false;
	}
}

function cancelEditing() {
	scroll();
	if (editing.value) {
		todo.value = immutable(old);
		editing.value = false;
		open.value = false;
	} else {
		editing.value = true;
		open.value = true;
	}
}
function removeOpt(find: string) {
	let idx = todo.value.options.findIndex((opt) => opt.text === find);
	todo.value.options.splice(idx, 1);
}
function addOpt() {
	if (optVal.value.trim().length > 0) {
		isOptOpen.value = false;
		const opt = {
			text: optVal.value,
			is: false,
		};
		todo.value.options.push(opt);
		optVal.value = "";
	}
}
</script>

<template>
	<div
		ref="dom"
		class="w-[45%] p-4 overflow-hidden duration-300 rounded-md bg-gray-500 bg-opacity-30"
		:class="open ? 'h-[470px] overflow-y-scroll' : 'h-28'">
		<header class="flex justify-between relative">
			<div class="max-w-[40%] overflow-hidden">
				<div class="flex items-baseline justify-between">
					<span class="py-1 px-3 bg-amber-600 bg-opacity-60 rounded mr-5">{{
						todo.priority
					}}</span>
					<input
						:readonly="!editing"
						v-model="todo.title"
						type="text"
						class="readonly max-w-full"
						:class="editing ? 'editable' : ''" />
				</div>
				<div>
					<button tabindex="-1" @click="cancelEditing" class="refreshBtn mr-3">
						Edit
					</button>
					<button tabindex="-1" @click="toggleTodo" class="infoBtn">
						{{ editing || open ? "Close" : "Expand" }}
					</button>
				</div>
			</div>
			<section class="h-20 flex flex-col justify-between">
				<div>
					<span v-show="editing" class="loader2 float-right">
						<span class="text-sm relative -top-[2px] text-[orange]"
							>Editing...</span
						>
					</span>
					<div v-show="!editing">
						<span
							v-show="todo.completed == 'in-progress'"
							class="text-xs float-right">
							In progress...<span class="loader float-right ml-3"></span
						></span>
						<img
							v-show="todo.completed == 'todo'"
							src="../assets/todo.png"
							class="float-right"
							width="40" />
						<i
							v-show="todo.completed == 'done'"
							class="text-lime-500 text-5xl float-right"
							>&#10003;</i
						>
					</div>
				</div>
				<small class="text-xs opacity-50 t">{{ todo.createdAt }}</small>
			</section>
		</header>

		<main class="flex flex-col">
			<div>
				<span v-show="todo.description">Notes: </span>
				<input
					v-if="editing"
					v-model="todo.description"
					class="my-10 w-10/12 readonly pl-1"
					:class="editing ? 'editable' : ''" />
				<p class="inline-block my-10 max-w-[80%]" v-else>
					{{ todo.description }}
				</p>
			</div>
			<div class="mb-5 pb-2 pl-1" :class="editing ? 'editable' : ''">
				<span>Status:</span>
				<select
					:disabled="!editing"
					v-model="todo.completed"
					class="rounded-md p-2 bg-gray-600 ml-2 w-min"
					:class="editing ? '' : 'reading'"
					name="condition"
					id="condition">
					<option v-for="cond in conditions" :key="cond" :value="cond">
						{{ cond }}
					</option>
				</select>
			</div>
			<div class="pb-2 pl-1" :class="editing ? 'editable' : ''">
				<span v-show="editing">Priority:</span>
				<select
					v-show="editing"
					v-model="todo.priority"
					class="rounded-md p-2 bg-gray-600 ml-2 w-min"
					:class="editing ? '' : 'reading'"
					name="condition"
					id="condition">
					<option v-for="p in 5" :key="p" :value="p">
						{{ p }}
					</option>
				</select>
			</div>
			<article
				class="relative flex flex-wrap flex-col pb-2 pl-1 my-5"
				:class="editing ? 'editable' : ''">
				<div
					v-show="isOptOpen"
					class="bg-slate-500 flex flex-col items-end gap-3 absolute p-4 rounded bottom-14">
					<input
						maxlength="15"
						v-model="optVal"
						:class="
							editing ? 'editable bg-gray-700 px-2 py-1 rounded z-50' : ''
						"
						type="text" />
					<button tabindex="-1" @click="addOpt" class="revertBtn float-right">
						Ok
					</button>
				</div>
				<button
					tabindex="-1"
					v-show="editing"
					@click="isOptOpen = true"
					class="refreshBtn w-max mb-3">
					Add option
				</button>
				<div class="flex items-center gap-2">
					<p v-show="todo.options.length > 0">Options:</p>
					<label
						v-for="opt in todo?.options"
						:key="opt.text"
						class="group hover:bg-gray-600 px-3 py-1 max-w-[30%] relative rounded-md duration-500"
						:class="editing && opt.is ? 'bg-emerald-600' : 'bg-red-900'">
						<input
							type="checkbox"
							class="hidden"
							:checked="opt.is"
							:disabled="!editing" />

						<p
							:class="
								editing ? 'group-hover:opacity-0 relative ' : 'opacity-100'
							">
							{{ opt.text }}
						</p>

						<div
							:class="
								editing
									? 'absolute top-0 w-full pl-2 left-1 group-hover:flex hidden duration-300 group'
									: 'absolute hidden'
							">
							<span class="p-5 absolute -left-16 -bottom-[18px]">
								<i
									@click="removeOpt(opt.text)"
									class="cursor-pointer fa-solid fa-trash text-2xl text-amber-800 bg-gray-200 px-2 rounded-md"></i>
							</span>
							<i
								@click="opt.is = false"
								class="cursor-pointer fa-solid fa-xmark text-3xl text-red-500"></i>
							<i
								@click="opt.is = true"
								class="cursor-pointer text-lime-500 text-4xl -bottom-[2px] absolute right-2"
								>&#10003;</i
							>
						</div>
					</label>
				</div>
			</article>
			<footer class="pt-10 flex justify-between">
				<div>
					<button
						tabindex="-1"
						@click="emits('deleteTask', todo.id)"
						class="deleteBtn py-2">
						Delete task
					</button>
				</div>
				<div>
					<button
						tabindex="-1"
						v-show="editing"
						@click="cancelEditing"
						class="deleteBtn mr-5">
						Cancel
					</button>
					<button
						tabindex="-1"
						v-show="editing"
						@click="saveChanges"
						class="refreshBtn">
						Save
					</button>
				</div>
			</footer>
		</main>
	</div>
</template>

<style>
.loader {
	width: 20px;
	height: 20px;
	border: 3px solid #fff;
	border-radius: 50%;
	display: inline-block;
	position: relative;
	box-sizing: border-box;
	animation: rotation 5s linear infinite;
}
.loader::after {
	content: "";
	box-sizing: border-box;
	position: absolute;
	left: 0;
	top: 0;
	background: #34af86;
	width: 10px;
	height: 10px;
	transform: translate(-50%, 50%);
	border-radius: 50%;
}

@keyframes rotation {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}
.loader2 {
	color: orange;
	font-family: Consolas, Menlo, Monaco, monospace;
	font-weight: bold;
	font-size: 25px;
	opacity: 0.9;
}
.loader2:before {
	content: "{";
	display: inline-block;
	animation: pulse 0.5s alternate infinite ease-in-out;
}
.loader2:after {
	content: "}";
	display: inline-block;
	animation: pulse 0.5s 0.5s alternate infinite ease-in-out;
}

@keyframes pulse {
	to {
		transform: scale(0.8);
		opacity: 0.5;
	}
}
.reading {
	appearance: none;
	-moz-appearance: none;
	-webkit-appearance: none;
}

/* for IE10 */
.reading::-ms-expand {
	display: none;
}
</style>

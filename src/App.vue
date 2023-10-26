<script setup lang="ts">
import { onMounted, ref } from "vue";
import { initProject } from "./composables/initProject";
import type { Project } from "./types/Project";
import { updateProject } from "./composables/API/Project/updateProject";
import { postProject } from "./composables/API/Project/postProject";
import { datetime } from "./composables/tools/getDate";
import { v4 as uid } from "uuid";
import { toast } from "vue3-toastify";
import type { Task } from "./types/Task";
import { deleteProject } from "./composables/API/Project/deleteProject";

const projectsList = ref<Project[]>([]);
const tasks = ref<Task[]>([]);
const projectInfo = ref<Project>(null!);
const selectedProject = ref("");
const hidden = ref(true);
const creating = ref(false);
const editing = ref(false);
const newTitle = ref("");

const changeProject = async (name?: string) => {
	let next = projectsList.value.find((p) => p.title == selectedProject.value);
	if (next?.title !== projectInfo.value.title) {
		next!.lastUsed = true;
		projectInfo.value.lastUsed = false;
		await updateProject(next!);
		await updateProject(projectInfo.value);
		window.open(document.URL);
	}
};
const createProject = async () => {
	if (newTitle.value.length >= 3) {
		let project: Project = {
			title: newTitle.value,
			id: uid(),
			length: 0,
			createdAt: datetime(),
			lastUsed: true,
		};
		await postProject(project);
		if (projectsList.value.length > 0) {
			projectInfo.value.lastUsed = false;
			await updateProject(projectInfo.value);
		}
		location.reload();
	} else {
		toast.warning("At least 3 letters required");
	}
};
async function startProject() {
	let { project, projects, items } = await initProject();
	tasks.value = items.todos;
	projectInfo.value = project!;

	projectsList.value = projects;
	selectedProject.value = project?.title!;
}
const updateTitle = async () => {
	if (newTitle.value) {
		editing.value = false;
		projectInfo.value.title = newTitle.value;
		await updateProject(projectInfo.value);
	} else toast.warning("Enter 3 letters at least!");
};
const removeProject = async () => {
	await deleteProject(projectInfo.value);
	location.reload();
};
onMounted(() => {
	startProject();
});
</script>

<template>
	<div>
		<div v-if="projectsList.length > 0">
			<nav class="bg-zinc-900">
				<div class="container flex items-center justify-between py-5">
					<div class="flex items-center">
						<h1>
							<router-link :to="'/'">{{ projectInfo?.title }}</router-link>
						</h1>
						<h2><router-link to="/create">Add task</router-link></h2>
					</div>
					<label class="text-2xl" for="project">
						Select project:
						<select
							v-model="selectedProject"
							class="bg-gray-700 rounded p-3"
							name="project"
							id="project">
							<option
								@click="changeProject()"
								v-for="pr in projectsList"
								:key="pr.id"
								:value="pr.title">
								<router-link to="/">{{ pr.title }}</router-link>
							</option>
						</select>
					</label>
					<div>
						<a
							href="../db.json"
							class="revertBtn cursor-pointer text-white p-3"
							download>
							Export as json
						</a>
					</div>
				</div>
			</nav>
			<div
				v-show="editing"
				class="fixed h-screen w-screen bg-black bg-opacity-70 z-[99] flex justify-center">
				<section class="rounded bg-black h-min flex flex-col items-center p-10">
					<input
						v-model="newTitle"
						class="input"
						placeholder="Enter new project title"
						type="text" />
					<div class="flex justify-between w-full">
						<button @click="editing = false" class="text-6xl text-red-600">
							&#10005;
						</button>
						<button @click="updateTitle" class="text-6xl text-green-600">
							&#10003;
						</button>
					</div>
				</section>
			</div>
			<teleport to="body">
				<section
					class="rounded absolute left-20 bottom-32 bg-white bg-opacity-40">
					<p
						@click="hidden = !hidden"
						class="cursor-pointer text-4xl px-4 py-3">
						&#9881;
					</p>
					<div
						class="duration-500 absolute bottom-0 overflow-hidden left-[70px] flex flex-col w-max bg-sky-700 bg-opacity-60 p-3 rounded"
						:class="hidden ? 'h-0 opacity-0' : 'h-44'">
						<button @click="removeProject" class="deleteBtn text-white p-2">
							Delete project
						</button>
						<button
							@click="editing = !editing"
							class="bg-white p-2 rounded-md my-3 text-black">
							Change project title
						</button>
						<button @click="creating = !creating" class="infoBtn p-2">
							Create new project
						</button>
					</div>
				</section>
			</teleport>
			<router-view :project="projectInfo" :items="tasks"></router-view>
		</div>
		<div class="flex flex-col items-center py-40 h-screen" v-else>
			<div v-show="!creating">
				<h1
					class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-red-500 leading-normal">
					No projects yet!
				</h1>
				<button
					@click="creating = true"
					class="infoBtn mt-10 py-5 px-20 text-4xl">
					Create one!
				</button>
			</div>
		</div>
		<div
			v-show="creating"
			class="flex flex-col items-center p-5 pt-10 bg-black absolute left-[25%] top-[30%] z-50 rounded-lg">
			<p
				@click="creating = false"
				class="absolute cursor-pointer text-4xl top-1 right-2">
				&#10005;
			</p>
			<div class="flex items-center gap-5">
				<p
					class="text-4xl text-transparent bg-clip-text bg-gradient-to-r from-sky-700 to-emerald-600 leading-normal">
					Enter title for your new project:
				</p>
				<input
					class="input bg-gradient-to-r from-emerald-700 to-sky-700"
					v-model="newTitle"
					type="text" />
			</div>
			<button @click="createProject" class="refreshBtn text-4xl py-5 px-10">
				Create
			</button>
		</div>
	</div>
</template>

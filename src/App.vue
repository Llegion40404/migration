<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getProject } from "./composables/API/getProject";
let projects = ref([]);

onMounted(async () => {
	let res = await getProject();
	projects.value = res;
});
</script>

<template>
	<div>
		<div v-if="projects.length > 0">
			<nav class="bg-zinc-900">
				<div class="container flex items-center justify-between py-5">
					<div class="flex items-center">
						<h1><router-link :to="'/'">Todo</router-link></h1>
						<h2><router-link to="/create">Add task</router-link></h2>
					</div>
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

			<router-view></router-view>
		</div>
		<div v-else>
			<h1>Create a new project</h1>
		</div>
	</div>
</template>

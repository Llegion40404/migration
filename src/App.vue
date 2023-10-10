<script setup lang="ts"></script>

<template>
	<div>
		<nav class="bg-zinc-900">
			<div class="container flex items-center py-5">
				<h1><RouterLink to="/">Todo</RouterLink></h1>
				<h2><RouterLink to="/create">Add task</RouterLink></h2>
			</div>
		</nav>

		<router-view v-slot="{ Component }">
			<keep-alive>
				<component :is="Component" />
			</keep-alive>
		</router-view>
	</div>
</template>

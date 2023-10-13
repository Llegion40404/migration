<script setup lang="ts"></script>

<template>
	<div>
		<nav class="bg-zinc-900">
			<div class="container flex items-center py-5">
				<h1><router-link to="/">Todo</router-link></h1>
				<h2><router-link to="/create">Add task</router-link></h2>
			</div>
		</nav>

		<div id="wrapper"></div>
		<router-view> </router-view>
	</div>
</template>

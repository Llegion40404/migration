import { createRouter, createWebHistory } from "vue-router";
import TaskListVue from "../views/TaskList.vue";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "list",
			component: TaskListVue,
			props: true,
			beforeEnter: (to, from) => {},
		},
		{
			path: "/create",
			name: "create",
			component: () => import("../views/AddTask.vue"),
		},
	],
});

export default router;

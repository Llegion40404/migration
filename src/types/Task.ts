type Opt = {
	text: string;
	is: boolean;
};
export type Task = {
	id: string | number;
	title: string;
	description: string;
	options: Opt[];
	completed: { num: number; is: string };
	createdAt: string;
	priority: number;
	prId: string;
	date: string;
};
export type TaskChild = {
	id: number | string;
	title: string;
	description: string;
	options: Opt[];
	completed: string;
	createdAt: string;
	priority: number;
};

import type { Task } from "../types/Task";

export function immutable(val: object = {}): Task | Task[] | any {
	return JSON.parse(JSON.stringify(val));
}

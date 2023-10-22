import type { Task, TaskChild } from "../../types/Task";

export const compareArrays = (a: Task, b: Task) => {
	let options = a.options.every(
		(opt, idx) => opt.text == b.options[idx].text && opt.is == b.options[idx].is
	);

	function compare(a: TaskChild, b: TaskChild) {
		if (a.title < b.title) {
			return -1;
		}
		if (a.title > b.title) {
			return 1;
		}
		return 0;
	}
	a.tasks.sort(compare);

	let tasks = a.tasks.every(
		(ts, idx) => JSON.stringify(ts) == JSON.stringify(b.tasks[idx])
	);
	return { options, tasks };
};

// function compareObjInDepth(current: any, old: any) {
// 	for (const [k, v] of Object.entries(current)) {
// 		if (k == "options" || k == "tasks") {
// 			if (
// 				compareArrays(current, old).options ||
// 				compareArrays(current, old).tasks
// 			) {
// 				isCopy.value = true;
// 			} else {
// 				isCopy.value = false;
// 			}
// 		} else {
// 			if (current[k] == old[k]) {
// 				isCopy.value = true;
// 			} else {
// 				isCopy.value = false;
// 			}
// 		}
// 	}
// }

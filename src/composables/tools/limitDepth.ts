function limitDepth(obj: any, depth: any) {
	const count: any = {};

	return JSON.parse(
		JSON.stringify(obj, (name: string, value) => {
			if (typeof count[name] !== "number") {
				count[name] = 0;
			}
			count[name] += 1;
			const max = depth[name] >= 0 ? depth[name] : Infinity;
			if (count[name] <= max) {
				if (typeof value === "object") {
					return Array.isArray(value) ? [...value] : { ...value };
				}
				return value;
			}
			return undefined;
		})
	);
}

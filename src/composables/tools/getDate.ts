const monthNames = [
	"January",
	"February",
	"March",
	"April",

	"May",
	"June",
	"July",
	"August",
	"September",
	"October",

	"November",
	"December",
];

export let datetime = () => {
	let currentdate = new Date();
	return (
		"Created: " +
		monthNames[currentdate.getMonth()] +
		" " +
		currentdate.getDate() +
		" /" +
		currentdate.getFullYear() +
		" at " +
		currentdate.getHours() +
		":" +
		(String(currentdate.getMinutes()).length == 1
			? "0" + currentdate.getMinutes()
			: currentdate.getMinutes()) +
		":" +
		currentdate.getSeconds()
	);
};

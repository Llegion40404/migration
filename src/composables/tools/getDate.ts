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
let currentdate = new Date();

export let datetime =
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
		? "0" + currentdate.getUTCMinutes()
		: currentdate.getUTCMinutes()) +
	":" +
	currentdate.getSeconds();

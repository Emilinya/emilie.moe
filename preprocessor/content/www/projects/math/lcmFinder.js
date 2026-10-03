const form = document.getElementById('form');
const input = document.getElementById('input');
const resultP = document.getElementById('resultP');

form.addEventListener("submit", async event => {
	event.preventDefault();
	let digits = []
	values = input.value.split(",");
	for (let i = 0; i < values.length; i++) {
		if (digits.length > 49) {
			input.setCustomValidity('Too many numbers, max 50');
			return;
		}
		digits.push(values[i]);
	}
	let response = await fetch(`http://api.emilie.moe/lcm?values=${digits.join(",")}`);
	let body = await response.text();
	if (body === "None") {
		input.setCustomValidity('Request timed out, lcm is too big');
		resultP.innerText = "";
	} else {
		resultP.innerHTML = "Lowest common multiple: <b><u>" + body + "</u></b>";
	}
});

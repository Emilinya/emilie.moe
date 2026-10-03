const form = document.getElementById('form');
const input = document.getElementById('input');
const resultP = document.getElementById('resultP');

form.addEventListener("submit", event => {
	event.preventDefault();
	let digits = []
	values = input.value.split(",");
	for (let i = 0; i < values.length; i++) {
		if (values[i].trim().length > 6) {
			input.setCustomValidity('One of the numbers is too big, max 6 digits');
			return;
		} else if (digits.length > 49) {
			input.setCustomValidity('Too many numbers, max 50');
			return;
		}
		digits.push(parseInt(values[i]));
	}
	// Communicate with lcm.py
});

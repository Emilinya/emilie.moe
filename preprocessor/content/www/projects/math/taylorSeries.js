const form = document.getElementById('form');
const funcInput = document.getElementById('funcInput');
const orderInput = document.getElementById('orderInput');
const pointInput = document.getElementById('pointInput');
const resultP = document.getElementById('resultP');
const resultImg = document.getElementById('resultImg');

form.addEventListener("submit", async event => {
	event.preventDefault();

	func = funcInput.value.replace(/ /g, "").replace(/\+/g, "£")
	let response = await fetch(
		`http://api.bendik.moe/taylor?function=${func}
		&order=${orderInput.value}&point=${pointInput.value}`
	);
	let body = await response.text();
	if (body === "FuncError") {
		funcInput.setCustomValidity('Can\'t calculate taylor series');
	} else if (body !== "Error") {
		let [latex, image] = body.slice(1, body.length-1).replace(/&#39;/g, "").split(",");
		resultP.innerHTML = "\\("+latex.replace(/\\\\/g, "\\")+"\\)";
		MathJax.typesetPromise();

		resultImg.setAttribute("src", "data:image/png;base64,"+image.slice(1, image.length));
		resultImg.style.height = "700px";
	}
})

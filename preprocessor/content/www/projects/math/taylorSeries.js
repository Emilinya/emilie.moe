const form = document.getElementById('form');
const funcInput = document.getElementById('funcInput');
const orderInput = document.getElementById('orderInput');
const pointInput = document.getElementById('pointInput');
const radiusInput = document.getElementById('radiusInput');
const resultP = document.getElementById('resultP');
const resultImg = document.getElementById('resultImg');

form.addEventListener("submit", async event => {
	event.preventDefault();

	func = funcInput.value.replace(/ /g, "").replace(/\+/g, "£")
	// start_time = +new Date();
	let response = await fetch(
		`http://api.emilie.moe/taylor?function=${func}
		&order=${orderInput.value}&point=${pointInput.value}
		&radius=${radiusInput.value}`
	);
	let body = await response.text();
	// console.log((+new Date() - start_time)/1000 + " s");
	if (body === "FuncError") {
		showError('Can\'t calculate taylor series');
	} else if (body === "TimeoutError") {
		showError('Request timed out');
	} else if (body !== "Error") {
		let [latex, image] = body.slice(1, body.length-1).replace(/&#39;/g, "").split(",");
		resultP.innerHTML = "\\("+latex.replace(/\\\\/g, "\\")+"\\)";
		MathJax.typesetPromise();

		resultImg.setAttribute("src", "data:image/png;base64,"+image.slice(1, image.length));
	}
})

function showError(errStr) {
	errSpan = document.createElement("span");
	errSpan.appendChild(document.createTextNode(errStr))
	errSpan.style.color = "#ff4343";
	for (var child of resultP.childNodes) {
		resultP.removeChild(child)
	}
	resultP.appendChild(errSpan)
}

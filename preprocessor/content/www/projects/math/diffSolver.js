const form = document.getElementById('form');
const funcInput = document.getElementById('funcInput');
const eqOutput = document.getElementById('eqOutput');
const initInput = document.getElementById('initInput');
const nInput = document.getElementById('nInput');
const eqSolve = document.getElementById('eqSolve');
const eqResult = document.getElementById('eqResult');
const eqValues = document.getElementById('eqValues');

funcInput.addEventListener("keyup", event => updateData(event));
initInput.addEventListener("keyup", event => updateData(event));
nInput.addEventListener("keyup", event => updateData(event))

let funcData;
let initialsData;
let nData;

function updateData(event) {
	updateFuncData();
	updateInitialsData();
	updateNData();
	if (event.key !== "Enter") {
		funcInput.setCustomValidity('');
		initInput.setCustomValidity('');
	}
}

function updateFuncData() {
	let functions = funcInput.value.split(",").map(value => parseFloat(value));
	if (!arraysAreEqual(funcData, functions)) {
		funcData = functions;

		// Parse functions to make output pretty:
		funcValue = "x<sub>n</sub> = ";
		for (let i = 0; i < functions.length; i++) {
			if (functions[i] === 0) {
				continue;
			}
			let f = Math.abs(functions[i]);
			let sign = Math.sign(functions[i+1]);
			if (isNaN(f)) {
				funcValue = false;
				break;
			} else if (f === 1) {
				f = "";
			}
			funcValue += `${f}x<sub>n-${i+1}</sub>`;
			if (i != functions.length-1) {
				funcValue += ` ${{"1": "+", "-1": "-"}[sign]} `;
			}
		}
		updateOutput({func: funcValue});
	}
}

function updateInitialsData() {
	let initials = initInput.value.split(",").map(value => parseFloat(value));
	if (!arraysAreEqual(initialsData, initials)) {
		initialsData = initials;

		// Parse initials to make output pretty:
		let initValue = "";
		texts = initials.map((value, i) => {
			if (isNaN(value)) {
				initValue = false
			}
			return `x<sub>${i}</sub> = ${value}`
		});
		if (initValue === "") {
			initValue = texts.join(", ")
		}
		updateOutput({init: initValue});
	}
}

function updateNData() {
	if (nData !== nInput.value) {
		if (nInput.value !== "") {
			nData = +nInput.value;
			updateOutput({n: "n = "+nInput.value});
		} else {
			updateOutput({n: false});
		}
	}
}

let eqOutputTextObj = {func: "", init: "", n: ""};
function updateOutput(updateObj) {
	for (let key in updateObj) {
		eqOutputTextObj[key] = updateObj[key];
	}
	for (let key in eqOutputTextObj) {
		if (!eqOutputTextObj[key]) {
			eqOutput.innerText = "";
			return;
		}
	}
	if (funcData.length !== initialsData.length) {
		eqOutput.innerText = "";
		return;
	}
	eqOutput.innerHTML = `
		<span style="color: #ee5555">${eqOutputTextObj["func"]}</span>,
		<span style="color: #55ee55">${eqOutputTextObj["init"]}</span>,
		<span style="color: #5555ee">${eqOutputTextObj["n"]}</span>
	`;
}

form.addEventListener("submit", async event => {
	event.preventDefault();
	updateData({key: "Enter"})
	if (funcData.length === initialsData.length) {
		let response = await fetch(
			`http://api.emilie.moe/diff?initials=${initialsData.join(",")}
			&functions=${funcData.join(",")}&N=${nData}&rightSide=0&display=full`
		);
		let body = await response.text();
		if (body === "None" || body === "Error") {
			eqResult.innerText = "";
		} else {
			eqResult.innerText = `First ${nData} values in the equation:`;
			eqValues.innerHTML = "";
			resultRay = body.replace(/&#39;/g, "").slice(1, -1).split(", ");
			for (var i = 0; i < resultRay.length; i++) {
				const tr = document.createElement("tr");
				const [indexText, valueText] = resultRay[i].split(":").map(v => v.trim());
				indexTd = document.createElement("td");
				indexTd.appendChild(document.createTextNode(indexText+":"));
				indexTd.className = "noBorderTable";
				indexTd.style.textAlign = "right";
				tr.appendChild(indexTd);

				valueTd = document.createElement("td");
				valueTd.appendChild(document.createTextNode(valueText));
				valueTd.className = "noBorderTable";
				tr.appendChild(valueTd);
				eqValues.appendChild(tr);
			}
		}
	} else {
		funcInput.setCustomValidity('Functions and initial conditions must have same length');
		initInput.setCustomValidity('Functions and initial conditions must have same length');
	}
});


function arraysAreEqual(arr1, arr2) {
	if (!Array.isArray(arr1) || ! Array.isArray(arr2) || arr1.length != arr2.length) {
		return false;
	}
	for (var i = 0; i < arr1.length; i++) {
		if (arr1[i] !== arr2[i]) {
			return false;
		}
	}
	return true;
}

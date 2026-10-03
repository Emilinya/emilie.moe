const form = document.getElementById('form');
const eqInput = document.getElementById('eqInput');
const eqOutput = document.getElementById('eqOutput');
const initialsDiv = document.getElementById('initialsDiv');
const nInput = document.getElementById('nInput');
const eqSolve = document.getElementById('eqSolve');
const eqResult = document.getElementById('eqResult');
const eqValues = document.getElementById('eqValues');

eqInput.addEventListener("keyup", updateData);
initialsDiv.addEventListener("keyup", updateData);
nInput.addEventListener("keyup", updateData)

function updateData() {
	updateEqData();
	updateInitialsData();
	updateNData();
}

let eqData;
function updateEqData() {
	solverArgs = parseInput(eqInput.value);
	if (!arraysAreEqual(solverArgs, eqData)) {
		let output;
		if (solverArgs) {
			eqData = solverArgs.slice();
			resetForm();
			output = [];
			for (var i = 0; i < solverArgs.length; i++) {
				if (solverArgs[i] !== 0) {
					if (solverArgs[i] === 1) {
						solverArgs[i] = ""
					} else if (solverArgs[i] === -1) {
						solverArgs[i] = "-"
					}
					output.push(`${solverArgs[i]}x<sub>n-${i+1}</sub>`);
					addToForm(i);
				}
			}
			output = `x<sub>n</sub> = `+output.join(" + ");
			updateOutput({eq: output});
		} else {
			eqData = solverArgs
			updateOutput({eq: false});
		}
	}
}

let initialsData;
function updateInitialsData() {
	let formElements = initialsDiv.children;
	initialsRay = [];
	valueRay = [];
	for (let i = 0; i < formElements.length; i++) {
		if (formElements[i].tagName == "INPUT") {
			formText = document.getElementById(formElements[i].id.replace("Input", "Text"));
			index = +formText.innerHTML.replace(/x<sub>(\d*)<\/sub> = /, "$1");
			initialsRay[index] = +formElements[i].value
			valueRay.push(formText.innerHTML + formElements[i].value);
		}
	}
	for (let i = 0; i < initialsRay.length; i++) {
		if (!initialsRay[i]) {
			initialsRay[i] = 0
		}
	}
	if (!arraysAreEqual(initialsData, initialsRay)) {
		initialsData = initialsRay;
		value = valueRay.join(", ");
		updateOutput({init: value});
	}
}

let nData;
function updateNData() {
	if (nData !== nInput.value) {
		nData = +nInput.value;
		updateOutput({n: "n = "+nInput.value});
	}
}

let eqOutputTextObj = {eq: "", init: "", n: ""};
function updateOutput(updateObj) {
	for (let key in updateObj) {
		eqOutputTextObj[key] = updateObj[key];
	}
	for (let key in eqOutputTextObj) {
		if (!eqOutputTextObj[key]) {
			eqOutput.innerHTML = "<span style='color:#ff6666'>Problem with input</span>";
			return;
		}
	}
	eqOutput.innerHTML = eqOutputTextObj["eq"] + ", " + eqOutputTextObj["init"] + ", " + eqOutputTextObj["n"];
}

function parseInput(string) {
	// Get parts of the equation
	let parts = [];
	let splitString = string.split(" ");
	for (let i = 0; i < splitString.length; i++) {
		if (splitString[i] === "-") {
			splitString[i+1] = "-"+splitString[i+1];
		} else if (splitString[i] !== "+" && splitString[i] !== "") {
			parts.push(splitString[i]);
		}
	}

	// Parse parts
	solverArgs = [];
	for (let i = 0; i < parts.length; i++) {
		splitPart = parts[i].split("x");
		if (!splitPart[1] || [1] === "") {
			return false;
		}
		if (splitPart[0] === "") {
			splitPart[0] = "1";
		} else if (splitPart[0] === "-") {
				splitPart[0] = "-1";
		} else if (isNaN(+splitPart[0])) {
			return false;
		}
		solverArgs[splitPart[1]] = +splitPart[0];
	}

	// Fill empty space with 0
	for (var i = 0; i < solverArgs.length; i++) {
		if (!solverArgs[i]) {
			solverArgs[i] = 0
		}
	}

	return solverArgs;
}

function resetForm() {
	let child = initialsDiv.lastElementChild;
	while (child) {
		initialsDiv.removeChild(child);
		child = initialsDiv.lastElementChild;
	}
}

function addToForm(i) {
	sub = document.createElement("sub");
	sub.appendChild(document.createTextNode(i))

	text = document.createElement("span");
	text.className = "defaultSpan"
	text.appendChild(document.createTextNode("x"))
	text.appendChild(sub)
	text.appendChild(document.createTextNode(" = "))
	text.id = "formText"+i
	initialsDiv.appendChild(text)

	input = document.createElement("input");
	input.type = "number"
	input.required = true
	input.style.width = "50px"
	input.style.marginRight = "20px"
	input.id = "formInput"+i
	initialsDiv.appendChild(input)
}

form.addEventListener("submit", async event => {
	event.preventDefault();
	if (eqData && eqData.length === initialsData.length) {
		let response = await fetch(`http://api.bendik.moe/diff?initials=${initialsData.join(",")}&functions=${eqData.join(",")}&N=${nData}&rightSide=0&display=full`);
		let body = await response.text();
		if (body === "None" || body === "Error") {
			eqResult.innerText = "";
		} else {
			console.log(body);
			eqResult.innerText = `First ${nData} values in the equation:`;
			eqValues.innerHTML = "";
			resultRay = body.replace(/&#39;/g, "").slice(1, -1).split(", ");
			for (var i = 0; i < resultRay.length; i++) {
				console.log(resultRay[i]);
				li = document.createElement("li");
				li.style.whiteSpace = "pre";
				li.appendChild(document.createTextNode(resultRay[i]));
				eqValues.appendChild(li);
			}
		}
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

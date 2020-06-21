const bodyDiv = document.getElementsByClassName('bodyDiv')[0];
const barContainer = document.getElementById('barContainer');
const inputButton = document.getElementById('inputButton');
const imgNameSpan = document.getElementById('imgNameSpan');
const imgInput = document.getElementById('imgInput');
const radioInputs = document.getElementsByName('stripType');
const imgDiv = document.getElementById('imgDiv');
const img = document.getElementById('resultImg');
const percentP = document.getElementById('percentP')
const stripButton = document.getElementById('stripButton')

function getStripType() {
	for (let input of radioInputs) {
		if (input.checked) {
			return input.value;
		}
	}
}

radioInputs.forEach(input => {
	input.addEventListener("change", _ => {
		if (img.src !== "") {
			if (getStripType() === "customStrip") {
					imgDiv.style.display = "grid";
					percentP.style.display = "inline";
					updatePercentP(calcCenterFrac())
			} else {
				imgDiv.style.display = "none";
				percentP.style.display = "none";
			}
		}
	});
});


inputButton.addEventListener("click", _ => imgInput.click());
imgInput.addEventListener("change", event => {
	if (stripButton.disabled) {
		stripButton.disabled = false;
	}
	let file = imgInput.files[0]
	imgNameSpan.innerText = " " + file.name;
	const reader = new FileReader();
	reader.readAsDataURL(file);
	reader.addEventListener('load', event => {
		img.src = event.target.result;
		imgDiv.style.visibility = "hidden";
	});
});

img.addEventListener("load", _ => {
	addPercentBar();
	setTimeout(() => {
		imgDiv.style.visibility = "visible";
		if (getStripType() !== "customStrip") {
			imgDiv.style.display = "none";
		} else {
			percentP.style.display = "inline";
		}
	}, 0);
});

let centerFrac = 0.5
function addPercentBar() {
	for (var child of imgDiv.children) {
		if (child.id === "bar") {
			imgDiv.removeChild(child);
		}
	}
	const bar = document.createElement("div");
	bar.id = "bar";
	bar.style.height = img.clientHeight + "px";
	bar.style.left = img.clientWidth/2 + "px";
	positionBar(bar);

	setTimeout(() => updatePercentP(calcCenterFrac(bar)), 0);

	imgDiv.addEventListener("dragstart", event => event.preventDefault());
	bar.addEventListener("mousedown", _ => {
		bar.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
	});
	imgDiv.addEventListener("mousemove", event => {
		if (bar.style.backgroundColor === "rgba(0, 0, 0, 0.3)") {
			bar.style.left = event.clientX - (imgDiv.clientWidth - img.clientWidth)/2 + "px";
			positionBar(bar)
			centerFrac = calcCenterFrac(bar);
			updatePercentP(centerFrac);
		}
	});
	imgDiv.addEventListener("mouseup", _ => {
		bar.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
	});

	imgDiv.appendChild(bar);
}

function positionBar(bar=undefined) {
	if (!bar) {
		bar = document.getElementById('bar');
	}
	if (bar) {
		let barWidth = +bar.style.width.replace("px", "");
		let imgMargin = (imgDiv.clientWidth - img.clientWidth)/2;
		let barPos = +bar.style.left.replace("px", "") - barWidth/2
		bar.style.marginLeft = (imgMargin + barPos) + "px"
	}
}

function calcCenterFrac(bar=undefined) {
	if (!bar) {
		bar = document.getElementById('bar');
	}
	if (bar) {
		let imgWidth = img.clientWidth;
		let barPos = +bar.style.left.replace("px", "");
		let barWidth = +bar.style.width.replace("px", "");
		return barPos/imgWidth
	}
}

function updatePercentP(centerFrac) {
	percentP.innerText = Math.round(centerFrac*1000)/10 + " %"
}

window.addEventListener("resize", _ => {
	bar = document.getElementById('bar');
	if (bar) {
		bar.style.left = img.clientWidth * centerFrac + "px";
		positionBar(bar);
		bar.style.height = img.clientHeight + "px";
	}
});

stripButton.addEventListener("click", async _ => {
	imgSrc = img.src;
	stripType = getStripType();

	if (stripType === "customStrip") {
		center_frac = centerFrac;
	} else if (stripType === "noStrip") {
		center_frac = "None";
	} else {
		center_frac = 0.5;
	}

	if (stripType === "fullStrip") {
		center = false;
	} else {
		center = true;
	}

	let options = {
		method: "POST",
		body: imgSrc,
	};

	let response = await fetch(
		`http://api.bendik.moe/strip?center_frac=${center_frac}&center=${center}`,
		options
	);
	let body = await response.text();
	if (body !== "TimeoutError") {
		body = body.replace(/&#39;/g, "").replace(/b/, "");

		let [name, extension] = imgNameSpan.innerText.split(".");
		fileName = `${name.replace(" ", "")}-stripped.${extension}`;
		download(fileName, body)
	}
});

function download(filename, text) {
	var element = document.createElement('a');
	element.setAttribute('href', text);
	element.setAttribute('download', filename);

	element.style.display = 'none';
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
}

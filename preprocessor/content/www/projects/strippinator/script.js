function addDragBarELs(imgDiv, bar, BodyDiv) {
	imgDiv.addEventListener("dragstart", event => event.preventDefault());
	bar.addEventListener("mousedown", _ => {
		let state = BodyDiv.state;
		state.barIsClicked = true;
		BodyDiv.setState(state)
	});
	imgDiv.addEventListener("mousemove", event => {
		let state = BodyDiv.state
		if (state.barIsClicked) {
			let leftMargin = (state.screenWidth - state.imgWidth)/2
			state.barPos = event.clientX - leftMargin - bar.clientWidth/2;
			// bar.style.left = event.clientX - (imgDiv.clientWidth - state.imgWidth)/2 + "px";
			let centerFrac = calcCenterFrac(state);
			state.centerFrac = centerFrac;
			BodyDiv.setState(state);
		}
	});
	imgDiv.addEventListener("mouseup", _ => {
		let state = BodyDiv.state;
		state.barIsClicked = false;
		BodyDiv.setState(state)
	});
}

function calcCenterFrac(state) {
	return (state.barPos + bar.clientWidth/2)/state.imgWidth
}

async function getImgSrcResult(state) {
	let stripType = state.selectedStripOption;
	let imgSrc = state.imgSrcFC;

	let center_frac = 0.5
	if (stripType === "customStrip") {
		center_frac = state.centerFrac;
	} else if (stripType === "noStrip") {
		center_frac = "None";
	}

	let center = true
	if (stripType === "fullStrip") {
		center = false;
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
		return body;
	} else {
		// Handle error?
		return "";
	}
}

function download(filename, text) {
	var element = document.createElement('a');
	element.setAttribute('href', text);
	element.setAttribute('download', filename);

	element.style.display = 'none';
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
}

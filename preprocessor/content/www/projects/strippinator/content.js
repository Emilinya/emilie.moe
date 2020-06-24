import { h, Component, render } from 'https://unpkg.com/preact?module';
import htm from 'https://unpkg.com/htm?module';

const html = htm.bind(h);

function RadioInput(props) {
	let checked = props.checked ? "checked" : "";
	let style = props.last ? "margin-bottom: 10px" : ""
	return html`
		<label>${props.label}
			<input type="radio" name="stripType" value="${props.value}" onClick=${props.onClick} style="${style}" ${checked}></input>
		</label>
	`;
}

function RadioButtons(props) {
	return html`
	<div style="display: inline-block; text-align: right">
		<${RadioInput} onClick=${props.onRadioClick} label="Strip top and bottom only" value="noStrip" checked /><br/>
		<${RadioInput} onClick=${props.onRadioClick} label="Strip sides, keep center" value="centerStrip" /><br/>
		<${RadioInput} onClick=${props.onRadioClick} label="Strip sides with custom center" value="customStrip" /><br/>
		<${RadioInput} onClick=${props.onRadioClick} label="Fully strip sides" value="fullStrip" last />
	</div>`;
}

function FractionCalculator(props) {
	let visibility = (props.imgIsLoading && !props.display) ? "hidden" : "visible";
	let divDisplay = (props.display || props.imgIsLoading) ? "grid" : "none";
	let barColor = props.barIsClicked ? "rgba(0, 0, 0, 0.3)" : "rgba(0, 0, 0, 0.6)";
	let pDisplay = props.display ? "inline" : "none";
	let leftMargin = (props.screenWidth - props.imgWidth)/2
	return html`
	<div id="imgDiv" style="display: ${divDisplay}; visibility: ${visibility};">
		<img id="imgFC" class="bigImg noPointer" style="grid-area: 1 / 1; margin: 0 auto 0 auto" src="${props.imgSrc}" onLoad=${props.onImgLoad} />
		<div id="bar" style="height: ${props.imgHeight}px; margin-left: ${leftMargin + props.barPos}px; background-color: ${barColor}"></div>
	</div>
	<p id=percentP style="display: ${pDisplay}">${Math.round(props.centerFrac*1000)/10} %</p>`;
}

class BodyDivContent extends Component {
	constructor() {
		super();
		this.state = {
			screenWidth: window.innerWidth,
			selectedStripOption: "noStrip",
			imgName: "",
			imgSrcFC: "",
			imgIsLoadingFC: false,
			imgHeight: 0,
			imgWidth: 0,
			barIsClicked: false,
			barPos: 0,
			centerFrac: 0.5,
			displayResult: false,
			imgSrcResult: "",
		};
	}

	onRadioClick = event => {
		if (this.state.selectedStripOption !== event.target.value) {
			let state = this.state;
			state.selectedStripOption = event.target.value;
			this.setState(state);
		}
	}

	onImgButtonClick = _ => document.getElementById('imgInput').click()
	onImgInputChange = event => {
		let state = this.state
		let imgInput = event.target;
		let file = imgInput.files[0];
		state.imgName = file.name;

		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.addEventListener('load', event => {
			if (event.target.result !== state.imgSrcFC) {
				state.imgIsLoadingFC = true;
				state.imgSrcFC = event.target.result;

				this.setState(state);
			}
		});
	}
	onImgFCLoad = event => {
		let state = this.state;
		state.imgIsLoadingFC = false;
		state.imgHeight = event.target.clientHeight;
		state.imgWidth = event.target.clientWidth;
		state.barPos = state.imgWidth/2;
		state.imgSrcResult = "";
		state.displayResult = false;
		this.setState(state);
	}

	onStripButtonClick = async _ => {
		let state = this.state;
		state.imgSrcResult = await getImgSrcResult(this.state);
		this.setState(state);
	}
	onImgResultLoad = _ => {
		let state = this.state;
		state.displayResult = true;
		this.setState(state);
	}

	onDownloadButtonClick = _ => {
		let [name, extension] = this.state.imgName.split(".");
		let fileName = `${name.replace(" ", "")}-stripped.${extension}`;
		download(fileName, this.state.imgSrcResult);
	}


	render(props, state) {
		let displayFC = false;
		if (state.selectedStripOption === "customStrip" && state.imgSrcFC !== "") {
			displayFC = true;
		}
		let displayStripButton = state.imgSrcFC !== "" && !state.imgIsLoadingFC ? "inline" : "none";
		let displayResultH3 = state.imgSrcResult !== "" ? "block" : "none";
		let displayResultImg = state.imgSrcResult !== "" ? "inline" : "none";
		let displayDownloadButton = state.displayResult ? "inline" : "none";
		return html`
			<h1 style="margin-bottom: 0px">Remove whitespace from image</h1>
			<a class="listLink" href="https://github.com/Benito1001/bendik.moe/blob/master/server/strippinator.py" target="_blank">Link to source code</a>
			<br/><br/>
			<button type="button" onClick=${this.onImgButtonClick} style="margin-bottom: 10px">upload image</button><span id="imgNameSpan"> ${state.imgName}</span><br/>
			<input type="file" accept="image/*" id=imgInput onChange=${this.onImgInputChange} hidden />
			<${RadioButtons} onRadioClick=${this.onRadioClick}/>
			<${FractionCalculator}
				display="${displayFC}" imgHeight="${state.imgHeight}" imgWidth="${state.imgWidth}" barPos="${state.barPos}"
				barIsClicked="${state.barIsClicked}" screenWidth="${state.screenWidth}" centerFrac="${state.centerFrac}"
				imgSrc="${state.imgSrcFC}" onImgLoad="${this.onImgFCLoad}" imgIsLoading="${state.imgIsLoadingFC}"
			/><br/>
			<button type="button" id="stripButton" style="display: ${displayStripButton}" onClick=${this.onStripButtonClick}>Strip Image</button>
			<br/>
			<h1 style="display: ${displayResultH3}; margin-bottom: 5px">Result:</h1>
			<img src="${state.imgSrcResult}" class="bigImg" onLoad=${this.onImgResultLoad} style="display: ${displayResultImg}" /><br/>
			<button type="button" id="downloadButton" style="display: ${displayDownloadButton}" onClick=${this.onDownloadButtonClick}>Download Image</button>
		`;
	}

	componentDidMount() {
		addDragBarELs(document.getElementById('imgDiv'), document.getElementById('bar'), this);

		window.addEventListener("resize", _ => {
			let img = document.getElementById('imgFC');
			let bar = document.getElementById('bar');
			let state = this.state;
			state.screenWidth = window.innerWidth;
			state.imgHeight = img.clientHeight;
			state.imgWidth = img.clientWidth;
			state.barPos = state.centerFrac*img.clientWidth - bar.clientWidth/2;
			this.setState(state);
		});
	}
}

const app = html`<${BodyDivContent} />`;

render(app, document.getElementsByClassName('bodyDiv')[0]);

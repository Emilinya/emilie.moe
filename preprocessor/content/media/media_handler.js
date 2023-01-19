const imageDiv = document.getElementsByClassName('imageDiv')[0]
const root = document.documentElement;
let gridColumns = 1;

function resize() {
	let windowRatio = window.innerWidth / window.innerHeight;
	gridColumns = Math.floor(1.3 * windowRatio);
	root.style.setProperty("--grid-columns", gridColumns);
}
window.addEventListener('resize', resize);
resize();

function getDate(dateStr) {
	let [date, time] = dateStr.split(" ");
	let [year, month, day] = date.split(":");
	let [hour, minute, second] = time.split(":");
	return new Date(year, month - 1, day, hour, minute, second)
}

function getDates(img_data_array) {
	dates = {};
	for (let img_data of img_data_array) {
		let date = img_data.DateTime.split(" ")[0];
		let [year, month, day] = date.split(":");
		if (!dates[year]) {
			dates[year] = {};
		}
		if (!dates[year][month]) {
			dates[year][month] = {};
		}
		dates[year][month][day] = true;
	}
	return dates;
}

function toDateStr(date, format) {
	config = {}
	if (!format) {
		config = { year: "numeric", month: "long", day: "numeric" };
	} else {
		types = format.split(" ")
		if (types.includes("year")) {
			config.year = "numeric";
		}
		if (types.includes("month")) {
			config.month = "long";
		}
		if (types.includes("day")) {
			config.day = "numeric"
		}
	}
	return date.toLocaleDateString("en", config);
}

function getDateRangeString(firstDate, lastDate) {
	sameYear = firstDate.getFullYear() === lastDate.getFullYear();
	sameMonth = firstDate.getMonth() === lastDate.getMonth();
	sameDay = firstDate.getDay() === lastDate.getDay();

	if (sameYear) {
		if (sameMonth) {
			if (sameDay) {
				return toDateStr(lastDate);
			} else {
				year = toDateStr(lastDate, "year");
				month = toDateStr(lastDate, "month");
				dayRange = lastDate.getDate() + "-" + firstDate.getDate();
				return month + " " + dayRange + ", " + year;
			}
		} else {
			year = toDateStr(lastDate, "year");
			firstMonth = toDateStr(firstDate, "month day");
			lastMonth = toDateStr(lastDate, "month day");
			return firstMonth + " - " + lastMonth + ", " + year;
		}
	} else {
		return toDateStr(lastDate) + " - " + toDateStr(firstDate);
	}
}

function compareImgTimes(imgData1, imgData2) {
	date1 = getDate(imgData1.DateTime);
	date2 = getDate(imgData2.DateTime);
	if (date1 > date2) {
		return -1;
	}
	if (date1 < date2) {
		return 1;
	}
	return 0;
}

function getPos(PosInfo) {
	country = PosInfo.country;
	city = PosInfo.city;
	if (!city) {
		city = PosInfo.town;
		if (!city) {
			city = PosInfo.municipality;
		}
	}
	return [country, city];
}

function getBlocks(img_data_array) {
	img_blocks = [];
	block_index = 0;
	while (true) {
		block_pos = getPos(img_data_array[block_index].PosInfo);
		block_imgs = [{
			name: img_data_array[block_index].name, dateStr: img_data_array[block_index].DateTime,
			size: img_data_array[block_index].size, index: block_index
		}];
		reached_end = true;
		for (let i = block_index + 1; i < img_data_array.length; i++) {
			pos = getPos(img_data_array[i].PosInfo);
			if (pos[1] === block_pos[1]) {
				block_imgs.push({
					name: img_data_array[i].name, dateStr: img_data_array[i].DateTime,
					size: img_data_array[i].size, index: i
				});
			} else {
				block_index = i;
				img_blocks.push({ pos: block_pos, imgs: block_imgs });
				reached_end = false;
				break;
			}
		}
		if (reached_end) {
			img_blocks.push({ pos: block_pos, imgs: block_imgs });
			break;
		}
	}
	return img_blocks;
}

function addImg(div, source, size, limitHeight) {
	let imgContainer = document.createElement("div");
	imgContainer.className = "imgContainer";
	let img = document.createElement("img");
	img.className = (limitHeight ? "small" : "") + "gridImg";
	img.src = source;
	let ratio = size.width / size.height * 3 / 4
	if (ratio - 1 > 0.1) {
		// wide image
		if (gridColumns > 1) {
			let span = Math.min(Math.ceil(1.2 * ratio), gridColumns);
			imgContainer.style.gridColumn = "span " + span;
			if (span < gridColumns) {
				img.style.width = 100 * ratio / span - 0.7 + "%";
			}
		}
	} else if (ratio - 1 < -0.1) {
		// high image
		// TODO: what if an image is realy tall? (But why would it be?)
		imgContainer.style.gridRow = "span 2";
	}

	imgContainer.appendChild(img);
	div.appendChild(imgContainer);
}

img_data_array.sort(compareImgTimes);
img_blocks = getBlocks(img_data_array);
img_dates = getDates(img_data_array);

for (let block of img_blocks) {
	let [country, city] = block.pos;

	// location
	h1 = document.createElement("h1");
	h1.appendChild(document.createTextNode(city + ", " + country));
	h1.style.marginBottom = "5px";
	imageDiv.appendChild(h1);

	// time
	firstDate = getDate(block.imgs[0].dateStr);
	lastDate = getDate(block.imgs[block.imgs.length - 1].dateStr);

	h3 = document.createElement("h3");
	h3.appendChild(document.createTextNode(getDateRangeString(firstDate, lastDate)));
	h3.style.marginTop = "5px";
	h3.className = "gray"
	imageDiv.appendChild(h3);

	// images
	blockDiv = document.createElement("div");
	blockDiv.className = "blockDiv";
	let limitHeight = false;
	if (block.imgs.length < gridColumns) {
		blockDiv.className = "";
		limitHeight = true;
	}
	for (let img of block.imgs) {
		addImg(blockDiv, "compressed_imgs/" + img.name, img.size, limitHeight);
	}
	imageDiv.appendChild(blockDiv);
}

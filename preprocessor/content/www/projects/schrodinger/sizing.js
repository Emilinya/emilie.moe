var topDiv = document.getElementById("topDiv");
var video = document.getElementById("animVideo");
video.addEventListener("loadeddata", resize);

var resizeCalled = false;

// I would hope there is a simpler, pure-css way of doing this, but who knows
function resize() {
    resizeCalled = true;
    console.debug("Resizing");
    var ratio = video.offsetWidth / video.offsetHeight;

    var availableHeight = innerHeight - topDiv.offsetHeight;
    var availableWidth = topDiv.offsetWidth;
    var availableRatio = availableWidth / availableHeight;

    if (ratio > availableRatio) {
        // image is wider than available space, limit by width
        video.style.width = availableWidth + "px";
        video.style.height = "auto";
    } else {
        // image is taller than available space, limit by height
        video.style.width = "auto";
        video.style.height = availableHeight + "px";
    }

    video.style.display = "";
}
window.addEventListener("resize", resize);

// sometimes 'loadeddata' does not get called? So here is a hack :)
setTimeout(() => {
    if (!resizeCalled) {
        resize();
    }
}, 100);

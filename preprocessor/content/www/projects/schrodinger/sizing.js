var topDiv = document.getElementById("topDiv");
var video = document.getElementById("animVideo");

// I would hope there is a simpler, pure-css way of doing this, but who knows
function resize() {
    var ratio = video.offsetWidth/video.offsetHeight;
    
    var availableHeight = innerHeight - topDiv.offsetHeight;
    var availableWidth = topDiv.offsetWidth;
    var availableRatio = availableWidth/availableHeight;

    console.log(availableHeight, availableWidth, availableRatio, ratio);

    if (ratio > availableRatio) {
        // image is wider than available space, limit by width
        video.style.width = availableWidth+"px";
        video.style.height = "auto";
    } else {
        // image is taller than available space, limit by height
        video.style.width = "auto";
        video.style.height = availableHeight+"px";
    }
}
window.addEventListener("resize", resize);

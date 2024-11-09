timestamp = Date.now();

const urlParams = new URLSearchParams(window.location.search);
var skipIntro = false;
if(urlParams.has("skip")){
    skipIntro = true;
    document.querySelector(".path").style = "animation: none; fill: #DDEEFF; filter: none;";
    document.querySelector(".orbit0").style = "animation: breathOrbits 10s ease-in-out forwards infinite; stroke-dasharray: 50 0; fill: none; filter: none; transform-origin: 160px 90px; transform: rotate(40deg);";
    document.querySelector(".orbit1").style = "animation: breathOrbits 10s ease-in-out forwards infinite 0.3s; stroke-dasharray: 50 0; fill: none; filter: none; transform-origin: 160px 90px; transform: rotate(40deg);";
    document.querySelector(".orbit2").style = "animation: breathOrbits 10s ease-in-out forwards infinite 0.6s; stroke-dasharray: 50 0; fill: none; filter: none; transform-origin: 160px 90px; transform: rotate(40deg);";
    document.querySelector(".orbit3").style = "animation: breathOrbits 10s ease-in-out forwards infinite 0.9s; stroke-dasharray: 50 0; fill: none; filter: none; transform-origin: 160px 90px; transform: rotate(40deg);";
    document.querySelector(".orbit4").style = "animation: breathOrbits 10s ease-in-out forwards infinite 1.2s; stroke-dasharray: 50 0; fill: none; filter: none; transform-origin: 160px 90px; transform: rotate(40deg);";
    document.body.style = "animation: colourEffect 120s ease-in-out both infinite;";
}

document.getElementById("amaform").addEventListener("submit", prank);
function prank(e){
    e.preventDefault();
    window.location = "https://google.com/search?q=" + document.getElementById("amaform").children[0].value;
}

document.getElementById("emailform").addEventListener("submit", emailorsmth);
function emailorsmth(e){
    e.preventDefault();
    document.getElementById("you").innerHTML = "Party Planner: " + document.getElementById("emailform").children[0].value + "<div class='tooltiptext'>Newest Member!</div>";
}

function calculateDistanceY(elem, mouseY) {
    var rect = elem.getBoundingClientRect();
    var centerY = rect.top + (elem.offsetHeight / 2);
    return Math.floor(Math.abs(mouseY - centerY));
}

function updateToolbar(e){
    if((Date.now()-timestamp)/1000 > 5 || skipIntro){
        let distance
        if(e != null) distance = calculateDistanceY(toolbar, e.pageY);
        else distance = calculateDistanceY(toolbar, 1000)
        distance = Math.min(distance, document.body.scrollTop)
        if(distance < 100){
            toolbar.style.opacity = 1-(distance*distance/10000);
        }
        else{
            toolbar.style.opacity = "0";
        }
    }
    else{
        toolbar.style.opacity = Math.max(0, (((Date.now()-timestamp)/1000)-3)/2)
    }
}


toolbar = document.getElementById("toolbar")

lastMouseEvent = null;

if(!skipIntro){
    id = setInterval(()=>updateToolbar(lastMouseEvent), 10);
    setTimeout(()=>clearInterval(id), 5000)
}

document.addEventListener("mousemove", (e)=>{
    updateToolbar(e);
    lastMouseEvent = e;
});

document.body.addEventListener("scroll", (e)=>{
    updateToolbar(lastMouseEvent);
});


const urlParams = new URLSearchParams(window.location.search);

projectInfo = []
fetch('projects.json').then((res)=>res.json()).then((json)=>{
    projectInfo = json;
    if (urlParams.has("author")){
        projectInfo = json.filter(item => item.author === parseInt(urlParams.get("author")));
    }
    if (urlParams.has("project-id")){
        if (parseInt(urlParams.get("project-id")) != 0){
            setHero(parseInt(urlParams.get("project-id")));
        }
    }
});

const pos = { x : 0, y : 0 };

const saveCursorPosition = function(x, y) {
    pos.x = (x / window.innerWidth).toFixed(2);
    pos.y = (y / window.innerHeight).toFixed(2);
    document.documentElement.style.setProperty('--x', pos.x);
    document.documentElement.style.setProperty('--y', pos.y);
}

document.addEventListener('mousemove', e => { saveCursorPosition(e.clientX, e.clientY); })

hero = document.getElementById("hero");
fg = document.getElementById("foreground");
bg = document.getElementById("background");
nextfg = document.getElementById("next-foreground");
nextbg = document.getElementById("next-background");
blurb = document.getElementById("blurb");
heroId = 0;

function updateHero(input){
    sign = "";
    inverseSign = "-";
    if (typeof input == 'number'){
        old = heroId;
        heroId = input;
        if (input - old > 0) {sign = "-"; inverseSign = "";}
    }
    else if (typeof input == 'boolean'){
        if(input){
            heroId++;
        }
        else{
            heroId--;
            sign = "-";
            inverseSign = "";
        }
        if (heroId < 0){
            heroId = projectInfo.length - 1
        }
        heroId = heroId % projectInfo.length
    }
    if(projectInfo[heroId]["project-link"] != ""){
        fg.onclick = ()=>window.open(projectInfo[heroId]["project-link"], '_blank').focus();
    }
    else{
        fg.onclick = ()=>{};
    }
    blurb.style.setProperty("--max-height", "0px");
    nextfg.style.transform = "translate("+sign+"100vw,0)";
    nextbg.style.opacity = "0";
    setTimeout(()=>{
        nextfg.style.background = "url(projects/" + projectInfo[heroId]["name"] + "/Foreground.webp) 50% 50%";
        nextfg.style.transform = "translate(0vw, 0)";
        nextfg.style.transition = "transform 1s ease-in-out";
        nextbg.style.background = "url(projects/" + projectInfo[heroId]["name"] + "/Background.webp) 50% 50%";
        nextbg.style.opacity = "1";
        nextbg.style.transition = "opacity 1s ease-in-out, filter 0.5s";
        fg.style.transition = "transform 1s ease-in-out";
        fg.style.transform = "translate("+inverseSign+"100vw, 0)";
        bg.style.transition = "opacity 1s ease-in-out, filter 0.5s";
        bg.style.opacity = "0";
    
        setTimeout(()=>{
            fg.style.transition = "";
            fg.style.background = "url(projects/" + projectInfo[heroId]["name"] + "/Foreground.webp) 50% 50%";
            fg.style.transform = "rotateX(calc((var(--y) - 0.5) * 25deg)) rotateY(calc((var(--x) - 0.5) * -25deg))";
            bg.style.transition = "filter 0.5s";
            bg.style.background = "url(projects/" + projectInfo[heroId]["name"] + "/Background.webp) 50% 50%";
            bg.style.opacity = "1";
            nextfg.style.transition = "";
            nextfg.style.transform = "translate("+sign+"100vw,0)";
            nextbg.style.transition = "filter 0.5s";
            nextbg.style.opacity = "0";
            blurb.style.setProperty("--max-height", projectInfo[heroId]["max-height"]);
            blurb.innerText = projectInfo[heroId]["blurb"];
        }, 1000);
    }, 1);
}

function setHero(input){
    heroId = input;
    if(projectInfo[heroId]["project-link"] != ""){
        fg.onclick = ()=>window.open(projectInfo[heroId]["project-link"], '_blank').focus();
    }
    else{
        fg.onclick = ()=>{};
    }
    fg.style.background = "url(projects/" + projectInfo[heroId]["name"] + "/Foreground.webp) 50% 50%";
    fg.style.transform = "rotateX(calc((var(--y) - 0.5) * 25deg)) rotateY(calc((var(--x) - 0.5) * -25deg))";
    bg.style.transition = "filter 0.5s";
    bg.style.background = "url(projects/" + projectInfo[heroId]["name"] + "/Background.webp) 50% 50%";
    nextbg.style.opacity = "0";
    blurb.style.setProperty("--max-height", projectInfo[heroId]["max-height"]);
    blurb.innerText = projectInfo[heroId]["blurb"];
}
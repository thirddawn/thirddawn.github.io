projectInfo = []
fetch('projects.json').then((res)=>res.json()).then((json)=>{
    projectInfo = json;
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
    nextfg.style.transform = "translate("+sign+"100vw,0)";
    nextbg.style.opacity = "0";
    setTimeout(()=>{
        nextfg.style.background = "url(projects/" + projectInfo[heroId]["name"] + "/Foreground.png) 50% 50%";
        nextfg.style.transform = "translate(0vw, 0)";
        nextfg.style.transition = "transform 1s ease-in-out";
        nextbg.style.background = "url(projects/" + projectInfo[heroId]["name"] + "/Background.png) 50% 50%";
        nextbg.style.opacity = "1";
        nextbg.style.transition = "opacity 1s ease-in-out, filter 0.5s";
        fg.style.transition = "transform 1s ease-in-out";
        fg.style.transform = "translate("+inverseSign+"100vw, 0)";
        bg.style.transition = "opacity 1s ease-in-out, filter 0.5s";
        bg.style.opacity = "0";
    
        setTimeout(()=>{
            fg.style.transition = "";
            fg.style.background = "url(projects/" + projectInfo[heroId]["name"] + "/Foreground.png) 50% 50%";
            fg.style.transform = "rotateX(calc((var(--y) - 0.5) * 25deg)) rotateY(calc((var(--x) - 0.5) * -25deg))";
            bg.style.transition = "filter 0.5s";
            bg.style.background = "url(projects/" + projectInfo[heroId]["name"] + "/Background.png) 50% 50%";
            bg.style.opacity = "1";
            nextfg.style.transition = "";
            nextfg.style.transform = "translate("+sign+"100vw,0)";
            nextbg.style.transition = "filter 0.5s";
            nextbg.style.opacity = "0";
        }, 1000);
    }, 1);
}
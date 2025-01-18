img1 = document.getElementById("img1");
img2 = document.getElementById("img2");

heroImages = ["https://static.wixstatic.com/media/7540a66fadec4af4923b8edb5477a575.jpg/v1/fill/w_1903,h_843,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/7540a66fadec4af4923b8edb5477a575.jpg","https://static.wixstatic.com/media/ff54d5_cb5873f1a94943bc85ef589dd8a78aa0~mv2.jpg/v1/fill/w_1740,h_771,al_c,q_85,enc_avif,quality_auto/ff54d5_cb5873f1a94943bc85ef589dd8a78aa0~mv2.jpg", "house_3.png"];

heroId = 0;

function updateHero(input){
    newId = 0;
    if(typeof input == "number"){
        newId = input;
    }
    if(typeof input == "boolean"){
        if(input){
            newId = heroId + 1;
        }
        else{
            newId = heroId - 1;
        }
        if(newId < 0) newId += heroImages.length;
        newId = newId % heroImages.length;
    }
    img1.style.opacity = 0;
    img2.style.opacity = 1;
    console.log(heroId);
    console.log(newId)
    img1.style.backgroundImage = "url(" + heroImages[heroId] + ")";
    img2.style.backgroundImage = "url(" + heroImages[newId] + ")";
    img1.style.transition = "opacity 1s";
    img2.style.transition = "opacity 1s";
    setTimeout(()=>{
        img1.style.opacity = 1;
        img2.style.opacity = 0;
        img1.style.backgroundImage = "url(" + heroImages[newId] + ")";
        img1.style.transition = "";
        img2.style.transition = "";
        heroId = newId;
    }, 1000);
}

setInterval(()=>updateHero(true), 5000)
function createCards(){
    fetch('team.json').then((res)=>res.json()).then((json)=>{
        main = document.getElementById("main");

        json.forEach((card)=>{
            main.innerHTML += `
            <div class="card inactiveCard" style="--image-url:url('${card.foreground}'); --background-image-url:url('${card.background}'); --neon:${card.neon}; --neon-glow:${card.neonGlow}; --neon-position: ${card.neonPosition}; --text-position: ${card.textPosition};" data-index="${json.indexOf(card)}">
            <div class="background"></div>
            <div class="shine"></div>
            <h1>${card.name}, ${card.title}</h1>
            <p>${card.flavour}
            <br><br>
            ${card.details}
            </p><div class="border1"></div><div class="border2"></div><div class="border3"></div></div>`;
        });

        data = json;

        setupCards();
    });
}

data = []
pageHTML = ""

function setupCards(){
    const cards = Array.from(document.querySelectorAll(".card"));
    cards[cards.length - 1].classList.remove('inactiveCard');
    var cardIndex = 0;
    updateCardPositions();
    cards.forEach((card)=>{


        const shine = card.querySelector('.shine');

        var x = 0;
        var y = 0;
        var offsetX, offsetY;
        var isDragging = false;

        function handleMouseMove(event) {
            if(!isDragging){
                const cardRect = card.getBoundingClientRect(); // Get the dimensions of the card
                const cardWidth = cardRect.width;
                const cardHeight = cardRect.height;
            
                // Get mouse position relative to the card
                const mouseX = event.clientX - cardRect.left;
                const mouseY = event.clientY - cardRect.top;
            
                // Calculate rotation values based on mouse position (range: -30 to 30 degrees)
                const rotateX = ((mouseY / cardHeight) - 0.5) * 40;  // Rotate along X-axis (increase rotation for more effect)
                const rotateY = ((mouseX / cardWidth) - 0.5) * -40; // Rotate along Y-axis (increase rotation for more effect)
            
                // Apply the 3D transformation to the card
                card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.1) translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
            
                // Dynamically update the background gradient to simulate shine
                const angle = Math.atan2(mouseY - cardRect.top, mouseX - cardRect.left) * 180 / Math.PI; // Angle of the light
                const gradient = `linear-gradient(${angle + 90}deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%)`;
            
                shine.style.background = gradient;
            }
        }
        
        // Attach mousemove event listener to the card
        card.addEventListener('mousemove', handleMouseMove);
        
        // Optionally, add a 'mouseleave' event to reset the transformation when the mouse leaves the card
        card.addEventListener('mouseleave', () => {
            if(!isDragging){
                card.style.transform = `rotateX(0deg) rotateY(0deg) translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
                
                shine.style.background = "none"; 
            }
        });

        card.addEventListener('mousedown', (e)=>{
            isDragging = true;
            offsetX = e.pageX;
            offsetY = e.pageY;

            document.addEventListener('mousemove', mouseMove);
            document.addEventListener('mouseup', mouseUp);

            function mouseMove(e){
                x = e.pageX - offsetX;
                y = e.pageY - offsetY;
                card.style.transform = `rotateX(${((e.pageY / window.innerHeight) - 0.5) * 90}deg) rotateY(${((e.pageX / window.innerWidth) - 0.5) * -90}deg) scale(1.1) translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
            }

            function mouseUp(e){
                document.removeEventListener('mousemove', mouseMove);
                document.removeEventListener('mouseup', mouseUp);
                if(x > window.innerWidth*0.3){
                    pageHTML += data[cards[(cardIndex + cards.length - 1) % cards.length].getAttribute("data-index")]["html"];
                    pageHTML += "<div class='divider'></div>"
                    card.classList.add("inactiveCard");
                    cards[cardIndex].classList.remove("inactiveCard");
                    cardIndex++;
                    if(cardIndex >= cards.length){
                        cardIndex -= cards.length;
                        generatePage();
                    }
                    updateCardPositions();
                }
                else if(x < -window.innerWidth*0.3){
                    card.classList.add("inactiveCard");
                    cards[cardIndex].classList.remove("inactiveCard");
                    cardIndex++;
                    if(cardIndex >= cards.length){
                        cardIndex -= cards.length;
                        generatePage();
                    }
                    updateCardPositions();
                }
                x=0;
                y=0;
                setTimeout(()=>isDragging = false, 50);
            }
        });
    })

    function updateCardPositions(){
        for (let i = cards.length-1; i >= 0; i--) {
            var index = (i+cardIndex-1)%cards.length;
            if(index < 0) index += cards.length;
            const card = cards[index];
            card.style.zIndex = cards.length - i;
            card.style.transform = `translate(-${50-i}%,-${50-i}%) rotate(${-i}deg)`;
        }
    }
}

createCards();

info = document.getElementById("info");

info.children[0].style.opacity = 1;

setTimeout(()=>info.children[1].style.opacity = 1, 1000);

infoIndex = 0
infoList = ["This game is simple", "Swipe right to learn more", "Swipe left to ignore", "(Don't worry, this is definitely not Tinder)"]

document.addEventListener("mousedown", ()=>{
    info.children[0].style.opacity = 0;
    info.children[1].style.opacity = 0;
    if(infoIndex == 0) setTimeout(()=>info.children[1].style.display = "none", 500);
    if(infoIndex < infoList.length - 1){
        setTimeout(()=>{info.children[0].innerText = infoList[infoIndex]; info.children[0].style.opacity = 1;}, 500);
        infoIndex++;
    }
    else{
        setTimeout(()=>document.getElementById("main").style.opacity = 1, 500);
    }
});

page = document.getElementById("page");

function generatePage(){
    page.innerHTML = "";
    page.innerHTML += pageHTML;
    pageHTML = "";
    page.innerHTML += `
    <footer class="footerContainer">
        <div class="row"><h1>Third Dawn Studios</h1><a href="https://g.co/kgs/8oDYffJ" class="textColour">Nelson, New Zealand</a><div id="CEO" class="tooltip">Sr Programmer: Vincent Rodley<div class="tooltiptext">Famous Youtuber <a href="https://www.youtube.com/@vindognz">@vindognz</a></div></div><div class="tooltip">Fullstack Developer: Fionn Cassidy<div class="tooltiptext"><i>No comment</i></div></div><div id="SrDev" class="tooltip">CEO: Joel Batchelar<div class="tooltiptext">And built this website</div></div><div id="you" class="tooltip"></div>
        <div class="row"><h2>Join Us</h2><form id="emailform"><input type="email" placeholder="you@email.com"><div id="submitButton" onclick="this.parentElement.requestSubmit()">-></div></form><br><h2>Have any questions?</h2><form id="amaform"><input type="text" placeholder="AMA question"><div id="submitButton" onclick="this.parentElement.requestSubmit()">-></div></form></div>
        <div class="row"><h2>Quick Links</h2><a href="#main" style="color: #919bff; margin-top: 10px;">To Top</a><a href="/team" style="color: #919bff; margin-top: 5px;">Meet The Team</a><a href="/projects" style="color: #919bff; margin-top: 5px;">Projects</a></div>
    </footer>`
    page.style.display = "flex";
    page.scrollIntoView({behavior: 'smooth'});
}
const cards = Array.from(document.querySelectorAll(".card"));
//cards.reverse();
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
        
            // Apply rotation to h1 and p for additional floating effect
            const h1 = card.querySelector('h1');
            const p = card.querySelector('p');
            
            // Apply stronger "push away" effect on the text, moving it down
            h1.style.transform = `translateZ(-50px) rotateX(${rotateX * 0.4}deg) rotateY(${rotateY * 0.4}deg)`; // h1 pushes away
            p.style.transform = `translateZ(-30px) rotateX(${rotateX * 0.3}deg) rotateY(${rotateY * 0.3}deg)`; // p pushes away less than h1
        
            // Calculate the shine angle based on mouse position
            const shineX = (mouseX / cardWidth) * 100; // Shine's horizontal position (percentage of card width)
            const shineY = (mouseY / cardHeight) * 100; // Shine's vertical position (percentage of card height)
        
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
            const h1 = card.querySelector('h1');
            const p = card.querySelector('p');
            h1.style.transform = 'translateZ(-50px)';
            p.style.transform = 'translateZ(-30px)';
            
            shine.style.background = "none"; 
        }
    });

    card.addEventListener('mousedown', (e)=>{
        isDragging = true;
        offsetX = e.pageX;
        offsetY = e.pageY;

        var lastX, lastY = 0

        document.addEventListener('mousemove', mouseMove);
        document.addEventListener('mouseup', mouseUp);

        function mouseMove(e){
            x = e.pageX - offsetX;
            y = e.pageY - offsetY;
            card.style.transform = `rotateX(${Math.max(Math.min((y-lastY), 45), -45)}deg) rotateY(${Math.max(Math.min((x-lastX), 45), -45)}deg) scale(1.1) translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
            lastX = x
            lastY = y
        }

        function mouseUp(e){
            document.removeEventListener('mousemove', mouseMove);
            document.removeEventListener('mouseup', mouseUp);
            if(x > window.innerWidth*0.3){
                console.log("love")
                card.classList.add("inactiveCard");
                cards[cardIndex].classList.remove("inactiveCard");
                cardIndex++;
                if(cardIndex >= cards.length){
                    cardIndex -= cards.length;
                }
                updateCardPositions();
            }
            else if(x < -window.innerWidth*0.3){
                console.log("hate")
                card.classList.add("inactiveCard");
                cards[cardIndex].classList.remove("inactiveCard");
                cardIndex++;
                if(cardIndex >= cards.length){
                    cardIndex -= cards.length;
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
        console.log(cards[index].children[1].innerText, i)
        card.style.zIndex = cards.length - i;
        card.style.transform = `translate(-${50-i}%,-${50-i}%) rotate(${-i}deg)`;
    }
}
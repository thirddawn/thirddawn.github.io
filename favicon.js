document.head = document.head || document.getElementsByTagName('head')[0];

startTimestamp = Date.now();

function changeFavicon(src) {
 var link = document.createElement('link'),
     oldLink = document.getElementById('dynamic-favicon');
 link.id = 'dynamic-favicon';
 link.rel = 'shortcut icon';
 link.href = src;
 if (oldLink) {
  document.head.removeChild(oldLink);
 }
 document.head.appendChild(link);
}

function updateFavicon(){
    time = (Date.now() - startTimestamp)/1000;
    url = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="64" height="64">
    <rect x="8" y="4" width="16" height="24" fill="none" stroke="white" stroke-width="2" style="transform-origin: center; transform: scale(${time%3})"></rect>
    <rect x="8" y="4" width="16" height="24" fill="none" stroke="white" stroke-width="2" style="transform-origin: center; transform: scale(${(time-1)%3})"></rect>
    <rect x="8" y="4" width="16" height="24" fill="none" stroke="white" stroke-width="2" style="transform-origin: center; transform: scale(${(time-2)%3})"></rect>
    </svg>`;
    changeFavicon('data:image/svg+xml, ' + url)
}

setInterval(updateFavicon, 100)
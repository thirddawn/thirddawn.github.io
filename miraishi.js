const urlSearchParams = new URLSearchParams(window.location.search);

if(urlSearchParams.has('stage')){
    localStorage.setItem('stage', urlSearchParams.get('stage'));
    window.location.href = window.location.origin + window.location.pathname;
}

const invisibleChar = '\u200B'; // Zero-width space
const commandList = [
    'help', 'login', 'dir', 'ls', 'cd', 'type', 'cat', 'echo', 'find', 'date', 'time', 'whoami', 'hostname', 'ping', 'ipconfig', 'ifconfig', 'uptime', 'uname', 'history', 'clear', 'cls'
];
const backendServerURL = "https://script.google.com/macros/s/AKfycbz7u3ptL_cm1KEhy04Llu-TNKIVf1kgRio22WRSNmdeU1e2W_jq-xFU9W_SLFh9DT8IQQ/exec";

const TOS = document.querySelector('.container h1');
const input = document.getElementById('input');

var savedLog = "";
var queue = "";
var charsPerSecond = 250;
var previousTimestamp = 0;
var charsAdded = 0;

var currentLoc = [];
var structure = [];

function UpdateText(time){
    delta = time - previousTimestamp;
    previousTimestamp = time;
    charsAdded += delta * charsPerSecond/ 1000;
    charsAdded = Math.min(charsAdded, queue.length);
    if(Math.round(charsAdded) > 0){
        savedLog += queue.substring(0, Math.round(charsAdded));
        queue = queue.substring(Math.round(charsAdded));
        charsAdded -= Math.round(charsAdded);
        if(window.innerHeight - TOS.offsetHeight <= 200) savedLog = savedLog.substring(savedLog.indexOf("<br>") + 4);
        TOS.innerHTML = savedLog;
    }
    requestAnimationFrame(UpdateText);
}

requestAnimationFrame(UpdateText);

function WriteText(string) {
    // return new Promise((resolve) => {
    //     if (isReadyForInput) holdMyBeer = true;
    //     let i = 0;
    //     let interval = setInterval(() => {
    //         if (string[i] === '\n')
    //             savedLog += '<br>';
    //         else
    //             savedLog += string[i];
    //         i++;
    //         if (i === string.length) {
    //             clearInterval(interval);
    //             if (holdMyBeer) {
    //                 holdMyBeer = false;
    //                 isReadyForInput = true;
    //             }
    //             resolve(); // Resolve the promise when the text writing is complete
    //         }
    //         TOS.innerHTML = savedLog;
    //     }, speed);
    // });
    queue += string;
    holdMyBeer = isReadyForInput;
    return new Promise((resolve) => {setTimeout(resolve,  string.length/charsPerSecond * 1000);});
}

function WriteLine(string) {
    savedLog += string;
    if(window.innerHeight - TOS.offsetHeight <= 200) savedLog = savedLog.substring(savedLog.indexOf("<br>") + 4);
    TOS.innerHTML = savedLog;
}

let steps = [
    "TCS Model 4000",
    "TOS v2.3 Boot Sequence",
    "-----------------------",
    " ",
    "Initializing hardware...",
    "  CPU: TCS 80486 @ 33MHz",
    "  RAM: 4MB - OK",
    "  Primary Disk: TCS-50MB HDD - OK",
    "  Floppy Drive A: 1.44MB - OK",
    "  Video Adapter: TCS VGA - OK",
    "  Network: TCS Ethernet - Connected",
    " ",
    "Performing POST...",
    "  Memory Test: 4096KB - OK",
    "  Hard Drive Test: TCS-50MB - OK",
    "  Boot Device: Primary HDD (TOS) - OK",
    "  Peripherals Test: Floppy, Video, Audio - OK",
    " ",
    "Loading TOS v2.3...",
    "  Mounting root filesystem...",
    "  Initializing system services...",
    "    Network: IP Assigned: 192.168.1.101 - OK",
    "    System time: Synchronized - OK",
    " ",
    "System ready. Type 'login' to continue.",
    " ",
    "> " + invisibleChar
];
  
isReadyForInput = false;

function displaySteps() {
    let delay = 0;
    let speed = 10; // Speed of typing effect in ms

    steps.forEach((step, index) => {
        setTimeout(() => {
            WriteText("<br>" + step);
        }, delay);

        delay += step.length * speed + 100; // Adds a pause between each step (500ms here)
    });

    setTimeout(() => {isReadyForInput = true;}, delay);
}

if (localStorage.getItem('stage') === null) {
displaySteps();
}
else{
    GetStageNumber();
    WriteLine("> ");
    isReadyForInput = true;
}



document.addEventListener('keydown', function(event) {
    if (isReadyForInput) {
        if (!TOS) return;

        const key = event.key;

        if (event.key === 'Enter') {
            const command = input.value.trim();
            savedLog += input.value;
            runCommand(command);
            document.getElementById('hint').innerText = ''; // Clear hint
            input.value = '';
        } else if (event.key === 'Tab') {
            event.preventDefault();
            const currentText = input.value.trim();
            const matchingCommand = commandList.find(cmd => cmd.startsWith(currentText));
            if (matchingCommand) {
                input.value = input.value.replace(currentText, matchingCommand);
                document.getElementById('hint').innerText = ''; // Clear hint
            }
        }
        TOS.innerHTML = savedLog + input.value;
    }
});

document.addEventListener('input', function(event) {
    TOS.innerHTML = savedLog + input.value;
    const currentText = input.value.trim();
    const matchingCommand = commandList.find(cmd => cmd.startsWith(currentText));
    if (matchingCommand && matchingCommand !== currentText) {
        document.getElementById('hint').innerText = matchingCommand;
    } else {
        document.getElementById('hint').innerText = '';
    }
});

function extractArguments(command) {
    const parts = command.split(/\s+/);
    return parts;
}

function runCommand(command) {
    const args = extractArguments(command);
    switch(args[0]) {
        case 'help':
            WriteText("<br>Available commands: " + commandList.join(', ') + "<br>Type 'help' followed by a command for more information on a specific command.").then(()=>{
                if(localStorage.getItem("stage") == "d976e9d7-2c35-4130-b97a-eda83419e709") WriteText("<br>Many commands do not work without logging in. Please type 'login' to continue.").then(()=>WriteLine('<br>' + "> "));
                else WriteText('<br>' + "> ");
            });
            break;
        case 'login':
            if(args.length < 3){
                WriteText("<br>Incorrect command usage, login [username] [password]<br>> ");
                break;
            }
            isReadyForInput = false;
            WriteText("<br>Logging in...<br>");
            console.log(backendServerURL + "?cmd=login&user="+args[1]+"&pwd="+args[2]);
            getData("?cmd=login&user="+args[1]+"&pwd="+args[2], 3, data=>{
                if(data.status == "success"){
                    localStorage.setItem('stage', data.stage);
                    GetStageNumber();
                }
                WriteText("<br>" + data.reply + "<br>" + "> ").then(()=>{isReadyForInput = true;});
            });
            break;
        case 'clear':
            savedLog = "";
            WriteLine("> ");
            break;
        case 'cls':
            savedLog = "";
            WriteLine("> ");
            break;
        case 'dir':

        default:
            WriteText("<br>'" + command + "' is not recognized as an internal command, ensure drives are mounted correctly if trying to access files.<br>> ");
            break;
    }
}



function GetStageNumber(){
    document.getElementById("qrcode").innerHTML = "";
    new QRCode(document.getElementById("qrcode"), {
        text: "https://thirddawnstudios.com/miraishi?stage=" + localStorage.getItem('stage'),
        width: 512,
        height: 512,
        colorDark : "#00000000",
        colorLight : "#10e010",
        correctLevel : QRCode.CorrectLevel.H
    });
    document.getElementById("link").href = "https://thirddawnstudios.com/miraishi?stage=" + localStorage.getItem('stage');
    document.getElementById("link").innerText = "https://thirddawnstudios.com/miraishi?stage=" + localStorage.getItem('stage');
    
    getData("?cmd=stage&stage=" + localStorage.getItem('stage'), 5, data=>{
        if(data.status == "error") return;
        document.getElementById("stageLabel").innerText = "Stage " + data.reply;
    });
}

function showStage(){
    document.querySelector('.shareableLink').style.display = 'block'; 
    document.addEventListener('mouseup', ()=>{document.querySelector('.shareableLink').style.display = 'none'; document.removeEventListener('mouseup', this);});
}

function getData(options, retries, func){
    for (let index = 0; index <= retries; index++) {
        try {
            request = fetch(backendServerURL + options, {method: 'POST', redirect: "follow", headers: {"Content-Type": "text/plain;charset=utf-8"}}).catch(error=>{return {status: "error", reply: "Server error. Reloading or trying again later may resolve the issue."};}).then(res=>{if(res.status == "error") return res; else return res.json()}).then(data=>{func(data);});
            return;
        } catch (error) {
            console.error(error);
        }
    }
    func({status: "error", reply: "Server error. Reloading or trying again later may resolve the issue."});
}

function navigate(nav){
    var loc = currentLoc;
    for (let index = 0; index < nav.length; index++) {

    }
}
const urlSearchParams = new URLSearchParams(window.location.search);

if(urlSearchParams.has('stage')){
    localStorage.setItem('stage', urlSearchParams.get('stage'));
    window.location.href = window.location.origin + window.location.pathname;
}

const invisibleChar = '\u200B'; // Zero-width space
const commandList = ['help', 'login','dir', 'cd', 'copy', 'del', 'move', 'mkdir', 'rmdir', 'type'];
const backendServerURL = "https://script.google.com/macros/s/AKfycbz7u3ptL_cm1KEhy04Llu-TNKIVf1kgRio22WRSNmdeU1e2W_jq-xFU9W_SLFh9DT8IQQ/exec";

const TOS = document.querySelector('.container h1');
const input = document.getElementById('input');

var savedLog = "";

var holdMyBeer = false;

function WriteText(string, speed) {
    return new Promise((resolve) => {
        if (isReadyForInput) holdMyBeer = true;
        let i = 0;
        let interval = setInterval(() => {
            if (string[i] === '\n')
                savedLog += '<br>';
            else
                savedLog += string[i];
            i++;
            if (i === string.length) {
                clearInterval(interval);
                if (holdMyBeer) {
                    holdMyBeer = false;
                    isReadyForInput = true;
                }
                resolve(); // Resolve the promise when the text writing is complete
            }
            TOS.innerHTML = savedLog;
        }, speed);
    });
}

function WriteLine(string) {
    savedLog += string;
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
    "  Hard Drive Test: TCS-250GB - OK",
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
            savedLog += "<br>";
            WriteText(step, speed);
        }, delay);

        delay += step.length * speed + 250; // Adds a pause between each step (500ms here)
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
    const parts = command.split(' ');
    return parts;
}

function runCommand(command) {
    const args = extractArguments(command);
    switch(args[0]) {
        case 'help':
            console.log(args[1]);
            WriteText("<br>Available commands: " + commandList.join(', ') + "<br>Type 'help' followed by a command for more information on a specific command.", 10).then(()=>{
                if(localStorage.getItem("stage") == "d976e9d7-2c35-4130-b97a-eda83419e709") WriteText("<br>Many commands do not work without logging in. Please type 'login' to continue.").then(()=>WriteLine('<br>' + "> "));
                else WriteLine('<br>' + "> ");
            });
            break;
        case 'login':
            if(args.length < 3){
                WriteLine("<br>Incorrect command usage, login [username] [password]");
                WriteLine('<br>' + "> ");
                break;
            }
            WriteLine("<br>Logging in...<br>");
            isReadyForInput = false;
            console.log(backendServerURL + "?cmd=login&user="+args[1]+"&pwd="+args[2]);
            fetch(backendServerURL + "?cmd=login&user="+args[1]+"&pwd="+args[2], {method: 'POST'}).then(res=>res.json()).then(data=>{
                if(data.result == "success"){
                    WriteLine("<br>" + data.reply + "<br>" + "> ");
                    localStorage.setItem('stage', data.stage);
                    GetStageNumber();
                }
                else{
                    WriteLine("<br>" + data.reply + "<br>" + "> ");
                }
                isReadyForInput = true;
            });
            break;
        default:
            WriteLine("<br>'" + command + "' is not recognized as an internal command, ensure drives are mounted correctly if trying to access files.");
            WriteLine('<br>' + "> ");
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
    
    fetch(backendServerURL + "?cmd=stage&stage=" + localStorage.getItem('stage'), {method: 'POST'}).then(res=>res.json()).then(data=>{
        document.getElementById("stageLabel").innerText = "Stage " + data.stage;
    });
}
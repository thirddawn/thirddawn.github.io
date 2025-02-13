const urlSearchParams = new URLSearchParams(window.location.search);

if(urlSearchParams.has('stage')){
    localStorage.setItem('stage', urlSearchParams.get('stage'));
    window.location.href = window.location.origin + window.location.pathname;
}

const invisibleChar = '\u200B'; // Zero-width space
const commandList = [
    'help', 'login', 'dir', 'ls', 'cd', 'type', 'cat', 'echo', 'whoami', 'open', 'ping', 'uptime', 'clear', 'cls', "mount"
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
var structure = [{"name": "Filesystem not initialized..."}];
var isStructureInitialized = false;

function UpdateText(time){
    delta = time - previousTimestamp;
    previousTimestamp = time;
    charsAdded += delta * charsPerSecond/ 1000;
    charsAdded = Math.min(charsAdded, queue.length);
    if(Math.round(charsAdded) > 0){
        var toAdd = queue.substring(0, Math.round(charsAdded));
        if(toAdd.includes("<") && !toAdd.includes(">")){
            const index = queue.substring(Math.round(charsAdded)).indexOf(">");
            charsAdded += index;
        }
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

    setTimeout(() => {isReadyForInput = true; localStorage.setItem('stage', "d976e9d7-2c35-4130-b97a-eda83419e709");}, delay);
}

if (localStorage.getItem('stage') === null) {
displaySteps();
}
else{
    GetStageNumber();
    WriteLine("<br>> ");
    isReadyForInput = true;
}

let commandLog = [];
let commandIndex = -1;
const maxLogSize = 50;

document.addEventListener('keydown', function(event) {
    if (isReadyForInput) {
        if (!TOS) return;

        if (event.key === 'ArrowUp') {
            if (commandIndex > 0) {
                commandIndex--;
                input.value = commandLog[commandIndex];
            }
        } else if (event.key === 'ArrowDown') {
            if (commandIndex < commandLog.length - 1) {
                commandIndex++;
                input.value = commandLog[commandIndex];
            } else {
                commandIndex = commandLog.length;
                input.value = '';
            }
        }

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
            if(currentText.startsWith("cd")){
                const currentFolder = getFolder(currentLoc);
                const matchingFolder = currentFolder.find(folder => {return folder.name.startsWith(currentText.split(/\s+/)[1]) && "folder" in folder;});
                if (matchingFolder) {
                    input.value = input.value.replace(currentText.split(/\s+/)[1], matchingFolder.name);
                    document.getElementById('hint').innerText = ''; // Clear hint
                }
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
    if(currentText.startsWith("cd")){
        const currentFolder = getFolder(currentLoc);
        const matchingFolder = currentFolder.find(folder => {return folder.name.startsWith(currentText.split(/\s+/)[1]) && "folder" in folder;});
        if (matchingFolder) {
            document.getElementById('hint').innerText = matchingFolder.name;
        }
    }
});

function extractArguments(command) {
    const parts = command.split(/\s+/);
    return parts;
}

function runCommand(command) {
    if (commandLog.length >= maxLogSize) {
        commandLog.shift();
    }
    commandLog.push(command);
    commandIndex = commandLog.length;
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
            if(localStorage.getItem("stage") === null || localStorage.getItem("stage") == "d976e9d7-2c35-4130-b97a-eda83419e709"){
                WriteText("<br>Access denied. Please login to continue.<br>> ");
                break;
            }
            if(!isStructureInitialized) getStructure();
            listCurrentFolder(true);
            WriteText("> ");
            break;
        case 'ls':
            if(localStorage.getItem("stage") === null || localStorage.getItem("stage") == "d976e9d7-2c35-4130-b97a-eda83419e709"){
                WriteText("<br>Access denied. Please login to continue.<br>> ");
                break;
            }
            if(!isStructureInitialized) getStructure();
            listCurrentFolder(true);
            WriteText("> ");
            break;
        case 'cd':
            if(localStorage.getItem("stage") === null || localStorage.getItem("stage") == "d976e9d7-2c35-4130-b97a-eda83419e709"){
                WriteText("<br>Access denied. Please login to continue.<br>> ");
                break;
            }
            if(args.length < 2){
                WriteText("<br>Incorrect command usage, cd [folder]<br>> ");
                break;
            }
            if(args[1] == ".."){
                currentLoc.pop();
            }
            else{
                changeFolder(args[1]);
            }
            listCurrentFolder(true);
            WriteText("> ");
            break;
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
        if(data.status == "failure") return;
        document.getElementById("stageLabel").innerText = "Stage " + data.reply;
    });
    getStructure();
}

function getStructure(){
    getData("?cmd=structure&stage=" + localStorage.getItem('stage'), 5, data=>{
        if(data.status == "failure") return;
        structure = JSON.parse(data.reply);
        isStructureInitialized = true;
    });
}

function showStage(){
    document.querySelector('.shareableLink').style.display = 'block'; 
    document.addEventListener('mouseup', ()=>{document.querySelector('.shareableLink').style.display = 'none'; document.removeEventListener('mouseup', this);});
}

function getData(options, retries, func){
    for (let index = 0; index <= retries; index++) {
        try {
            request = fetch(backendServerURL + options, {method: 'POST', redirect: "follow", headers: {"Content-Type": "text/plain;charset=utf-8"}}).catch(error=>{return {status: "failure", reply: "Server error. Reloading or trying again later may resolve the issue."};}).then(res=>{if(res.status == "failure") return res; else return res.json()}).then(data=>{func(data);});
            return;
        } catch (error) {
            console.error(error);
        }
    }
    func({status: "failure", reply: "Server error. Reloading or trying again later may resolve the issue."});
}

function getNamedPath(nav){
    var path = [];
    var folder = structure;
    for(let index = 0; index < nav.length; index++){
        path.push(folder[index]["name"]);
        folder = folder[index]["folder"];
    }
    return path;
}

function listCurrentFolder(showPath = false){
    var folder = getFolder(currentLoc);
    var output = "<br>";
    var indent = 0;
    if(showPath){
        var path = getNamedPath(currentLoc);
        indent = path.length;
        for(let index = 0; index < path.length; index++){
            filler = path[index].endsWith(".lnk") ? ">" : "─"
            output += "<span class='darker'>" + "  ".repeat(index) + "└" + filler + "┬─ " + path[index] + "</span><br>";
        }
    }
    if(folder != null)
    {
        for(let index = 0; index < folder.length; index++){
            output += "  ".repeat(indent) + (index == folder.length - 1 ? "└── " : "├── ") + folder[index]["name"] + "<br>";
        }
    }
    WriteText(output);
}

function getFolder(nav){
    var folder = structure;
    for(let index = 0; index < nav.length; index++){
        if("folder" in folder[nav[index]])
        {
            folder = folder[nav[index]]["folder"];
        }
        else{
            return null;
        }
    }
    return folder;
}

function changeFolder(folderName){
    var folder = getFolder(currentLoc);
    if(folder == null) folder = structure;
    for(let index = 0; index < folder.length; index++){
        if(folder[index]["name"] == folderName){
            currentLoc.push(index);
            if (folderName.endsWith(".lnk")) WriteText("\nFollowing net-link");
            return folder[index];
        }
    }
}